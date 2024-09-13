import { fetchStripePrice } from '../../collections/Products/hooks/beforeChange'
import { BeforeChangeHook } from 'payload/dist/globals/config/types'

const logs = false

export const beforeSettingsChange: BeforeChangeHook = async ({ req, data }) => {
  const { payload } = req
  const newDoc: Record<string, unknown> = {
    ...data,
    skipSync: false, // Set back to 'false' so that all changes continue to sync to Stripe
  }

  if (data.skipSync) {
    if (logs) payload.logger.info(`Skipping settings 'beforeChange' hook`)
    return newDoc
  }

  if (!data.stripeCleaningFee) {
    if (logs)
      payload.logger.info(
        `No Stripe product assigned to this document, skipping settings 'beforeChange' hook`,
      )
    return newDoc
  }

  if (logs) payload.logger.info(`Looking up product from Stripe...`)
  const basePrice = await fetchStripePrice({ req, pid: data.stripeCleaningFee })
  newDoc.stripeCleaningFeeJSON = JSON.stringify(basePrice)
  return newDoc
}
