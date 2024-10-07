import type { CollectionConfig } from 'payload/types'

import { admins } from '../../access/admins'
import richText from '../../fields/richText'
import largeBody from '../../fields/richText/largeBody'
import label from '../../fields/richText/label'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  labels: {
    plural:  'FAQs',
    singular: 'FAQ'
  },
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
    richText({
      admin: {
        elements: ['h1', largeBody, label, 'link'],
        leaves: [],
      },
    }),
  ],
}
