import type { Matcher } from 'react-day-picker'
import { eachDayOfInterval, isAfter, isBefore, isWithinInterval, parseISO } from 'date-fns'

import type { Booking, Product, Settings, User } from '../../payload/payload-types'

import type { BookingDetails } from '@/_utilities/bookingCalculations'
import { getDateForStorage } from '@/_utilities/formatDateTime'
import { findFirstAvailableDateRange, getUnavailableDates } from '@/(pages)/products/utils'

interface BookingSearchParams extends Record<string, string> {
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
  console.log('searchParams', searchParams)
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
  console.log('get default props', bookings)
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

export function isValidBooking(
  params: BookingSearchParams,
  bookings: Booking[],
  settings: Settings,
): boolean {
  const fromDate = parseISO(params.from) // Parse the "from" date string into a Date object
  const toDate = parseISO(params.to)
  const bookingDates = eachDayOfInterval({ start: fromDate, end: toDate }) // Get each day in the range
  const unavailableDates = getUnavailableDates(bookings, settings)
  const isAvailable = isBookingAvailable(params.from, params.to, unavailableDates)
  const hasValidDuration = bookingDates.length >= settings.minBooking
  return isAvailable && hasValidDuration
}

export function isBookingAvailable(
  from: string | Date,
  to: string | Date,
  unavailableDates: Matcher[],
): boolean {
  const fromDate = typeof from === 'string' ? parseISO(from) : from // Parse the "from" date string into a Date object
  const toDate = typeof to === 'string' ? parseISO(to) : to
  const bookingDates = eachDayOfInterval({ start: fromDate, end: toDate }) // Get each day in the range
  return !bookingDates.some(date => isDateMatched(date, unavailableDates))
}

// Function to check if a given date matches any of the Matchers
function isDateMatched(date: Date, matchers: Matcher[]): boolean {
  return matchers.some(matcher => {
    if (typeof matcher === 'boolean') {
      return matcher
    }
    if (typeof matcher === 'function') {
      return matcher(date)
    }
    if (matcher instanceof Date) {
      return date.getTime() === matcher.getTime()
    }
    if (Array.isArray(matcher)) {
      return matcher.some(d => d.getTime() === date.getTime())
    }
    if ('from' in matcher && 'to' in matcher) {
      // DateRange or DateInterval
      const { from, to } = matcher
      return isWithinInterval(date, { start: from, end: to || new Date() })
    }
    if ('before' in matcher) {
      // DateBefore
      return isBefore(date, matcher.before)
    }
    if ('after' in matcher) {
      // DateAfter
      return isAfter(date, matcher.after)
    }
    if ('dayOfWeek' in matcher) {
      // DayOfWeek
      return date.getDay() === matcher.dayOfWeek
    }
    return false
  })
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
        message
      }),
    })
  } catch(err) {
    console.error('an error has occurred', err)
  }
}
