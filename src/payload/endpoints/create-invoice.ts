import { format } from 'date-fns'
import type { PayloadHandler } from 'payload/config'
import Stripe from 'stripe'

import type { CartItems } from '../payload-types'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-08-01',
})

// this endpoint creates a `PaymentIntent` with the items in the cart
// to do this, we loop through the items in the cart and lookup the product in Stripe
// we then add the price of the product to the total
// once completed, we pass the `client_secret` of the `PaymentIntent` back to the client which can process the payment
export const createInvoice: PayloadHandler = async (req, res): Promise<void> => {
  const { user, payload } = req

  if (!user) {
    res.status(401).send('Unauthorized')
    return
  }

  const fullUser = await payload.findByID({
    collection: 'users',
    id: user?.id,
  })

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
        name: fullUser?.name,
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

    let total = 0

    const hasItems = fullUser?.cart?.items?.length > 0

    if (!hasItems) {
      throw new Error('No items in cart')
    }
    let bookingDates: { from: string; to: string }
    // for each item in cart, lookup the product in Stripe and add its price to the total
    await Promise.all(
      fullUser?.cart?.items?.map(async (item: CartItems[0]): Promise<null> => {
        const { product, quantity, from, to } = item

        if (!quantity) {
          return null
        }

        if (typeof product === 'string' || !product?.stripeProductID) {
          throw new Error('No Stripe Product ID')
        }
        if (item.from && item.to)
          bookingDates = {
            from: formatDateToDayMonthYear(new Date(item.from)),
            to: formatDateToDayMonthYear(new Date(item.to)),
          }
        const prices = await stripe.prices.list({
          product: product.stripeProductID,
          limit: 100,
          expand: ['data.product'],
        })

        if (prices.data.length === 0) {
          res.status(404).json({ error: 'There are no items in your cart to checkout with' })
          return null
        }

        const price = prices.data[0]
        total += price.unit_amount * quantity

        return null
      }),
    )

    if (total === 0) {
      throw new Error('There is nothing to pay for, add some items to your cart and try again.')
    }

    const invoice = await stripe.invoices.create({
      customer: stripeCustomerID,
      collection_method: 'send_invoice',
      currency: 'cad',
      description: '',
      custom_fields: [
        {
          name: 'check-in date',
          value: bookingDates.from,
        },
        {
          name: 'check-out date',
          value: bookingDates.to,
        },
      ],
    })
    await Promise.all(
      fullUser?.cart?.items?.map(async (item: CartItems[0]) => {
        const invoiceItem = await stripe.invoiceItems.create({
          customer: stripeCustomerID,
          price: item.priceID,
          quantity: item.quantity,
          currency: 'cad',
          invoice: invoice.id,
        })
      }),
    )
    // res.send({ client_secret: invoice.client_secret })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    payload.logger.error(message)
    res.json({ error: message })
  }
}
function formatDateToDayMonthYear(date: Date): string {
  return format(date, 'd MMM, yyyy')
}
