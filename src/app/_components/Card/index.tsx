'use client'

import React, { Fragment, useEffect, useState } from 'react'
import { MoveRightIcon } from 'lucide-react'
import Link from 'next/link'
import { useMediaQuery } from 'usehooks-ts'

import { Product } from '../../../payload/payload-types'
import { Media } from '../Media'

import { Button } from '@/_components/ui/button'
import { cn } from '@/_lib/utils'

import classes from './index.module.scss'

const priceFromJSON = (priceJSON): string => {
  let price = ''

  if (priceJSON) {
    try {
      const parsed = JSON.parse(priceJSON)?.data[0]
      const priceValue = parsed.unit_amount
      const priceType = parsed.type
      price = `${parsed.currency === 'usd' ? '$' : ''}${(priceValue / 100).toFixed(2)}`
      if (priceType === 'recurring') {
        price += `/${
          parsed.recurring.interval_count > 1
            ? `${parsed.recurring.interval_count} ${parsed.recurring.interval}`
            : parsed.recurring.interval
        }`
      }
    } catch (e) {
      console.error(`Cannot parse priceJSON`) // eslint-disable-line no-console
    }
  }

  return price
}

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  showCategories?: boolean
  hideImagesOnMobile?: boolean
  title?: string
  relationTo?: 'products'
  doc?: Product
  size?: 'small' | 'large'
}> = props => {
  const {
    showCategories,
    title: titleFromProps,
    doc,
    doc: { slug, title, categories, meta, priceJSON } = {},
    className,
    size = 'small',
  } = props
  const matches = useMediaQuery('(min-width: 768px)')

  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/products/${slug}`

  const [
    price, // eslint-disable-line no-unused-vars
    setPrice,
  ] = useState(() => priceFromJSON(priceJSON))

  useEffect(() => {
    setPrice(priceFromJSON(priceJSON))
  }, [priceJSON])

  if (size === 'small') {
    return (
      <Link href={href} className={[classes.card, className].filter(Boolean).join(' ')}>
        <div className={classes.mediaWrapper}>
          {!metaImage && <div className={classes.placeholder}>No image</div>}
          {metaImage && typeof metaImage !== 'string' && (
            <Media imgClassName={classes.image} resource={metaImage} fill />
          )}
        </div>
        <div className={classes.content}>
          {showCategories && hasCategories && (
            <div className={classes.leader}>
              {showCategories && hasCategories && (
                <div className={'text-xs'}>
                  {categories?.map((category, index) => {
                    if (typeof category === 'object' && category !== null) {
                      const { title: titleFromCategory } = category

                      const categoryTitle = titleFromCategory || ''

                      const isLast = index === categories.length - 1

                      return (
                        <Fragment key={index}>
                          {categoryTitle}
                          {!isLast && <Fragment>, &nbsp;</Fragment>}
                        </Fragment>
                      )
                    }

                    return null
                  })}
                </div>
              )}
            </div>
          )}
          {titleToUse && <h4 className={classes.title}>{titleToUse}</h4>}
          {description && (
            <div className={classes.body}>
              {description && <p className={classes.description}>{sanitizedDescription}</p>}
            </div>
          )}
          <div className={'mt-4 flex gap-3 hidden items-center'}>
            <Button>Book Now</Button>
            <button className={'flex text-sm items-center'}>
              Learn More &nbsp;
              <MoveRightIcon strokeWidth={1} />
            </button>
            {/*</Link>*/}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className={'flex flex-col md:flex-row items-center '}>
      <div className={'md:w-1/2 p-6'}>
        <span className={'text-sm'}>Introducing</span>
        {titleToUse && (
          <h4 className={'text-2xl font-semibold'}>
            <Link href={href} className={classes.titleLink}>
              {titleToUse}
            </Link>
          </h4>
        )}
        {description && (
          <div className={cn(classes.body, 'prose max-w-md')}>
            {description && <p className={classes.description}>{sanitizedDescription}</p>}
          </div>
        )}
        <div className={'mt-4 flex gap-3 '}>
          <Link href={`/products/${slug}`}>
            <Button>Book Now</Button>
          </Link>
          <Link href={`/products/${slug}`} className={'flex items-center'}>
            <button className={'flex text-sm items-center'}>
              Learn More &nbsp;
              <MoveRightIcon strokeWidth={1} />
            </button>
          </Link>
        </div>
      </div>
      <Link href={href} className={'md:w-1/2 aspect-[6/4] relative rounded-lg overflow-hidden'}>
        {!metaImage && <div className={classes.placeholder}>No image</div>}
        {metaImage && typeof metaImage !== 'string' && (
          <Media imgClassName={classes.image} resource={metaImage} fill />
        )}
      </Link>
    </div>
  )
}
