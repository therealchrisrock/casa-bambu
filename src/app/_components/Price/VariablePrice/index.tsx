'use client'

import React, { useEffect, useState } from 'react'

import { Product } from '../../../../payload/payload-types'
import { AddToCartButton } from '../../AddToCartButton'
import { RemoveFromCartButton } from '../../RemoveFromCartButton'

import { priceFromJSON } from '@/_components/Price'

import classes from './index.module.scss'
import { DateRange } from 'react-day-picker'

export const VariablePrice: React.FC<{
  product: Product
  quantity?: number
  button?: 'addToCart' | 'removeFromCart' | false
  appearance?: 'default' | 'productForm'
}> = props => {
  const { product, product: { priceJSON } = {}, button = 'addToCart', quantity } = props

  const [price, setPrice] = useState<{
    actualPrice: string
    withQuantity: string
  }>(() => ({
    actualPrice: priceFromJSON(priceJSON),
    withQuantity: priceFromJSON(priceJSON, quantity),
  }))
  useEffect(() => {
    setPrice({
      actualPrice: priceFromJSON(priceJSON),
      withQuantity: priceFromJSON(priceJSON, quantity),
    })
  }, [priceJSON, quantity])
  return (
    <div className={classes.actions}>
      {typeof price?.actualPrice !== 'undefined' && price?.withQuantity !== '' && (
        <div className={classes.price}>
          <p>{price?.withQuantity}</p>
          {quantity > 1 && (
            <small className={classes.priceBreakdown}>{`${price.actualPrice} x ${quantity}`}</small>
          )}
        </div>
      )}
      {button && button === 'addToCart' && (
        <AddToCartButton product={product} appearance="default" />
      )}
      {button && button === 'removeFromCart' && <RemoveFromCartButton product={product} />}
    </div>
  )
}

export function getVariablePrice({
  product,
  getAvg = false,
  dates
}: {
  product: Product
  getAvg: boolean
  dates: DateRange
}) {}
