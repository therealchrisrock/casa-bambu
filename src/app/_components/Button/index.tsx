'use client'

import React, { ReactNode } from 'react'
import { ArrowRightIcon, MoveRightIcon } from 'lucide-react'
import Link from 'next/link'

import { Button as ShadButton } from '@/_components/ui/button'
import { cn } from '@/_lib/utils'

import classes from './index.module.scss'

export type Props = {
  label?: string
  appearance?: 'default' | 'primary' | 'secondary' | 'link' | 'none'
  el?: 'button' | 'link' | 'a'
  onClick?: () => void
  href?: string
  newTab?: boolean
  className?: string
  type?: 'submit' | 'button'
  disabled?: boolean
  invert?: boolean
  children?: ReactNode
  form?: string
}

export const Button: React.FC<Props> = ({
  el: elFromProps = 'link',
  children,
  label,
  newTab,
  href,
  appearance = 'secondary',
  className,
  onClick,
  type = 'button',
  form,
  disabled,
  invert,
}) => {
  let el = elFromProps

  const newTabProps = newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  let variant: 'default' | 'secondary' | 'link' | 'ghost' | 'destructive' | 'outline' =
    appearance === 'primary' ? 'default' : appearance === 'none' ? 'ghost' : appearance
  const content = (
    <>
      <ShadButton
        variant={variant}
        className={cn([invert ? 'invert' : '', className])}
        disabled={disabled}
        onClick={onClick}
      >
        {label}
        {children}
      </ShadButton>
    </>
  )

  if (onClick || type === 'submit') el = 'button'

  if (el === 'link') {
    return (
      <Link href={href || ''} {...newTabProps} onClick={onClick}>
        {content}
      </Link>
    )
  }
  return content

  //
  // const Element: ElementType = el
  //
  // return (
  //   <Element
  //     href={href}
  //     className={className}
  //     type={type}
  //     {...newTabProps}
  //     onClick={onClick}
  //     disabled={disabled}
  //   >
  //     {content}
  //   </Element>
  // )
}
