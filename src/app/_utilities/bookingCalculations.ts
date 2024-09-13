import type { DateRange } from 'react-day-picker'
import { addDays, differenceInDays, endOfDay, isAfter, isBefore, startOfDay } from 'date-fns'
import type { Maybe } from 'graphql/jsutils/Maybe'

import type { CartItems, Product, Settings } from '../../payload/payload-types'

import type { CartItem } from '@/_providers/Cart/reducer'

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
  variants.forEach(variant => {
    const seasonStart = startOfDay(new Date(variant.seasonStart))
    const seasonEnd = endOfDay(new Date(variant.seasonEnd))
    const bookingStart = dates.from
    const bookingEnd = dates.to
    if (isAfter(bookingEnd, seasonStart) && isBefore(bookingStart, seasonEnd)) {
      const priceDetails = prices.find(price => price.id === variant.priceID)
      if (!priceDetails) return
      const rangeStart = isBefore(bookingStart, seasonStart) ? seasonStart : bookingStart
      let rangeEnd = isAfter(bookingEnd, seasonEnd) ? seasonEnd : bookingEnd
      // Include the last night for the first range
      // Exclude the end date for the final checkout day
      // if (rangeEnd === bookingEnd) {
      //   rangeEnd = addDays(rangeEnd, 1)
      // }

      const daysInRange = rangeStart < rangeEnd ? differenceInDays(rangeEnd, rangeStart) : 0
      subtotal += daysInRange * priceDetails.unit_amount
      totalNights += daysInRange
      items.push({
        stripeProductID: product.stripeProductID,
        product: product,
        priceID: variant.priceID,
        guestsQuantity,
        quantity: daysInRange,
        from: rangeStart.toISOString().split('T')[0],
        to: rangeEnd.toISOString().split('T')[0],
        nickname: priceDetails.nickname,
      })
    }
  })
  if (totalNights === 0) return null

  const averageRate = Math.ceil(subtotal / totalNights / 100)

  let total = subtotal
  const extraGuests = guestsQuantity - product.baseGuestQuantity
  const guestFeeJSON = JSON.parse(product.guestFeePriceJSON)
  let guestFee: GuestFee
  if (extraGuests > 0 && guestFeeJSON?.data) {
    const guestP = guestFeeJSON.data[0]
    const u = guestP?.unit_amount ?? 0
    const t = u * extraGuests * totalNights
    guestFee = {
      extraGuests,
      unitAmount: Math.ceil(u / 100),
      priceID: guestP.id,
      total: Math.ceil(t / 100),
    }
    total += t
  }

  if (settings.stripeCleaningFeeJSON) {
    const c = JSON.parse(settings.stripeCleaningFeeJSON)?.data[0]
    if (c) {
      additionalFees.push({
        label: 'Cleaning Fee',
        total: Math.ceil((c?.unit_amount ?? 0) / 100),
        priceID: c.id,
      })
      total += c.unit_amount
    }
  }

  const coupons = []
  const applicableCoupon = product.coupons
    .sort((a, b) => a.quantity - b.quantity)
    .reverse()
    .find(x => x.quantity <= totalNights)
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
    total -= amt
    coupons.push({
      label: applicableCoupon.nickname,
      total: Math.ceil(amt / 100),
      couponID: applicableCoupon.stripeCoupon,
    })
  }
  return {
    productID: product.id,
    dates,
    items,
    averageRate,
    duration: totalNights,
    subtotal: Math.ceil(subtotal / 100),
    guestFee,
    total: Math.ceil(total / 100),
    guestCount: guestsQuantity,
    currency: 'cad',
    additionalFees,
    coupons,
  }
}
