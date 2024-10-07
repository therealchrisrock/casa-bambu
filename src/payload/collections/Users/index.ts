import type { CollectionConfig } from 'payload/types'

import { admins } from '../../access/admins'
import { anyone } from '../../access/anyone'
import { PriceSelect } from '../Products/ui/PriceSelect'
import { ProductSelect } from '../Products/ui/ProductSelect'
import adminsAndUser from './access/adminsAndUser'
import { checkRole } from './checkRole'
import { customerProxy } from './endpoints/customer'
import { createStripeCustomer } from './hooks/createStripeCustomer'
import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'
import { loginAfterCreate } from './hooks/loginAfterCreate'
import { resolveDuplicatePurchases } from './hooks/resolveDuplicatePurchases'
import { CustomerSelect } from './ui/CustomerSelect'
import generateForgotPasswordEmail from '../../email/generateForgotPasswordEmail'

const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'Business Data',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email'],
  },
  access: {
    read: adminsAndUser,
    create: anyone,
    update: adminsAndUser,
    delete: admins,
    admin: ({ req: { user } }) => checkRole(['admin'], user),
  },
  hooks: {
    beforeChange: [createStripeCustomer],
    afterChange: [loginAfterCreate],
  },
  // auth: true,
  auth: {
    forgotPassword: {
      generateEmailSubject: () => 'Reset your password',
      generateEmailHTML: generateForgotPasswordEmail,
    },
  },
  endpoints: [
    {
      path: '/:teamID/customer',
      method: 'get',
      handler: customerProxy,
    },
    {
      path: '/:teamID/customer',
      method: 'patch',
      handler: customerProxy,
    },
  ],
  fields: [
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['customer'],
      options: [
        {
          label: 'admin',
          value: 'admin',
        },
        {
          label: 'customer',
          value: 'customer',
        },
      ],
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      access: {
        read: admins,
        create: admins,
        update: admins,
      },
    },
    {
      name: 'purchases',
      label: 'Purchases',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      hooks: {
        beforeChange: [resolveDuplicatePurchases],
      },
    },
    {
      name: 'stripeCustomerID',
      label: 'Stripe Customer',
      type: 'text',
      access: {
        read: ({ req: { user } }) => checkRole(['admin'], user),
      },
      admin: {
        position: 'sidebar',
        components: {
          Field: CustomerSelect,
        },
      },
    },
    {
      label: 'Cart',
      admin: {
        hidden: true
      },
      name: 'cart',
      type: 'group',
      fields: [
        {
          name: 'coupons',
          label: 'Coupons',
          type: 'array',
          interfaceName: 'CouponItems',
          fields: [
            {
              name: 'label',
              type: 'text',
            },
            {
              name: 'couponID',
              type: 'text',
              required: true,
            },
            {
              name: 'amount',
              type: 'number',
            },
          ],
        },
        {
          name: 'from',
          label: 'Start Date',
          type: 'date',
          admin: {
            position: 'sidebar',
          },
        },
        {
          name: 'to',
          label: 'End Date',
          type: 'date',
          admin: {
            position: 'sidebar',
          },
        },
        {
          name: 'basePrice',
          type: 'number',
        },
        {
          name: 'duration',
          type: 'number',
        },
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
        },
        {
          name: 'listing',
          type: 'text',
        },
        {
          name: 'guestsQuantity',
          label: 'Number of Guests',
          type: 'number',
          min: 1,
        },
        {
          name: 'subtotal',
          type: 'number',
        },
        {
          name: 'total',
          type: 'number',
        },
        {
          name: 'fees',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
            },
            {
              name: 'priceID',
              type: 'text',
            },
            {
              name: 'total',
              type: 'number',
            },
          ],
        },
        {
          name: 'items',
          label: 'Items',
          type: 'array',
          interfaceName: 'CartItems',
          fields: [
            {
              name: 'product',
              type: 'relationship',
              relationTo: 'products',
            },
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
              name: 'quantity',
              type: 'number',
              min: 0,
              admin: {
                step: 1,
              },
            },
          ],
        },
        // If you wanted to maintain a 'created on'
        // or 'last modified' date for the cart
        // you could do so here:
        // {
        //   name: 'createdOn',
        //   label: 'Created On',
        //   type: 'date',
        //   admin: {
        //     readOnly: true
        //   }
        // },
        // {
        //   name: 'lastModified',
        //   label: 'Last Modified',
        //   type: 'date',
        //   admin: {
        //     readOnly: true
        //   }
        // },
      ],
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
  timestamps: true,
}

export default Users
