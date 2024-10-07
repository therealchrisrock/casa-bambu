import type { RowLabelArgs } from 'payload/dist/admin/components/forms/RowLabel/types'
import type { GlobalConfig } from 'payload/types'

import link from '../fields/link'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      maxRows: 6,
      admin: {
        components: {
          RowLabel: ({ data, index }: RowLabelArgs) => {
            return data?.link?.label
          },
        },
      },
      fields: [
        link({
          appearances: false,
        }),
      ],
    },
  ],
}
