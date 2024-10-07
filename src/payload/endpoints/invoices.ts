import type { PayloadHandler } from 'payload/config'
import type { PayloadRequest } from 'payload/types'
import Stripe from 'stripe'
import { checkRole } from '../collections/Users/checkRole'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-08-01',
})
const logs = process.env.LOGS_STRIPE_PROXY === '1'
export const invoicesProxy: PayloadHandler = async (req: PayloadRequest, res) => {
  const userId = req.params.uid
  if (!userId) {
    if (logs) req.payload.logger.error({ err: `No User ID has been provided for invoice lookup` })
    res.status(400).json({ error: 'No User ID has been provided for invoice lookup' })
    return
  }
  if (!req.user || !checkRole(['admin'], req.user)) {
    if (logs) req.payload.logger.error({ err: `You are not authorized to access products` })
    res.status(401).json({ error: 'You are not authorized to access products' })
    return
  }
  try {
    const user = await req.payload.findByID({
      collection: 'users',
      id: userId
    })
    if (!user) {
      res.status(404).json({ error: `No User found for uid ${userId}` })
      return
    }
    if (!user.stripeCustomerID) {
      res.status(404).json({error: 'Account is not linked to a profile in stripe.'})
      return
    }
    const cid = user.stripeCustomerID
    const invoices = await stripe.invoices.list({
      customer: cid,
    })
    if (!invoices) {
      if (logs)
        req.payload.logger.error({
          err: `No invoice information found from stripe for user, ${cid}`,
        })
      res
        .status(404)
        .json({ error: `No invoice information found from stripe for user, ${cid}` })
      return
    }
    res.status(200).json({ data: invoices.data })
  } catch (error: unknown) {
    if (logs) req.payload.logger.error({ err: `Error using Stripe Invoice API: ${error}` })
    res.status(500).json({ error: `Error using Stripe Invoice API: ${error}` })
  }
}
