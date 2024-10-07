import type { CollectionConfig } from 'payload/types'

import adminsAndUser from './adminsAndUser'
import { validateAvailability } from './hooks/validateAvailability'
import { InvoiceSelect } from './ui/InvoiceSelect'
import { newBookingNotif } from './hooks/newBookingNotif'
export const bookingStatusMap  =  [
  {
    label: 'Under Initial Review',
    value: 'pending',
  },
  {
    label: 'Awaiting Deposit',
    value: 'initConfirmed',
  },
  {
    label: 'Partially Paid',
    value: 'partiallyPaid',
  },
  {
    label: 'Fully Paid',
    value: 'paid',
  },
  {
    label: 'Cancelled',
    value: 'cancelled',
  },
  {
    label: 'In Progress',
    value: 'inProgress',
  },
  {
    label: 'Complete',
    value: 'complete',
  },
]
export const Bookings: CollectionConfig = {
  slug: 'bookings',
  labels: {
    singular: 'Booking',
    plural: 'Bookings',
  },
  admin: {
    group: 'Business Data',
  },
  hooks: {
    afterChange: [newBookingNotif],
    beforeChange: [validateAvailability],
  },
  access: {
    read: () => true,
    create: adminsAndUser,
    update: adminsAndUser,
    delete: adminsAndUser,
  },
  fields: [
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
    },
    {
      name: 'bookingStatus',
      type: 'select',
      defaultValue: 'pending',
      options: bookingStatusMap,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'introduction',
      label: 'Introductory Message',
      type: 'textarea',
    },
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'd MMM yyy',
        },
        position: 'sidebar',
      },
    },
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'd MMM yyy',
        },
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
      name: 'invoice',
      type: 'text',
      label: 'Associated Invoice',
      admin: {
        components: {
          Field: InvoiceSelect,
        },
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'Guest',
    },
  ],
}
