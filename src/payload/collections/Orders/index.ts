import type { RowLabelArgs } from 'payload/dist/admin/components/forms/RowLabel/types'
import type { CollectionConfig } from 'payload/types'

import { admins } from '../../access/admins'
import { adminsOrLoggedIn } from '../../access/adminsOrLoggedIn'
import { adminsOrOrderedBy } from './access/adminsOrOrderedBy'
import { clearUserCart } from './hooks/clearUserCart'
import { noConflictReservation } from './hooks/noConflictReservation'
import { populateOrderedBy } from './hooks/populateOrderedBy'
import { updateUserPurchases } from './hooks/updateUserPurchases'
import { LinkToPaymentIntent } from './ui/LinkToPaymentIntent'

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: 'Reservation',
    plural: 'Reservations',
  },
  admin: {
    useAsTitle: 'orderedBy',
    defaultColumns: ['createdAt', 'orderedBy'],
    preview: doc => `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/orders/${doc.id}`,
    // beforeNavLinks: [
    //   BeforeNavLinks,
    // ],
  },
  hooks: {
    afterChange: [updateUserPurchases, clearUserCart],
  },
  access: {
    read: adminsOrOrderedBy,
    update: admins,
    create: adminsOrLoggedIn,
    delete: admins,
  },
  fields: [
    {
      name: 'appointmentType',
      type: 'select',
      label: 'Reservation type',
      options: [
        {
          value: 'booking',
          label: 'Booking',
        },
        {
          value: 'blockout',
          label: 'Blockout',
        },
      ],
      required: true,
    },
    {
      name: 'orderedBy',
      type: 'relationship',
      relationTo: 'users',
      hooks: {
        beforeChange: [populateOrderedBy],
      },
    },
    {
      name: 'stripePaymentIntentID',
      label: 'Stripe Payment Intent ID',
      type: 'text',
      admin: {
        position: 'sidebar',
        components: {
          Field: LinkToPaymentIntent,
        },
      },
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'items',
      type: 'array',
      labels: {
        singular: 'Booking',
        plural: 'Bookings',
      },
      admin: {
        components: {
          RowLabel: ({ data, index }: RowLabelArgs) => {
            const formatDate = (s: string): string => new Date(s).toLocaleDateString('en-US')
            return data?.startDate && data?.endDate
              ? `Booking: ${formatDate(data?.startDate)} — ${formatDate(data?.endDate)}`
              : `New Booking`
          },
        },
      },
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          min: 0,
        },
        {
          name: 'quantity',
          label: 'Nights',
          type: 'number',
          min: 0,
        },
        {
          name: 'startDate',
          label: 'Start Date',
          type: 'date',
          admin: {
            position: 'sidebar',
          },
        },
        {
          name: 'endDate',
          label: 'End Date',
          type: 'date',
          admin: {
            position: 'sidebar',
          },
        },
      ],
    },
  ],
}
