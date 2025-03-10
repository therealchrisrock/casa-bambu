'use client'

import React from 'react'
import NextImage, { StaticImageData } from 'next/image'
import { CldImage } from 'next-cloudinary'

import cssVariables from '../../../cssVariables'
import { Props as MediaProps } from '../types'

import classes from './index.module.scss'

const { breakpoints } = cssVariables

export const Image: React.FC<MediaProps> = props => {
  const {
    imgClassName,
    onClick,
    onLoad: onLoadFromProps,
    resource,
    priority,
    fill,
    src: srcFromProps,
    alt: altFromProps,
  } = props

  const [isLoading, setIsLoading] = React.useState(true)

  let width: number | undefined
  let height: number | undefined
  let alt = altFromProps
  let src: StaticImageData | string = srcFromProps || ''
  let filename
  if (!src && resource && typeof resource !== 'string') {
    const {
      width: fullWidth,
      height: fullHeight,
      filename: fullFilename,
      alt: altFromResource,
    } = resource

    width = fullWidth
    height = fullHeight
    alt = altFromResource

    filename = fullFilename
  }

  // NOTE: this is used by the browser to determine which image to download at different screen sizes
  const sizes = Object.entries(breakpoints)
    .map(([, value]) => `(max-width: ${value}px) ${value}px`)
    .join(', ')

  if (!filename) return <></>
  return (
    <CldImage
      className={[isLoading && classes.placeholder, classes.image, imgClassName]
        .filter(Boolean)
        .join(' ')}
      alt={alt || ''}
      height={height}
      width={width}
      src={filename}
      onLoad={() => {
        setIsLoading(false)
        if (typeof onLoadFromProps === 'function') {
          onLoadFromProps()
        }
      }}
      config={{
        // url: {
        //   privateCdn: true,
        //   secureDistribution: 'media.casabambuwestbay.com', // Set your custom domain here
        // },
      }}
    />
    // <NextImage
    //   className={[isLoading && classes.placeholder, classes.image, imgClassName]
    //     .filter(Boolean)
    //     .join(' ')}
    //   src={src}
    //   alt={alt || ''}
    //   onClick={onClick}
    //   onLoad={() => {
    //     setIsLoading(false)
    //     if (typeof onLoadFromProps === 'function') {
    //       onLoadFromProps()
    //     }
    //   }}
    //   fill={fill}
    //   width={!fill ? width : undefined}
    //   height={!fill ? height : undefined}
    //   sizes={sizes}
    //   priority={priority}
    // />
  )
}
