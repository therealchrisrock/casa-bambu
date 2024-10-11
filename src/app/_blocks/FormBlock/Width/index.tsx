import * as React from 'react'
import classes from './index.module.scss'
import { cn } from '@/_lib/utils'

export const Width: React.FC<{
  width?: string
  children: React.ReactNode
}> = ({ width, children }) => {
  return (
    <div className={cn([
      width ? `col-span-1` : 'col-span-2',
      'space-y-2',
      classes.width
    ] )}>
      {children}
    </div>
  )
}
