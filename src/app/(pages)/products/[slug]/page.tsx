import { Suspense } from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound, redirect } from 'next/navigation'

import {
  Booking,
  Product,
  Product as ProductType,
  Review,
  Settings,
} from '../../../../payload/payload-types'
import { fetchDoc } from '../../../_api/fetchDoc'
import { fetchDocs } from '../../../_api/fetchDocs'
import { Blocks } from '../../../_components/Blocks'
import { PaywallBlocks } from '../../../_components/PaywallBlocks'
import { generateMeta } from '../../../_utilities/generateMeta'

import { fetchSettings } from '@/_api/fetchGlobals'
import { Rating } from '@/_blocks/ReviewBlock'
import { Gallery } from '@/_components/Gallery'
import { Gutter } from '@/_components/Gutter'
import { Media } from '@/_components/Media'
import { OverallScore } from '@/_components/Rating'
import RichText from '@/_components/RichText'
import { Carousel, CarouselContent, CarouselItem } from '@/_components/ui/carousel'
import { TruncateText } from '@/_components/ui/truncate-text'
import { getDefaultProps, getSelectedBookingDetails } from '@/_lib/bookings'
import { BookingProvider } from '@/_providers/Booking'
import { Amenities } from '@/(pages)/products/Amenities'
import {
  MobileProductDetails,
  MobileProductForm,
  ProductDetails,
} from '@/(pages)/products/ProductForm'
import { formatDate } from 'date-fns'

// Force this page to be dynamic so that Next.js does not cache it
// See the note in '../../../[slug]/page.tsx' about this
export const dynamic = 'force-dynamic'

export default async function Product({ params: { slug }, searchParams }) {
  const { isEnabled: isDraftMode } = draftMode()
  const selectedBooking = getSelectedBookingDetails(searchParams)
  let product: Product | null = null
  let bookings: Booking[] = []
  let settings: Settings = { id: undefined }
  try {
    product = await fetchDoc<Product>({
      collection: 'products',
      slug,
      draft: isDraftMode,
    })

    if (!product) {
      notFound()
    }
    bookings = await fetchDocs<Booking>('bookings', false, {
      product: { equals: product.id },
    })
    settings = await fetchSettings()
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
  }

  if (!product) {
    notFound()
  }
  if (!searchParams?.from || !searchParams?.to || !searchParams?.guests) {
    // Remove unwanted query parameters
    const { from, to, guests, ...otherParams } = searchParams
    const f = getDefaultProps(product, bookings, settings)
    const queryParamString = new URLSearchParams({ ...f, ...otherParams }).toString()
    return redirect(`/products/${slug}?${queryParamString.toString()}`)
  }
  const { layout, relatedProducts, gallery, productDescription } = product
  return (
    <BookingProvider product={product} settings={settings} bookings={bookings}>
      <Carousel
        className={'block md:hidden px-4 mb-8'}
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent>
          {product.gallery.map((asset, idx) => (
            <CarouselItem key={asset.id || `carousel--${idx}`}>
              <Media
                htmlElement={null}
                resource={asset.media}
                className={'aspect-[4/5] object-cover rounded-lg overflow-hidden'}
              />{' '}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <Gutter className={'grid gap-8 lg:gap-12 xl:gap-12'}>
        <div className={'md:block hidden'}>
          <Gallery assets={gallery} />
        </div>
        <div className={'flex'}>
          <div className={' w-full'}>
            <div className={'md:pr-8 max-w-4xl space-y-12'}>
              <div className={'space-y-4  flex-1'}>
                <div className={'space-y-1'}>
                  <h1 className={'text-3xl font-semibold'}>About {product.title}</h1>
                  <div className={'md:hidden block'}>
                    <MobileProductDetails />
                  </div>
                  <Suspense>
                    <div className={'pt-1'}>
                      <OverallScore pid={product.id} />
                    </div>
                  </Suspense>
                </div>
                <TruncateText>
                  <RichText
                    content={productDescription}
                    className={'lg:text-left text-justify prose max-w-4xl'}
                  />
                </TruncateText>
              </div>
              {product.features && (
                <div className={'divide-y space-y-4'}>
                  <h2 className={'text-xl font-semibold'}>What This Place Offers</h2>
                  <div className={'py-6'}>
                    <Amenities amenities={product.features} />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={'hidden md:block col-span-4 min-w-[338px] max-w-[420px]'}>
            <div className={'sticky top-4'}>
              <ProductDetails />
            </div>
          </div>
          <div className={'md:hidden block'}>
            <div className="fixed bottom-0 left-0 z-50 w-full h-20 bg-white border-t border-gray-200 ">
              <MobileProductForm />
            </div>
          </div>
        </div>
        <Blocks blocks={layout} />
        {product?.enablePaywall && <PaywallBlocks productSlug={slug as string} disableTopPadding />}
        <Suspense>
          <ListingReviews pid={product.id} />
        </Suspense>
      </Gutter>

      <div className={'pt-16'}>
        <Blocks
          disableTopPadding
          blocks={[
            {
              blockType: 'relatedProducts',
              blockName: 'Related Product',
              relationTo: 'products',
              introContent: [
                {
                  type: 'h4',
                  children: [
                    {
                      text: 'Related Products',
                    },
                  ],
                },
              ],
              docs: relatedProducts,
            },
          ]}
        />
      </div>
    </BookingProvider>
  )
}

async function ListingReviews({ pid }: { pid: string }) {
  const reviews = await fetchDocs<Review>('reviews', false, {
    relatedListing: { equals: pid },
  })
  return (
    <div className={'divide-y space-y-4'}>
      <h2 className={'text-xl font-semibold'}>What People Are Saying</h2>
      <div className={'space-y-6 divide-y'}>
        {reviews.map(r => (
          <div className={'grid md:grid-cols-2 grid-cols-1 pt-6'}>
            <div className={'grid md:grid-cols-2 grid-cols-1 col-span-1 gap-0'}>
              <div className={'col-span-1 pb-4'}>
                <hgroup>
                  <h5 className={'font-medium'}>{r.name}</h5>
                  <h6 className={'text-muted-foreground text-sm'}>{new Date(r.publishedOn).toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' })}</h6>
                </hgroup>
              </div>
              <div className={'col-span-1 pb-2'}>
                <div className={'flex items-center '}>

                <Rating review={r} className={'fill-tertiary stroke-tertiary'} />
                  <span className={'text-sm font-semibold pl-2'}>{r.rating}</span>
                </div>
              </div>
            </div>
            <div className={'col-span-1 pb-1'}>
              <TruncateText>{r.statement}</TruncateText>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  try {
    const products = await fetchDocs<ProductType>('products')
    return products?.map(({ slug }) => slug)
  } catch (error) {
    return []
  }
}

export async function generateMetadata({ params: { slug } }): Promise<Metadata> {
  const { isEnabled: isDraftMode } = draftMode()

  let product: Product | null = null

  try {
    product = await fetchDoc<Product>({
      collection: 'products',
      slug,
      draft: isDraftMode,
    })
  } catch (error) {}

  return generateMeta({ doc: product })
}
