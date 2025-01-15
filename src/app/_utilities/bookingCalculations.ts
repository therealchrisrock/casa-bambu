import type { DateRange } from 'react-day-picker'
import { differenceInDays, endOfDay, isAfter, isBefore, startOfDay } from 'date-fns'
import type { Maybe } from 'graphql/jsutils/Maybe'

import type { CartItems, Product, Settings } from '../../payload/payload-types'

import type { CartItem } from '@/_providers/Cart/reducer'
import { UTCDate } from '@date-fns/utc'

export interface AdditionalFee {
  label: string
  priceID?: string
  total: number
  unitAmount: number
  quantity: number
  description?: string
}

export interface GuestFee {
  extraGuests: number
  unitAmount: number
  total: number
  priceID: string
}

export type Coupon = Array<Omit<AdditionalFee, 'priceID'> & { couponID: string }>

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

export const calculateBookingDetails = (
  product: Product,
  dates: DateRange,
  guestsQuantity: number,
  settings: Settings,
): BookingDetails | null => {
  if (!dates?.from || !dates?.to) return null
  const variants = product.variants
  const prices = JSON.parse(product.priceJSON).data
  const items: Array<CartItem & { nickname: string }> = []
  const additionalFees = []
  let subtotal = 0
  let totalNights = 0

  // Ensure dates are handled in UTC without local timezone conversion
  const bookingStart = new UTCDate(dates.from.toISOString().split('T')[0])
  const bookingEnd = new UTCDate(dates.to.toISOString().split('T')[0])
  let coveredNights = 0
  variants.forEach(variant => {
    const seasonStart = startOfDay(new UTCDate(variant.seasonStart))
    const seasonEnd = endOfDay(new UTCDate(variant.seasonEnd))

    if (isAfter(bookingEnd, seasonStart) && isBefore(bookingStart, seasonEnd)) {
      const priceDetails = prices.find(price => price.id === variant.priceID)
      if (!priceDetails) return
      const rangeStart = isBefore(bookingStart, seasonStart) ? seasonStart : bookingStart
      let rangeEnd = isAfter(bookingEnd, seasonEnd) ? seasonEnd : bookingEnd

      let daysInRange = rangeStart < rangeEnd ? differenceInDays(rangeEnd, rangeStart) : 0
      if (isAfter(bookingEnd, rangeEnd)) {
        daysInRange++
      }
      // console.log('daysInRange', daysInRange, priceDetails.unit_amount, rangeStart, rangeEnd)
      subtotal += daysInRange * priceDetails.unit_amount
      totalNights += daysInRange
      coveredNights += daysInRange
      items.push({
        stripeProductID: product.stripeProductID,
        product: product,
        priceID: variant.priceID,
        quantity: daysInRange,
        nickname: priceDetails.nickname,
      })
    }
  })

  const defaultPrice = prices[0]
  const uncoveredNights = differenceInDays(bookingEnd, bookingStart) - coveredNights
  if (uncoveredNights > 0) {
    console.log('uncoveredNights', uncoveredNights)
    subtotal += uncoveredNights * defaultPrice.unit_amount
    totalNights += uncoveredNights

    items.push({
      stripeProductID: product.stripeProductID,
      product: product,
      priceID: defaultPrice.priceID,
      quantity: uncoveredNights,
      nickname: 'Default (Fallback) Price',
    })
  }
  if (totalNights === 0) return null
  const averageRate = Math.ceil(subtotal / totalNights / 100)
  const basePrice = Math.ceil(subtotal / 100)
  const extraGuests = guestsQuantity - product.baseGuestQuantity
  const guestFeeJSON = JSON.parse(product.guestFeePriceJSON)
  let guestFee: GuestFee
  if (extraGuests > 0 && guestFeeJSON?.data) {
    const guestP = guestFeeJSON.data[0]
    const u = guestP?.unit_amount ?? 0
    const t = u * extraGuests * totalNights
    guestFee = {
      extraGuests,
      priceID: guestP.id,
      unitAmount: Math.ceil(u / 100),
      total: Math.ceil(t / 100),
    }
    additionalFees.push({
      priceID: guestP.id,
      unitAmount: Math.ceil(u / 100),
      quantity: extraGuests * totalNights,
      total: Math.ceil(t / 100),
      label: 'Extra Guest Fee',
    })
    subtotal += t
  }
  if (settings.stripeCleaningFeeJSON) {
    const c = JSON.parse(settings.stripeCleaningFeeJSON)?.data[0]
    if (c) {
      additionalFees.push({
        label: 'Cleaning Fee',
        quantity: 1,
        unitAmount: Math.ceil((c?.unit_amount ?? 0) / 100),
        total: Math.ceil((c?.unit_amount ?? 0) / 100),
        priceID: c.id,
      })
      subtotal += c.unit_amount
    }
  }

  const coupons = []
  const applicableCoupon = product.coupons
    .filter(a => {
      const c = JSON.parse(a.stripeCouponJSON)
      return c.valid
    })
    .sort((a, b) => a.nights - b.nights)
    .reverse()
    .find(x => x.nights <= totalNights)
  if (applicableCoupon) {
    const c = JSON.parse(applicableCoupon.stripeCouponJSON)
    let amt = 0
    if (c?.amount_off) {
      const p = c.amount_off
      amt += p
    }
    if (c?.percent_off) {
      const p = (subtotal * c.percent_off) / 100
      amt += p
    }
    subtotal -= amt
    coupons.push({
      label: applicableCoupon.nickname,
      total: Math.ceil(amt / 100),
      couponID: applicableCoupon.stripeCoupon,
    })
  }
  console.log('duration', totalNights)
  return {
    listing: product.title,
    productID: product.id,
    dates,
    items,
    averageRate,
    basePrice,
    duration: totalNights,
    from: bookingStart.toISOString().split('T')[0],
    to: bookingEnd.toISOString().split('T')[0],
    subtotal: Math.ceil(subtotal / 100),
    guestFee,
    total: Math.ceil(subtotal / 100),
    guestCount: guestsQuantity,
    currency: 'cad',
    additionalFees,
    coupons,
  }
}

function getTotalNights(from: Date, to: Date, isExclusive: boolean): number {
  // Ensure the dates are handled in UTC and the time is reset to midnight
  const start = new Date(from.toISOString().split('T')[0])
  const end = new Date(to.toISOString().split('T')[0])

  // If isExclusive is true, subtract 1 from the end date (i.e., don't count the checkout day)
  if (isExclusive) {
    end.setDate(end.getDate() - 1)
  }

  // Calculate the difference in days
  const totalNights = Math.max(0, differenceInDays(end, start))

  return totalNights
}
