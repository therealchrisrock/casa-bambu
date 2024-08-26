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
      name: 'media',
      type: 'relationship',
      required: true,
      relationTo: 'media',
    },
  ],
}
