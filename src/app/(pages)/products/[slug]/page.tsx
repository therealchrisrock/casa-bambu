import { DateRange } from 'react-day-picker'
import { addDays } from 'date-fns'
import { BathIcon, BedSingleIcon, MapPin, UsersIcon } from 'lucide-react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import {
  Booking,
  Product,
  Product as ProductType,
  Settings,
} from '../../../../payload/payload-types'
import { fetchDoc } from '../../../_api/fetchDoc'
import { fetchDocs } from '../../../_api/fetchDocs'
import { Blocks } from '../../../_components/Blocks'
import { PaywallBlocks } from '../../../_components/PaywallBlocks'
import { generateMeta } from '../../../_utilities/generateMeta'

import { fetchSettings } from '@/_api/fetchGlobals'
import { Gallery } from '@/_components/Gallery'
import { Gutter } from '@/_components/Gutter'
import RichText from '@/_components/RichText'
import { ProductDetails } from '@/(pages)/products/ProductForm'

// Force this page to be dynamic so that Next.js does not cache it
// See the note in '../../../[slug]/page.tsx' about this
export const dynamic = 'force-dynamic'

export default async function Product({ params: { slug } }) {
  const { isEnabled: isDraftMode } = draftMode()

  let product: Product | null = null
  let bookings: Booking[] = []
  let settings: Settings = { id: undefined }
  try {
    product = await fetchDoc<Product>({
      collection: 'products',
      slug,
      draft: isDraftMode,
    })
    bookings = await fetchDocs<Booking>('bookings', false, {
      product: { equals: product.id },
      endDate: { greater_than_equal: new Date().toJSON() },
    })
    settings = await fetchSettings();
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
  }
  if (!product) {
    notFound()
  }

  const { layout, relatedProducts, gallery, productDescription } = product
  return (
    <Gutter className={'grid gap-8 lg:gap-12 xl:gap-12'}>
      <Gallery assets={gallery} />
      <div className={'flex'}>
        <div className={'space-y-4 pr-8 flex-1'}>
          <h2 className={'text-3xl font-semibold'}>About {product.title}</h2>
          <RichText size={'prose-lg'} content={productDescription} />
        </div>
        <div className={'col-span-4 min-w-[338px] max-w-[420px]'}>
          <ProductDetails bookings={bookings} product={product} settings={settings} />
        </div>
      </div>
      <Blocks blocks={layout} />
      {product?.enablePaywall && <PaywallBlocks productSlug={slug as string} disableTopPadding />}
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
              {
                type: 'p',
                children: [
                  {
                    text: 'The products displayed here are individually selected for this page. Admins can select any number of related products to display here and the layout will adjust accordingly. Alternatively, you could swap this out for the "Archive" block to automatically populate products by category complete with pagination. To manage related posts, ',
                  },
                  {
                    type: 'link',
                    url: `/admin/collections/products/${product.id}`,
                    children: [
                      {
                        text: 'navigate to the admin dashboard',
                      },
                    ],
                  },
                  {
                    text: '.',
                  },
                ],
              },
            ],
            docs: relatedProducts,
          },
        ]}
      />
    </Gutter>
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
