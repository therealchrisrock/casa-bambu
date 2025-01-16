import type { Block } from 'payload/types'

import richText from '../../fields/richText'
import largeBody from '../../fields/richText/largeBody'
import label from '../../fields/richText/label'

export const FormBlock: Block = {
  slug: 'formBlock',
  labels: {
    singular: 'Form Block',
    plural: 'Form Blocks',
  },
  graphQL: {
    singularName: 'FormBlock',
  },
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
    {
      name: 'enableIntro',
      label: 'Enable Intro Content',
      type: 'checkbox',
    },
    richText({
      name: 'introContent',
      label: 'Intro Content',
      admin: {
        elements: ['h1', largeBody, label, 'link'],
        condition: (_, { enableIntro }) => Boolean(enableIntro),
      },
    }),
  ],
}
