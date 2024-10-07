import { useFormFields } from 'payload/components/forms'
import type { RowLabelArgs } from 'payload/dist/admin/components/forms/RowLabel/types'
import type { CollectionConfig } from 'payload/types'

import { admins } from '../../access/admins'
import { Archive } from '../../blocks/ArchiveBlock'
import { CallToAction } from '../../blocks/CallToAction'
import { Content } from '../../blocks/Content'
import { MediaBlock } from '../../blocks/MediaBlock'
import richText from '../../fields/richText'
import { slugField } from '../../fields/slug'
import { populateArchiveBlock } from '../../hooks/populateArchiveBlock'
import { validateSeasonalPricing } from '../Bookings/hooks/validateAvailability'
import { checkUserPurchases } from './access/checkUserPurchases'
import { beforeProductChange } from './hooks/beforeChange'
import { deleteProductFromCarts } from './hooks/deleteProductFromCarts'
import { revalidateProduct } from './hooks/revalidateProduct'
import { PriceSelect } from './ui/PriceSelect'
import { ProductSelect } from './ui/ProductSelect'
import { CouponSelect } from './ui/CouponSelect'

const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Listing',
    plural: 'Listings',
  },
  admin: {
    group: 'Business Data',
    useAsTitle: 'title',
    defaultColumns: ['title', 'stripeProductID', '_status'],
    preview: doc => {
      return `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/next/preview?url=${encodeURIComponent(
        `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/products/${doc.slug}`,
      )}&secret=${process.env.PAYLOAD_PUBLIC_DRAFT_SECRET}`
    },
  },
  hooks: {
    beforeChange: [beforeProductChange],
    afterChange: [revalidateProduct],
    afterRead: [populateArchiveBlock],
    afterDelete: [deleteProductFromCarts],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
    create: admins,
    update: admins,
    delete: admins,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'publishedOn',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'available',
      type: 'checkbox',
      defaultValue: 'true',
      label: 'Available for Booking Requests',
    },

    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'gallery', // required
              type: 'array', // required
              label: 'Product Images',
              minRows: 5,
              labels: {
                singular: 'Image',
                plural: 'Images',
              },
              fields: [
                {
                  name: 'media', // required
                  type: 'upload', // required
                  relationTo: 'media', // required
                  required: true,
                },
              ],
              admin: {
                components: {
                  RowLabel: ({ data, index }: RowLabelArgs) => {
                    return data?.title || `Image ${String(index).padStart(2, '0')}`
                  },
                },
              },
            },
            richText({ name: 'productDescription' }),
            // {
            //   name: 'amenities',
            //   type: 'array',
            //   fields: [
            //     {
            //       name: 'amenity',
            //       type: 'relationship',
            //       relationTo: 'amenities',
            //       required: true
            //     },
            //   ],
            // },
            {
              name: 'layout',
              type: 'blocks',
              blocks: [CallToAction, Content, MediaBlock, Archive],
            },
          ],
        },
        {
          label: 'Product Details',
          fields: [
            {
              name: 'bedroomQuantity',
              type: 'number',
              label: 'Number of Bedrooms',
              required: true,
            },
            {
              name: 'bathQuantity',
              type: 'number',
              label: 'Number of Bathrooms',
              required: true,
            },
            {
              name: 'maxGuestQuantity',
              type: 'number',
              label: 'Maximum Number of Guests',
              required: true,
            },
            {
              name: 'baseGuestQuantity',
              type: 'number',
              label: 'Number of Allowable Guests Without Incurring Guest Fees',
              required: true,
            },
            {
              name: 'priceJSON',
              label: 'Price JSON',
              type: 'textarea',
              admin: {
                readOnly: true,
                hidden: true,
                rows: 10,
              },
            },
            {
              name: 'features',
              type: 'relationship',
              relationTo: 'amenities',
              hasMany: true
            },
            {
              name: 'enablePaywall',
              label: 'Enable Paywall',
              type: 'checkbox',
            },
            {
              name: 'paywall',
              label: 'Paywall',
              type: 'blocks',
              access: {
                read: checkUserPurchases,
              },
              blocks: [CallToAction, Content, MediaBlock, Archive],
            },
          ],
        },
        {
          label: 'Pricing',
          fields: [
            {
              name: 'stripeProductID',
              label: 'Stripe Product (Default)',
              type: 'text',
              admin: {
                components: {
                  Field: ProductSelect,
                },
              },
            },
            {
              name: 'stripeGuestFeeID',
              label: 'Stripe Extra Guest Fee',
              type: 'text',
              admin: {
                components: {
                  Field: ProductSelect,
                },
              },
            },
            {
              name: 'guestFeePriceJSON',
              label: 'Guest Fee Price JSON',
              type: 'textarea',
              admin: {
                readOnly: true,
                hidden: true,
                rows: 10,
              },
            },
            {
              name: 'coupons',
              type: 'array',
              label: 'Coupons (Volume Pricing)',
              admin: {
                components: {
                  RowLabel: ({ data, index }: RowLabelArgs) => {
                    return data?.nickname
                  },
                },
              },
              fields: [
                {
                  name: 'nickname',
                  type: 'text',
                },
                {
                  name: 'quantity',
                  label: 'By Nights',
                  type: 'number',
                  required: true,
                  unique: true
                },
                {
                  name: 'stripeCoupon',
                  type: 'text',
                  required: true,
                  admin: {
                    components: {
                      Field: CouponSelect
                    }
                  }
                },
                {
                  name: 'stripeCouponJSON',
                  label: 'Guest Fee Price JSON',
                  type: 'textarea',
                  admin: {
                    readOnly: true,
                    hidden: true,
                    rows: 10,
                  },
                },
              ]
            },
            {
              name: 'variants',
              label: 'Seasonal Prices',
              type: 'array',
              admin: {
                components: {
                  RowLabel: ({ data, index }: RowLabelArgs) => {
                    const v = useFormFields(([fields]) => fields)
                    const priceJSON = v.priceJSON?.value as string | null | undefined
                    const variantPriceID = data?.priceID
                    let label = ''
                    const p = JSON.parse(priceJSON)?.data
                    if (p && variantPriceID) {
                      const name = p.find(t => t.id === variantPriceID)?.nickname
                      if (name) label = `${name} `
                    }
                    const formatDate = (s: string): string =>
                      new Date(s).toLocaleDateString('en-US')
                    const dateLabel =
                      data?.seasonStart && data?.seasonEnd
                        ? `(${formatDate(data?.seasonStart)} — ${formatDate(data?.seasonEnd)})`
                        : ''
                    label += dateLabel
                    return label
                  },
                },
              },
              fields: [
                {
                  name: 'priceID',
                  label: 'Stripe Price',
                  type: 'text',
                  required: true,
                  admin: {
                    components: {
                      Field: PriceSelect,
                    },
                  },
                },
                {
                  name: 'seasonStart',
                  label: 'Season (start date)',
                  type: 'date',
                  required: true,
                  hooks: {
                    beforeChange: [validateSeasonalPricing],
                  },
                },
                {
                  name: 'seasonEnd',
                  label: 'Season (end date)',
                  type: 'date',
                  required: true,
                  hooks: {
                    beforeChange: [validateSeasonalPricing],
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      filterOptions: ({ id }) => {
        return {
          id: {
            not_in: [id],
          },
        }
      },
    },
    slugField(),
    {
      name: 'skipSync',
      label: 'Skip Sync',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        readOnly: true,
        hidden: true,
      },
    },
  ],
}

export default Products
