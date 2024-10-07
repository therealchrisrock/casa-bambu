import React, { forwardRef, Ref } from 'react'

import classes from './index.module.scss'

type Props = {
  left?: boolean
  right?: boolean
  top?: boolean
  className?: string
  children: React.ReactNode
  ref?: Ref<HTMLDivElement>
  narrow?: boolean
}

export const Gutter: React.FC<Props> = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { left = true, right = true, top = false, narrow = false, className, children } = props

  return (
    <div
      ref={ref}
      className={[
        classes.gutter,
        left && classes.gutterLeft,
        right && classes.gutterRight,
        top && 'pt-10 lg:pt-12 xl:pt-14',
        narrow && classes.narrow,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
})

Gutter.displayName = 'Gutter'
