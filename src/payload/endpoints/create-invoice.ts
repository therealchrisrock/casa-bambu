import type { DateRange } from 'react-day-picker'
import { UTCDate } from '@date-fns/utc'
import { differenceInDays, endOfDay, format, isAfter, isBefore, startOfDay } from 'date-fns'
import type { PayloadHandler } from 'payload/config'
import Stripe from 'stripe'

import type { Product, Settings } from '../payload-types'

import type { CartItem } from '@/_providers/Cart/reducer'
import type { BookingDetails, GuestFee } from '@/_utilities/bookingCalculations'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-08-01',
})

// this endpoint creates a `PaymentIntent` with the items in the cart
// to do this, we loop through the items in the cart and lookup the product in Stripe
// we then add the price of the product to the total
// once completed, we pass the `client_secret` of the `PaymentIntent` back to the client which can process the payment
export const createInvoice: PayloadHandler = async (req, res): Promise<void> => {
  const { user, payload, body } = req

  if (!user) {
    res.status(401).send('Unauthorized')
    return
  }

  const fullUser = await payload.findByID({
    collection: 'users',
    id: user?.id,
  })

  const settings = await payload.findGlobal({
    slug: 'settings',
    depth: 2,
  })
  const product = await payload.findByID({
    collection: 'products',
    id: body.pid,
  })

  if (!settings) {
    res.status(404).json({ error: 'Settings not found' })
    return
  }
  if (!product) {
    res.status(404).json({ error: 'Product Details not found' })
    return
  }
  if (!fullUser) {
    res.status(404).json({ error: 'User not found' })
    return
  }

  try {
    let stripeCustomerID = fullUser?.stripeCustomerID

    // lookup user in Stripe and create one if not found
    if (!stripeCustomerID) {
      const customer = await stripe.customers.create({
        email: fullUser?.email,
        name: `${fullUser?.firstName} ${fullUser?.lastName}`,
      })

      stripeCustomerID = customer.id

      await payload.update({
        collection: 'users',
        id: user?.id,
        data: {
          stripeCustomerID,
        },
      })
    }

    if (!body.from || !body.to) {
      throw new Error(`No booking Dates Provided for ${body.from} — ${body.to}`)
      res.status(400).json({ error: 'Invalid Booking Dates' })
      return
    }
    const from = new UTCDate(body.from)
    const to = new UTCDate(body.to)
    const bookingDetails = calculateBookingDetails(
      product,
      {
        from: new UTCDate(body.from),
        to: new UTCDate(body.to),
      },
      body.guests,
      settings,
    )
    if (!bookingDetails) {
      res.status(500).json({ error: 'An unknown error has occurred. Please try again later.' })
      return
    }
    from.setUTCHours(12, 0, 0, 0)
    to.setUTCHours(12, 0, 0, 0)
    const booking = await payload.create({
      collection: 'bookings',
      data: {
        type: 'reservation',
        bookingStatus: 'pending',
        product: product.id,
        introduction: body.message,
        user: user.id,
        startDate: from.toISOString(),
        endDate: to.toISOString(),
      },
    })
    if (!booking) {
      res.status(500).json({
        error: 'An unknown error has occurred creating the booking. Please try again later.',
      })
      return
    } else {
      payload.logger.info(`New Booking Successfully created — ${booking.id}`)
    }
    const invoice = await stripe.invoices.create({
      customer: stripeCustomerID,
      collection_method: 'send_invoice',
      days_until_due: 4,
      currency: 'cad',
      description: '',
      custom_fields: [
        {
          name: 'check-in date',
          value: formatDateToDayMonthYear(new UTCDate(body.from)),
        },
        {
          name: 'check-out date',
          value: formatDateToDayMonthYear(new UTCDate(body.to)),
        },
      ],
      ...(bookingDetails.coupons && {
        discounts: bookingDetails.coupons.map(d => ({ coupon: d.couponID })),
      }),
    })
    if (!invoice) {
      res.status(500).json({
        error: 'An unknown error has occurred creating the invoice. Please try again later.',
      })
      return
    } else {
      payload.logger.info(`New Invoice Successfully created — ${invoice.id}`)
    }
    const invoiceAdded = await payload.update({
      collection: 'bookings',
      id: booking.id,
      data: {
        invoice: invoice.id,
      },
    })
    for (const item of bookingDetails.items) {
      await stripe.invoiceItems.create({
        customer: stripeCustomerID,
        price: item.priceID,
        quantity: item.quantity,
        currency: 'cad',
        invoice: invoice.id,
      })
    }
    for (const f of bookingDetails.additionalFees) {
      await stripe.invoiceItems.create({
        customer: stripeCustomerID,
        price: f.priceID,
        quantity: f.quantity,
        currency: 'cad',
        invoice: invoice.id,
        // discountable: false,
      })
    }
    payload.logger.info('Invoice Items have been added to invoice')
    res.status(200).json({})
    return
  } catch (error: any) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    payload.logger.error(message)
    // if (error?.status === 409)
    //   res.status(409).json({
    //     status: 'booked',
    //     error: 'The selected dates are no longer available',
    //     message: 'The selected dates are no longer available',
    //   })
    res.json({ error: message })
    return
  }
}
function formatDateToDayMonthYear(date: Date): string {
  return format(date, 'd MMM, yyyy')
}
const calculateBookingDetails = (
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
