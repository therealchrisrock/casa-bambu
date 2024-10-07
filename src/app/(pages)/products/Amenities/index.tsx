import { Product } from '../../../../payload/payload-types'

import { Media } from '@/_components/Media'
import { cn } from '@/_lib/utils'

import classes from './index.module.scss'
export function Amenities({ amenities }: { amenities: Product['features'] }) {
  return (
    <div className={'grid-cols-2 grid gap-4'}>
      {amenities.map(
        (a, idx) =>
          typeof a !== 'string' && (
            <div key={a.id} className={cn(classes.amenity, 'flex items-center text-lg gap-2')}>
              <Media className={'flex-0'} resource={a.media} />
              <h4>{a.title}</h4>
            </div>
          ),
      )}
    </div>
  )
}
