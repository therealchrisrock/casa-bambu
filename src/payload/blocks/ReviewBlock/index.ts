import type { Block } from 'payload/types'

export const ReviewBlock: Block = {
  slug: 'reviewBlock',
  fields: [
    {
      name: 'review',
      type: 'relationship',
      relationTo: 'reviews',
      required: true,
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image',
      required: true,
    },
  ],
}
