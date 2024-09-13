'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { useRouter } from 'next/navigation'

import { Product, Settings } from '../../../payload/payload-types'
import { Button, Props } from '../Button'

import { priceFromJSON } from '@/_components/Price'
import { useCart } from '@/_providers/Cart'
import { BookingDetails } from '@/_utilities/bookingCalculations'
import { getSettings } from '@/(pages)/products/utils'

import classes from './index.module.scss'

export const AddToCartButton: React.FC<{
  bookingDetails: BookingDetails
  settings: Settings
}> = props => {
  const { cart, addItemToCart, isProductInCart, hasInitializedCart } = useCart()

  const [isInCart, setIsInCart] = useState<boolean>()
  const router = useRouter()
  const addToCart = () => {
    if (!isValidBooking) return // @TODO handle error message
    props.bookingDetails.items.map(p => {
      addItemToCart({
        priceID: p.priceID,
        product: p.product,
        quantity: p.quantity,
        from: p.from,
        to: p.to,
        guestsQuantity: p.guestsQuantity,
      })
    })
    setIsInCart(true)
  }
  const s = getSettings(props.settings)
  const isValidBooking = useMemo(() => {
    return props?.bookingDetails?.duration >= s.minBooking && props.bookingDetails?.guestCount > 0
  }, [props])
  return (
    <Button
      href={isInCart ? '/cart' : undefined}
      type={!isInCart ? 'button' : undefined}
      label={isInCart ? `✓ View in cart` : `Reserve`}
      el={isInCart ? 'link' : undefined}
      appearance={'primary'}
      disabled={!isValidBooking}
      className={[isInCart && classes.green, !hasInitializedCart && classes.hidden, 'w-full']
        .filter(Boolean)
        .join(' ')}
      onClick={
        !isInCart
          ? () => {
              addToCart()
              router.push('/cart')
            }
          : undefined
      }
    />
  )
}
