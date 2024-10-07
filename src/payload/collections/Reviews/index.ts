import type { CollectionConfig } from 'payload/types'

import { admins } from '../../access/admins'
import { slugField } from '../../fields/slug'
import { adminsOrPublished } from '../Pages/access/adminsOrPublished'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'name',
    group: 'Business Data',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    preview: doc => {
      return `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/next/preview?url=${encodeURIComponent(
        `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/${doc.slug !== 'home' ? doc.slug : ''}`,
      )}&secret=${process.env.PAYLOAD_PUBLIC_DRAFT_SECRET}`
    },
  },
  versions: {
    drafts: true,
  },
  access: {
    read: adminsOrPublished,
    update: admins,
    create: admins,
    delete: admins,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true
    },
    {
      name: 'relatedListing',
      label: 'Associated Listing',
      type: 'relationship',
      relationTo: 'products'
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
      name: 'rating',
      type: 'number',
      required: true,
      label: 'Rating (between 1 - 10)',
      validate: val => {
        if (val >= 1 && val <= 10) {
          return val
        }
        return 'The rating must be a number between 1 and 10'
      },
    },
    {
      name: 'statement',
      type: 'textarea',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
  ],
}
