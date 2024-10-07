import React, { ReactNode } from 'react'
import { StarHalfIcon, StarIcon, StarOffIcon } from 'lucide-react'

import { Page, Review } from '../../../payload/payload-types'

import { Gutter } from '@/_components/Gutter'
import { Media } from '@/_components/Media'
import RichText from '@/_components/RichText'
import { useId } from '@radix-ui/react-id'

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
        <div className={'h-full  space-y-6 invert'}>
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
              <Score review={review} />
              {review.statement && <div className={'text-lg font-medium '}>{review.statement}</div>}
            </div>
            <div className={'text-sm '}>
              <div className={'font-semibold'}>{review.name}</div>
              {typeof review?.relatedListing === 'object' && (
                <div className={'tracking-widest'}>Guest of {review.relatedListing.title}</div>
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
function Score({ review }: { review: Review }) {
  const hasRemainder = review.rating % 2
  const whole = Math.floor(review.rating / 2)
  const stars: ReactNode[] = []
  const size = 18
  for (let i = 1; i <= 5; i++) {
    if (i <= whole) {
      stars.push(<StarIcon key={`pt--${i}`} size={size} className={'fill-foreground'}></StarIcon>)
    } else if (i === whole + 1 && hasRemainder) {
      stars.push(<StarHalfIcon key={`pt--${i}`} size={size} className={'fill-foreground'}></StarHalfIcon>)
    } else {
      stars.push(<StarIcon size={size} key={`pt--${i}`} />)
    }
  }
  return <div className={'flex gap-1'}>{stars}</div>
}
