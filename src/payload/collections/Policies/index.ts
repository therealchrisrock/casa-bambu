import type { CollectionConfig } from 'payload/types'

import { admins } from '../../access/admins'
import richText from '../../fields/richText'
import { slugField } from '../../fields/slug'
import { adminsOrPublished } from '../Pages/access/adminsOrPublished'

export const Policies: CollectionConfig = {
  slug: 'policies',
  versions: {
    drafts: true,
  },
  admin: {
    group: 'Business Data',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    read: adminsOrPublished,
    update: admins,
    create: admins,
    delete: admins,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'attachment',
      type: 'relationship',
      relationTo: 'media'
    },
    slugField(),
    richText({ name: 'body', required: false}),
  ],
}
