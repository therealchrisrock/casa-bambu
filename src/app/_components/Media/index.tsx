import React, { ElementType, Fragment } from 'react'

import { Image } from './Image'
import { Props } from './types'
import { Video } from './Video'

export const Media: React.FC<Props> = props => {
  const { className, resource, htmlElement = 'div' } = props

  const isVideo = typeof resource !== 'string' && resource?.mimeType?.includes('video')
  const Tag = (htmlElement as ElementType) || Fragment

  return (
    <Tag
      {...(htmlElement !== null
        ? {
            className,
          }
        : {})}
    >
      {htmlElement !== null ? (
        isVideo ? (
          <Video {...props} />
        ) : (
          <Image {...props} />
        )
      ) : isVideo ? (
        <Video className={className} {...props} />
      ) : (
        <Image imgClassName={className} {...props} />
      )}
    </Tag>
  )
}
