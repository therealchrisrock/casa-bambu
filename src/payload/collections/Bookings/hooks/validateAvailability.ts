import type { BeforeChangeHook } from 'payload/dist/collections/config/types'
import { APIError } from 'payload/errors'
import type { CollectionBeforeChangeHook, FieldHook } from 'payload/types'

import type { Booking, Product } from '../../../payload-types'
import { UTCDate } from '@date-fns/utc'
import { endOfDay, startOfDay } from 'date-fns'

interface Conflict {
  id1: string
  id2: string
  message: string
}
interface Season {
  id: string
  seasonStart: string // ISO date string
  seasonEnd: string // ISO date string
  priceID: string
}
export const validateAvailability: CollectionBeforeChangeHook<Booking> = async ({
  data, // incoming data to update or create with
  req, // full expre
  originalDoc
}) => {
  const hasValidDateRange = validateDateRange(new Date(data.startDate), new Date(data.endDate))
  if (!hasValidDateRange.isValid) {
    throw new APIError(
      `Issue with the selected date range — ${hasValidDateRange?.message} Please review your selection and try again`,
      400,
      data,
      true,
    )
  }
  const p = await req.payload.find({
    collection: 'bookings',
    where: {
      and: [
        {
          product: {
            equals: data.product,
          },
        },
        {
          id: {
            not_equals: originalDoc?.id
          }
        },
        {
          startDate: {
            less_than_equal: data.endDate,
          },
          endDate: {
            greater_than_equal: data.startDate,
          },
        },
      ],
    },
  })
  const conflicts = getConflicts(data, p.docs)
  if (!p || p.totalDocs === 0 || !conflicts) return data
  if (conflicts.length) {
    throw new APIError(
      `Scheduling conflict with an existing booking: ${conflicts.map(c => c.id)}`,
      409,
      { data, conflicts },
      false,
    )
  }
  return data // Return data to either create or update a document with
}
// function isAvailable(newBooking: Partial<Booking>, existingBookings: Booking[]) {
//   for (const existingBooking of existingBookings) {
//     const isValid =
//       newBooking.startDate >= existingBooking.endDate ||
//       newBooking.endDate <= existingBooking.startDate
//
//     if (!isValid) {
//       return false
//     }
//   }
//   return true
// }
function getConflicts(newBooking: Partial<Booking>, existingBookings: Booking[]): Booking[] {
  const conflicts: Booking[] = []
  const curr = {
    startDate: startOfDay(new Date(newBooking.startDate)),
    endDate: startOfDay(new Date(newBooking.endDate)),
  }
  for (const existingBooking of existingBookings) {
    const isValid =
      curr.startDate >= startOfDay(new Date(existingBooking.endDate)) ||
      curr.endDate <= startOfDay(new Date(existingBooking.startDate))

    if (!isValid) {
      conflicts.push(existingBooking)
    }
  }
  return conflicts
}

interface ValidDateRangeResult {
  isValid: true
  message?: string
}

interface InvalidDateRangeResult {
  isValid: false
  message: string
}

type DateRangeValidationResult = ValidDateRangeResult | InvalidDateRangeResult

export function validateDateRange(startDate: Date, endDate: Date): DateRangeValidationResult {
  if (startDate.toDateString() === endDate.toDateString()) {
    return {
      isValid: false,
      message: 'Start date and end date cannot be on the same date.',
    }
  }
  if (startDate > endDate) {
    return {
      isValid: false,
      message: 'Start date cannot be after the end date.',
    }
  }
  return {
    isValid: true,
  }
}

export const validateSeasonalPricing: FieldHook = ({
  value,
  data,
  siblingData,
}) => {
  const hasValidDateRange = validateDateRange(
    new Date(siblingData.seasonStart),
    new Date(siblingData.seasonEnd),
  )
  if (!hasValidDateRange.isValid) {
    throw new APIError(
      `Issue with the selected date range — ${hasValidDateRange?.message} Please review your selection and try again`,
      400,
      data,
      true,
    )
  }
  const conflicts = getPricingScheduleConflict(data.variants)
  if (conflicts.length) {
    throw new APIError(conflicts[0].message, 400, conflicts, true)
  }
  return value
}

function getPricingScheduleConflict(bookings: Season[]): Conflict[] {
  const conflicts: Conflict[] = []

  for (let i = 0; i < bookings.length; i++) {
    for (let j = i + 1; j < bookings.length; j++) {
      const bookingA = bookings[i]
      const bookingB = bookings[j]

      const startA = new Date(bookingA.seasonStart)
      const endA = new Date(bookingA.seasonEnd)
      const startB = new Date(bookingB.seasonStart)
      const endB = new Date(bookingB.seasonEnd)

      if (
        (startA < endB && endA > startB) || // Overlapping ranges
        startA.getTime() === endB.getTime() || // Same start and end date
        endA.getTime() === startB.getTime() // Same end and start date
      ) {
        conflicts.push({
          id1: bookingA.id,
          id2: bookingB.id,
          message: `Conflict between seasonal Pricing schedule (${bookingA.seasonStart} — ${bookingA.seasonEnd}) and (${bookingB.seasonStart} — ${bookingB.seasonEnd})`,
        })
      }
    }
  }

  return conflicts
}
