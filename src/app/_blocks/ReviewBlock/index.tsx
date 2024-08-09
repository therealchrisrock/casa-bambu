import React from 'react'

import { Page } from '../../../payload/payload-types'

import { Gutter } from '@/_components/Gutter'
import { Media } from '@/_components/Media'

type Props = Extract<Page['layout'][0], { blockType: 'reviewBlock' }>

export const ReviewBlock: React.FC<Props> = props => {
  const { media } = props
  return (
    <Gutter>
      <div className={'relative p-4 min-h-96 rounded'}>
        <Media className={'absolute inset-0 w-full h-full'} resource={media} />
      </div>
    </Gutter>
  )
}
