import type { PayloadHandler } from 'payload/config'
import type { PayloadRequest } from 'payload/types'
import Stripe from 'stripe'

import { checkRole } from '../collections/Users/checkRole'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-08-01',
})

const logs = process.env.LOGS_STRIPE_PROXY === '1'

// use this handler to get all Stripe products
// prevents unauthorized or non-admin users from accessing all Stripe products
// GET /api/prices
export const couponsProxy: PayloadHandler = async (req: PayloadRequest, res) => {
  if (!req.user || !checkRole(['admin'], req.user)) {
    if (logs) req.payload.logger.error({ err: `You are not authorized to access products` })
    res.status(401).json({ error: 'You are not authorized to access products' })
    return
  }

  try {
    const coupons = await stripe.coupons.list({
      limit: 100,
    });
    if (!coupons) {
      if (logs) req.payload.logger.error({ err: `No Product price information found from stripe` })
      res.status(404).json({ error: `No Product price information found from stripe` })
      return
    }
    res.status(200).json(coupons)
  } catch (error: unknown) {
    if (logs) req.payload.logger.error({ err: `Error using Stripe API: ${error}` })
    res.status(500).json({ error: `Error using Stripe API: ${error}` })
  }
}
