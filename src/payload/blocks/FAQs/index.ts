import type { Block } from 'payload/types'

export const FaqBlock: Block = {
  slug: 'faqBlock',
  fields: [
    {
      name: 'faq',
      type: 'relationship',
      relationTo: 'faqs',
      required: true,
    }
  ],
}
