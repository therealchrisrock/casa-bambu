import { addDays, differenceInDays } from 'date-fns'

import type { Booking } from '../../../payload/payload-types'

export const MIN_DAYS = 4
export function findFirstAvailableDateRange(
  bookings: Booking[],
  minDays = MIN_DAYS,
): { startDate: Date; endDate: Date } | null {
  // Sort bookings by startDate
  const sortedBookings = bookings
    .filter(b => new Date(b.endDate) >= new Date()) // Ignore bookings that are entirely in the past
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

  const today = new Date()

  // Check for the gap before the first booking
  if (
    sortedBookings.length === 0 ||
    differenceInDays(new Date(sortedBookings[0].startDate), today) >= minDays
  ) {
    return {
      startDate: today,
      endDate: addDays(today, minDays - 1),
    }
  }

  // Check for gaps between bookings, allowing new bookings to start on the endDate of the previous booking
  for (let i = 0; i < sortedBookings.length - 1; i++) {
    const currentEndDate = new Date(sortedBookings[i].endDate)
    const nextStartDate = new Date(sortedBookings[i + 1].startDate)

    const gap = differenceInDays(nextStartDate, currentEndDate)
    if (gap >= minDays - 1) {
      // Allow a new booking to start on the same day as currentEndDate
      return {
        startDate: currentEndDate,
        endDate: addDays(currentEndDate, minDays - 1),
      }
    }
  }

  // Check for the gap after the last booking
  const lastBookingEndDate = new Date(sortedBookings[sortedBookings.length - 1].endDate)
  return {
    startDate: lastBookingEndDate,
    endDate: addDays(lastBookingEndDate, minDays - 1),
  }
}
export function getUnavailableDates(bookings: Booking[]): Date[] {
  const unavailableDates: Date[] = []
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ensure today has no time component

  bookings.forEach(booking => {
    const startDate = new Date(booking.startDate)
    const endDate = new Date(booking.endDate)

    for (let date = startDate; date < endDate; date = addDays(date, 1)) {
      if (date >= today) { // Exclude dates before today
        unavailableDates.push(new Date(date))
      }
    }
  })

  return unavailableDates
}
