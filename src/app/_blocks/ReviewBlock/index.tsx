import React, { ReactNode, Suspense } from 'react'
import { StarHalfIcon, StarIcon } from 'lucide-react'

import { Page, Review } from '../../../payload/payload-types'

import { Gutter } from '@/_components/Gutter'
import { Media } from '@/_components/Media'
import { cn } from '@/_lib/utils'

type Props = Extract<Page['layout'][0], { blockType: 'reviewBlock' }>

export const ReviewBlock: React.FC<Props> = props => {
  const { media, review } = props
  if (typeof review === 'string') return <></>
  return (
    <Gutter>
      <div
        className={
          'relative xl:aspect-[3/1] min-h-[400px] max-h-[500px] w-full rounded-lg overflow-hidden p-4 md:p-6 xl:p-12   z-10'
        }
      >
        <div className={'h-full space-y-10 md:space-y-6 invert'}>
          <div>
            <img
              className={'w-48 '}
              src={'/media/large-logo.png'}
              alt={
                'The logo of Casa Bambu, a company offering vacation rental properties in West Bay, Roatan, Honduras, featuring a stylized design with the company’s name in a modern, elegant font.'
              }
            />
          </div>
          <div className={'space-y-6 prose  max-w-2xl text-foreground'}>
            <div className={'space-y-2'}>
              <Suspense>
                <Rating review={review} />
              </Suspense>
              {review.statement && <div className={'text-lg font-medium '}>{review.statement}</div>}
            </div>
            <div className={'text-sm '}>
              <div className={'font-semibold'}>{review.name}</div>
              {typeof review?.relatedListing === 'object' && review.relatedListing?.title && (
                <div className={'tracking-widest'}>Guest of {review.relatedListing?.title}</div>
              )}
            </div>
          </div>
        </div>
        <div className={''}>
          <div className={'-z-10 absolute w-full h-full inset-0 bg-black/10'}></div>
          <Media
            htmlElement={null}
            className={'absolute inset-0 w-full h-full object-cover -z-20'}
            resource={media}
          />
        </div>
      </div>
    </Gutter>
  )
}

export function Rating({ review, className}: { review: Review, className?: string }) {
  return (
    <div className={'flex gap-1'}>
      <Score className={cn(['fill-foreground stroke-foreground', className])} rating={review.rating} />
    </div>
  )
}
export function Score({ rating, className }: { className?: string; rating: number }) {
  const hasRemainder = rating % 2
  const whole = Math.floor(rating / 2)
  const stars: ReactNode[] = []
  const size = 18
  for (let i = 1; i <= 5; i++) {
    if (i <= whole) {
      stars.push(
        <StarIcon
          key={`pt--${i}`}
          size={size}
          className={cn(['fill-tertiary stroke-tertiary', className])}
        ></StarIcon>,
      )
    } else if (i === whole + 1 && hasRemainder) {
      stars.push(
        <StarHalfIcon
          key={`pt--${i}`}
          size={size}
          className={cn(['fill-tertiary stroke-tertiary', className])}
        ></StarHalfIcon>,
      )
    } else {
      stars.push(<StarIcon size={size} key={`pt--${i}`} />)
    }
  }
  return <>{stars}</>
}
