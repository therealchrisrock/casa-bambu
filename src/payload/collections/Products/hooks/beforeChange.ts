import type { BeforeChangeHook } from 'payload/dist/collections/config/types'
import type { PayloadRequest } from 'payload/types'
import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripe = new Stripe(stripeSecretKey || '', { apiVersion: '2022-08-01' })

const logs = false

export const beforeProductChange: BeforeChangeHook = async ({ req, data }) => {
  const { payload } = req
  const newDoc: Record<string, unknown> = {
    ...data,
    skipSync: false, // Set back to 'false' so that all changes continue to sync to Stripe
  }

  if (data.skipSync) {
    if (logs) payload.logger.info(`Skipping product 'beforeChange' hook`)
    return newDoc
  }

  if (!data.stripeProductID) {
    if (logs)
      payload.logger.info(
        `No Stripe product assigned to this document, skipping product 'beforeChange' hook`,
      )
    return newDoc
  }

  if (logs) payload.logger.info(`Looking up product from Stripe...`)
  const basePrice = await fetchStripePrice({ req, pid: data.stripeProductID })
  newDoc.priceJSON = JSON.stringify(basePrice)
  if (!data.stripeGuestFeeID) {
    if (logs) payload.logger.info(`No Guest Fee is Applicable. Skipping...`)
  } else {
    const guestFee = await fetchStripePrice({ req, pid: data.stripeGuestFeeID })
    newDoc.guestFeePriceJSON = JSON.stringify(guestFee)
  }
  if (!data.coupons) {
    if (logs)
      payload.logger.info(
        `No Stripe product assigned to this document, skipping product 'beforeChange' hook`,
      )
  } else {
    const { data: stripeCoupons } = await stripe.coupons.list({ limit: 100 })
    for (let i = 0; i < data.coupons.length; i++) {
      const c = data.coupons[i].stripeCoupon
      const d = stripeCoupons.find(x => x.id == c)
      if (d) newDoc.coupons[i].stripeCouponJSON = JSON.stringify(d)
    }
  }
  return newDoc
}
export const fetchStripePrice = async ({
  req,
  pid,
}: {
  req: PayloadRequest
  pid: string
}): Promise<Stripe.Response<Stripe.ApiList<Stripe.Price>>> => {
  const { payload } = req

  if (logs) payload.logger.info(`Looking up product from Stripe...`)

  try {
    const stripeProduct = await stripe.products.retrieve(pid)

    if (logs) payload.logger.info(`Found product from Stripe: ${stripeProduct.name}`)
    // newDoc.name = stripeProduct.name;
  } catch (error: unknown) {
    payload.logger.error(`Error fetching product from Stripe: ${error}`)
    return null
  }

  if (logs) payload.logger.info(`Looking up price from Stripe...`)
  try {
    const allprices = await stripe.prices.list({
      product: pid,
      limit: 100,
    })
    return allprices
  } catch (error: unknown) {
    payload.logger.error(`Error fetching prices from Stripe: ${error}`)
    return null
  }
}
