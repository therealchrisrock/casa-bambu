import React, { Fragment } from 'react'

import { Page } from '../../../payload/payload-types'
import { CMSLink } from '../../_components/Link'
import { Media } from '../../_components/Media'
import RichText from '../../_components/RichText'

import classes from './index.module.scss'
import { MoveRightIcon } from 'lucide-react'

export const HighImpactHero: React.FC<Page['hero']> = ({ richText, media, links }) => {
  return (
    <div className={`relative w-full isolate flex items-center ${classes.wrap}`}>
      <div className={'w-11/12 max-w-2xl mx-auto text-center text-white space-y-4'}>
        <div className={'absolute w-full h-full inset-0 bg-black opacity-20 -z-10'}></div>
        <RichText size={'prose-lg'} className={'prose:h1'} content={richText} />
        {Array.isArray(links) && (
          <ul className={'flex justify-center gap-4 list-none'}>
            {links.map(({ link }, i) => {
              return (
                <li key={i}>
                  <CMSLink className={classes.link} {...link}>
                    {link.appearance === 'link' && (<MoveRightIcon className={'ml-2'} strokeWidth={1} />)}
                  </CMSLink>
                </li>
              )
            })}
          </ul>
        )}
      </div>
      {typeof media === 'object' && (
        <Media
          htmlElement={null}
          className={'absolute w-full h-full inset-0 -z-20 object-cover'}
          resource={media}
        />
      )}
    </div>
  )
}
