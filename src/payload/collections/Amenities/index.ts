import type { CollectionConfig } from 'payload/types'

import { admins } from '../../access/admins'

export const Amenities: CollectionConfig = {
  slug: 'amenities',
  admin: {
    group: 'Website Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'updatedAt'],
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
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'media',
      type: 'relationship',
      required: true,
      relationTo: 'media',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      filterOptions: () => {
        return {
          parent: {
            equals: '66f76ad4673fad73c580a55f', // ID for the Amenity Parent Category
          },
        }
      },
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
