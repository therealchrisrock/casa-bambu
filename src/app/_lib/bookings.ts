import type { Matcher } from 'react-day-picker'
import { dateMatchModifiers } from 'react-day-picker'
import {
  eachDayOfInterval,
  parseISO,
} from 'date-fns'

import type { Booking, Product, Settings, User } from '../../payload/payload-types'

import type { BookingDetails } from '@/_utilities/bookingCalculations'
import { getDateForStorage } from '@/_utilities/formatDateTime'
import { findFirstAvailableDateRange, getUnavailableDates } from '@/(pages)/products/utils'

export interface BookingSearchParams extends Record<string, string> {
  from: string
  to: string
  guests: string
}

export interface BookingInfo {
  from: Date
  to: Date
  guests: number
}

export function getSelectedBookingDetails(searchParams: {
  [key: string]: string | string[] | undefined
}): BookingSearchParams {
  return
  // return {
  //   from,
  //   to,
  //   guests
  // }
}

export function getDefaultProps(
  product: Product,
  bookings: Booking[],
  settings: Settings,
): BookingSearchParams {
  const initDates = findFirstAvailableDateRange(
    bookings,
    settings.minBooking,
    settings.advancedBookingLimit,
  )
  const initGuests = product.baseGuestQuantity
  return {
    guests: String(initGuests),
    from: getDateForStorage(initDates.from),
    to: getDateForStorage(initDates.to),
  }
}



export const parseDateAsUTC = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day)) // Month is 0-based in Date.UTC
}

export async function createBooking(booking: BookingDetails, user: User, message: string) {
  try {
    const res = await fetch('/api/create-invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: booking.from,
        to: booking.to,
        guests: booking.guestCount,
        pid: booking.productID,
        message,
      }),
    })
  } catch (err) {
    console.error('an error has occurred', err)
  }
}
