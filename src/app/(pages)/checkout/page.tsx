import React, { Fragment } from 'react'
import { Metadata } from 'next'

import { Page, Settings } from '../../../payload/payload-types'
import { fetchSettings } from '../../_api/fetchGlobals'
import { Gutter } from '../../_components/Gutter'
import { Message } from '../../_components/Message'
import { LowImpactHero } from '../../_heros/LowImpact'
import { getMeUser } from '../../_utilities/getMeUser'
import { mergeOpenGraph } from '../../_utilities/mergeOpenGraph'
import { CheckoutPage } from './CheckoutPage'

import classes from './index.module.scss'
import { fetchDoc } from '@/_api/fetchDoc'
import { Hero } from '@/_components/Hero'
import { BookingCheckoutPage } from '@/(pages)/checkout/BookingCheckoutPage'

export default async function Checkout() {
  await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent(
      'You must be logged in to checkout.',
    )}&redirect=${encodeURIComponent('/checkout')}`,
  })

  let settings: Settings | null = null
  let page: Page | null = null

  try {
    settings = await fetchSettings()
    page = await fetchDoc<Page>({
      collection: 'pages',
      slug: 'cart',
    })
  } catch (error) {
    // no need to redirect to 404 here, just simply render the page with fallback data where necessary
    console.error(error) // eslint-disable-line no-console
  }

  return (
    <Fragment>
      {!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && (
        <Gutter>
          <Message
            className={classes.message}
            warning={
              <Fragment>
                {'To enable checkout, you must '}
                <a
                  href="https://dashboard.stripe.com/test/apikeys"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {'obtain your Stripe API Keys'}
                </a>
                {' then set them as environment variables. See the '}
                <a
                  href="https://github.com/payloadcms/payload/blob/main/templates/ecommerce/README.md#stripe"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {'README'}
                </a>
                {' for more details.'}
              </Fragment>
            }
          />
        </Gutter>
      )}
      <Hero {...page?.hero} />
      <Gutter className={classes.checkoutPage}>
        <BookingCheckoutPage settings={settings} />
      </Gutter>
    </Fragment>
  )
}

export const metadata: Metadata = {
  title: 'Account',
  description: 'Create an account or log in to your existing account.',
  openGraph: mergeOpenGraph({
    title: 'Account',
    url: '/account',
  }),
}
