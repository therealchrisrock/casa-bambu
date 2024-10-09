import type { DateAfter, DateBefore, DateRange, Matcher } from 'react-day-picker'
import { addDays, differenceInDays } from 'date-fns'

import type { Booking, Settings } from '../../../payload/payload-types'

export const DEFAULT_MIN_DAYS = 5
export const DEFAULT_LAST_BOOKING_DATE = 365 // Bookings must be made within 1 year of the present day
export function getSettings(settings: Settings): Settings {
  if (!settings?.advancedBookingLimit) settings.advancedBookingLimit = DEFAULT_LAST_BOOKING_DATE
  if (!settings?.minBooking) settings.minBooking = DEFAULT_MIN_DAYS
  return settings
}
export function findFirstAvailableDateRange(
  bookings: Booking[],
  minDays = DEFAULT_MIN_DAYS,
  lastAvailableBookingDate: number = DEFAULT_LAST_BOOKING_DATE,
): DateRange | null {
  const sortedBookings = bookings
    .filter(b => new Date(b.endDate) >= new Date()) // Ignore bookings that are entirely in the past
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
  const today = addDays(new Date(), 3)
  const maxBookingDate = addDays(today, lastAvailableBookingDate)

  // Check for the gap before the first booking
  if (
    sortedBookings.length === 0 ||
    differenceInDays(new Date(sortedBookings[0].startDate), today) >= minDays
  ) {
    const potentialEndDate = addDays(today, minDays)
    if (potentialEndDate <= maxBookingDate) {
      return {
        from: today,
        to: potentialEndDate,
      }
    } else {
      return null // No valid dates found within the specified range
    }
  }

  // Check for gaps between bookings
  for (let i = 0; i < sortedBookings.length - 1; i++) {
    const currentEndDate = new Date(sortedBookings[i].endDate)
    const nextStartDate = new Date(sortedBookings[i + 1].startDate)

    const gap = differenceInDays(nextStartDate, currentEndDate)
    if (gap >= minDays - 1) {
      const potentialEndDate = addDays(currentEndDate, minDays - 1)
      if (potentialEndDate <= maxBookingDate) {
        return {
          from: currentEndDate,
          to: potentialEndDate,
        }
      }
    }
  }

  // Check for the gap after the last booking
  const lastBookingEndDate = new Date(sortedBookings[sortedBookings.length - 1].endDate)
  const potentialEndDate = addDays(lastBookingEndDate, minDays - 1)
  if (potentialEndDate <= maxBookingDate) {
    return {
      from: lastBookingEndDate,
      to: potentialEndDate,
    }
  }

  return null // No valid dates found within the specified range
}
export function getUnavailableDates(bookings: Booking[], settings: Settings): Matcher[] {
  const unavailableDates: Matcher[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Ensure today has no time component

  bookings.forEach(booking => {
    const startDate = new Date(booking.startDate)
    const endDate = new Date(booking.endDate)

    for (let date = startDate; date < endDate; date = addDays(date, 1)) {
      if (date >= addDays(today, 1)) {
        // Exclude dates before today
        unavailableDates.push(new Date(date))
      }
    }
  })
  // Exclude today's date
  const outerBounds: [DateBefore, DateAfter] = [
    { before: addDays(today, 2) },
    {
      after: addDays(
        today,
        settings?.advancedBookingLimit ? settings.advancedBookingLimit : DEFAULT_LAST_BOOKING_DATE,
      ),
    },
  ]
  unavailableDates.push(...outerBounds)
  return unavailableDates
}
