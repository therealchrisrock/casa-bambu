'use client'

import React from 'react'
import { ArrowRightIcon, MoveRightIcon } from 'lucide-react'
import Link from 'next/link'

import { Button as ShadButton } from '@/_components/ui/button'

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
}

export const Button: React.FC<Props> = ({
  el: elFromProps = 'link',
  label,
  newTab,
  href,
  appearance = 'secondary',
  className: classNameFromProps,
  onClick,
  type = 'button',
  disabled,
  invert,
}) => {
  let el = elFromProps

  const newTabProps = newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  const className = [classes.button, classNameFromProps].filter(Boolean).join(' ')
  let variant: 'default' | 'secondary' | 'link' | 'ghost' | 'destructive' | 'outline' =
    appearance === 'primary' ? 'default' : appearance === 'none' ? 'ghost' : appearance
  const content = (
    <>
      <ShadButton
        variant={variant}
        className={invert ? 'invert' : ''}
        disabled={disabled}
        onClick={onClick}
      >
        {label}&nbsp;{variant === 'link' && <MoveRightIcon strokeWidth={1} />}
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
  return (
    <ShadButton
      className={invert ? 'invert' : ''}
      disabled={disabled}
      variant={'default'}
      onClick={onClick}
    >
      {label}
    </ShadButton>
  )

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
