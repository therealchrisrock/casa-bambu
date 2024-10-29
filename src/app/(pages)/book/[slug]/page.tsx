// Force this page to be dynamic so that Next.js does not cache it
// See the note in '../[slug]/page.tsx' about this
import React, { Fragment } from 'react'
import { notFound, useSearchParams } from 'next/navigation'

import { Booking, Page, Product, Settings } from '../../../../payload/payload-types'

import { fetchDoc } from '@/_api/fetchDoc'
import { fetchDocs } from '@/_api/fetchDocs'
import { fetchSettings } from '@/_api/fetchGlobals'
import { Blocks } from '@/_components/Blocks'
import { Gutter } from '@/_components/Gutter'
import { Hero } from '@/_components/Hero'
import { BookingProvider } from '@/_providers/Booking'
import { BookingForm, CreateBooking } from '@/(pages)/book/CreateBooking'
import { RenderParams } from '@/_components/RenderParams'
import classes from '@/(pages)/account/index.module.scss'
import { getMeUser } from '@/_utilities/getMeUser'
import LoginForm from '@/(pages)/login/LoginForm'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Book({ params: { slug }, searchParams }) {
  const allParams = new URLSearchParams(await searchParams).toString();

  let page: Page | null = null
  const { user } = await getMeUser()
  page = await fetchDoc<Page>({
    collection: 'pages',
    slug: 'book',
  })
  let product: Product | null = null
  let bookings: Booking[] = []
  let settings: Settings = { id: undefined }
  try {
    product = await fetchDoc<Product>({
      collection: 'products',
      slug,
    })
    if (!product) {
      notFound()
    }
    bookings = await fetchDocs<Booking>('bookings', false, {
      product: { equals: product.id },
      endDate: { greater_than_equal: new Date().toJSON() },
    })
    settings = await fetchSettings()
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
  }


  if (!page) {
    return notFound()
  }
  return (
    <BookingProvider bookings={bookings} product={product} settings={settings}>
      <RenderParams className={classes.params} />
      <Hero {...page?.hero} />
      <Gutter narrow>
        <CreateBooking>
          {user ? (
            <div className={'md:pr-8'}>
              <BookingForm />
            </div>
          ) : (
            <LoginForm
              overrideSearchParams={`?redirect=${encodeURIComponent(
                `/book/${product.slug}?${allParams}`,
              )}`}
              customRedirect={`/book/${product.slug}?${allParams}`}
            >
              <>
                To complete your reservation, log in below or{' '}
                <Link
                  href={`/create-account?redirect=${encodeURIComponent(
                    `/book/${product.slug}?${allParams}`,
                  )}`}
                  className={'underline underline-offset-4'}
                >
                  create an account
                </Link>{' '}
                to get started.
              </>
            </LoginForm>
          )}
        </CreateBooking>
      </Gutter>
      <Blocks blocks={page?.layout} />
    </BookingProvider>
  )
}
