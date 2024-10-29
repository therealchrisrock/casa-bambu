import React from 'react'

import { Page } from '../../../payload/payload-types'
import { Gutter } from '../../_components/Gutter'
import { CMSLink } from '../../_components/Link'
import RichText from '../../_components/RichText'

import classes from './index.module.scss'
import { Media } from '@/_components/Media'

type Props = Extract<Page['layout'][0], { blockType: 'content' }>

export const ContentBlock: React.FC<
  Props & {
    id?: string
  }
> = props => {
  const { columns } = props

  return (
    <Gutter className={classes.content}>
      <div className={classes.grid}>
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, richText, media, link, size } = col

            return (
              <div key={index} className={[classes.column, classes[`column--${size}`]].join(' ')}>
                {richText && <RichText content={richText} className={'mx-auto'} />}
                {media && <Media resource={media} className={'lg:block flex justify-center'} />}
                {enableLink && <CMSLink className={classes.link} {...link} />}
              </div>
            )
          })}
      </div>
    </Gutter>
  )
}
