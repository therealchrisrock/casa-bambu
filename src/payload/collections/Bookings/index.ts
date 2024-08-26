import type { CollectionConfig } from 'payload/types'

import { admins } from '../../access/admins'
import BeforeNavLinks from '../../components/BeforeNavLinks'
import { validateAvailability } from './hooks/validateAvailability'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  labels: {
    singular: 'Booking',
    plural: 'Bookings',
  },
  admin: {
    group: 'Ecommerce Data',
  },
  hooks: {
    beforeChange: [validateAvailability],
  },
  access: {
    read: () => true,
    create: admins,
    update: admins,
    delete: admins,
  },
  fields: [
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      label: 'Listing',
      required: true,
    },
    {
      name: 'type',
      label: 'Booking Type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Blockout',
          value: 'blockout',
        },
        {
          label: 'Customer Reservation',
          value: 'reservation',
        },
      ],
      access: {
        read: admins,
        create: admins,
        update: admins,
      },
    },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      label: 'Associated Order',
      access: {
        read: admins,
        create: admins,
        update: admins,
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'Guest',
      access: {
        read: admins,
        create: admins,
        update: admins,
      },
    },
  ],
}
