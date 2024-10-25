import { Product } from '../../../../payload/payload-types'

import { Media } from '@/_components/Media'
import { cn } from '@/_lib/utils'

import classes from './index.module.scss'
export function Amenities({ amenities }: { amenities: Product['features'] }) {
  return (
    <div className={'grid-cols-1 xs:grid-cols-2 grid gap-4'}>
      {amenities.map(
        (a, idx) =>
          typeof a !== 'string' && (
            <div key={a.id} className={cn(classes.amenity, 'flex items-center gap-2')}>
              <Media className={'flex-0 w-5 h-5 md:w-6 md:h-6 shrink-0'} resource={a.media} />
              <h4 className={'prose text-base'}>{a.title}</h4>
            </div>
          ),
      )}
    </div>
  )
}
