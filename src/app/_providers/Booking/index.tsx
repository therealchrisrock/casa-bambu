'use client'

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { DateRange, Matcher } from 'react-day-picker'
import { Maybe } from 'graphql/jsutils/Maybe'
import { useRouter, useSearchParams } from 'next/navigation'

import { Booking, CartItems, Product, Settings } from '../../../payload/payload-types'

import { calculateBookingDetails } from '@/_utilities/bookingCalculations'
import { getSettings, getUnavailableDates } from '@/(pages)/products/utils'
import { isBookingAvailable, parseDateAsUTC } from '@/_lib/bookings'
import { UTCDate } from '@date-fns/utc'
import { eachDayOfInterval } from 'date-fns'

interface AdditionalFee {
  label: string
  priceID?: string
  total: number
  description?: string
}

interface GuestFee {
  extraGuests: number
  unitAmount: number
  total: number
  priceID: string
}

type Coupon = Array<Omit<AdditionalFee, 'priceID'> & { couponID: string }>

export interface BookingDetails {
  listing: string
  productID: string
  dates: DateRange
  items: CartItems
  averageRate: number
  total: number
  duration: number
  guestCount: number
  subtotal: number
  currency: string
  guestFee: Maybe<GuestFee>
  additionalFees: AdditionalFee[]
  coupons: Coupon
  from: string
  basePrice: number
  to: string
}

interface BookingContextType {
  booking: BookingDetails | null
  setBooking: (booking: BookingDetails) => void
  clearBooking: () => void
  product: Product
  unavailableDates: Matcher[]
  settings: Settings
  setDates:  (dates: DateRange) => void
  isValidBooking: () => boolean

}

// Create the context
const BookingContext = createContext<BookingContextType | undefined>(undefined)

// Create a custom hook for consuming the booking context
export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}

// Provider component to wrap your app
export const BookingProvider = ({
  children,
  product,
  settings: settingsProp,
  bookings,
}: {
  children: ReactNode
  product: Product
  settings: Settings
  bookings: Booking[]
}) => {
  const [hasInitialized, setHasInitialized] = useState(false) // Guard for initial load
  const [booking, setBookingState] = useState<BookingDetails | null>(null)
  const searchParams = useSearchParams() // Retrieve search parameters
  const router = useRouter()
  const settings = getSettings(settingsProp)
  const setBooking = (newBooking: BookingDetails) => {
    setBookingState(newBooking)
  }

  const clearBooking = () => {
    setBookingState(null)
  }

  // Sync the booking details with the search params
  useEffect(() => {
    console.log('search params', searchParams.get('guests'))
    const guestsQuantity = parseInt(searchParams.get('guests'), 10)
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    if (product && from && to) {
      console.log('search params inner', searchParams.get('guests'), searchParams.get('from'))
      // Convert search params into the DateRange object
      const dates: DateRange = {
        from: new UTCDate(from),
        to: new UTCDate(to),
      }

      // Fetch product and settings objects based on productID
      // You would retrieve these based on your app’s logic, here's a placeholder

      // Calculate booking details
      const calculatedBookingDetails = calculateBookingDetails(
        product,
        dates,
        guestsQuantity,
        settings,
      )

      if (calculatedBookingDetails) {
        setBookingState(calculatedBookingDetails)
        setHasInitialized(true) // Set initialization guard
      }
    }
  }, [searchParams])
  const isValidBooking = (): boolean => {
    if (!booking?.dates?.from || !booking?.dates?.to || !booking.guestCount) return false

    const fromDate = booking.dates.from
    const toDate = booking.dates.to

    const bookingDates = eachDayOfInterval({ start: fromDate, end: toDate })
    const isAvailable = isBookingAvailable(fromDate, toDate, unavailableDates)
    const hasValidDuration = bookingDates.length >= settings.minBooking
    const hasValidGuestCount = booking.guestCount >= 1 && booking.guestCount <= product.maxGuestQuantity
    return isAvailable && hasValidDuration && hasValidGuestCount
  }

  const setDates = (dates: DateRange) => {
    if (booking) {
      const updatedBooking = {
        ...booking,
        dates,
        from: dates.from?.toISOString().split('T')[0] || '',
        to: dates.to?.toISOString().split('T')[0] || '',
      }
      setBookingState(updatedBooking)
    }
  }
  // Update the URL when booking details change
  useEffect(() => {
    if (hasInitialized && booking) {
      const updatedSearchParams = new URLSearchParams()
      updatedSearchParams.set('guests', booking.guestCount.toString())
      updatedSearchParams.set('from', booking.from)
      updatedSearchParams.set('to', booking.to)
      router.replace(`?${updatedSearchParams.toString()}`, { scroll: false })
      // Add any other necessary parameters
      // Update the URL without reloading the page
    }
  }, [booking, hasInitialized])
  const unavailableDates = getUnavailableDates(bookings, settings)

  return (
    <BookingContext.Provider
      value={{ booking, setBooking, clearBooking, product, unavailableDates, settings, setDates, isValidBooking}}
    >
      {children}
    </BookingContext.Provider>
  )
}
