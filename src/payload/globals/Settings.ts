import type { GlobalConfig } from 'payload/types'

import { ProductSelect } from '../collections/Products/ui/ProductSelect'
import { beforeSettingsChange } from './hooks/beforeSettingsChange'
import { admins } from '../access/admins'

export const Settings: GlobalConfig = {
  slug: 'settings',
  typescript: {
    interface: 'Settings',
  },
  hooks: {
    beforeChange: [beforeSettingsChange],
  },
  graphQL: {
    name: 'Settings',
  },
  access: {
    read: () => true,
    update: admins,
  },
  fields: [
    {
      name: 'productsPage',
      type: 'relationship',
      relationTo: 'pages',
      label: 'Products page',
    },
    {
      name: 'minBooking',
      type: 'number',
      label: 'Minimum Booking Duration (days)',
    },
    {
      name: 'maxBooking',
      type: 'number',
      label: 'Maximum Booking Duration (days)',
    },
    {
      name: 'advancedBookingLimit',
      type: 'number',
      label: 'Number of days that a booking can be made in advance',
    },
    {
      name: 'stripeCleaningFee',
      type: 'text',
      admin: {
        components: {
          Field: ProductSelect,
        },
      },
    },
    {
      name: 'stripeCleaningFeeJSON',
      label: 'Cleaning Fee Price JSON',
      type: 'textarea',
      admin: {
        readOnly: true,
        hidden: true,
        rows: 10,
      },
    },
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
