'use client'

import React, { useEffect, useState } from 'react'

import { Product } from '../../../payload/payload-types'

import classes from './index.module.scss'
import { BookingDetails } from '@/_utilities/bookingCalculations'

export const priceFromJSON = (priceJSON: string, quantity: number = 1, raw?: boolean): string => {
  let price = ''

  if (priceJSON) {
    try {
      const parsed = JSON.parse(priceJSON)?.data[0]
      const priceValue = parsed.unit_amount * quantity
      const priceType = parsed.type

      if (raw) return priceValue.toString()

      price = (priceValue / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD', // TODO: use `parsed.currency`
      })

      if (priceType === 'recurring') {
        price += `/${
          parsed.recurring.interval_count > 1
            ? `${parsed.recurring.interval_count} ${parsed.recurring.interval}`
            : parsed.recurring.interval
        }`
      }
    } catch (e) {
      console.error(`Cannot parse priceJSON`) // eslint-disable-line no-console
    }
  }

  return price
}

export const Price: React.FC<{
  product: Product
  quantity?: number
  button?: 'addToCart' | 'removeFromCart' | false
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
    </div>
  )
}

export const formattedPrice = (s: number) => {
  const p = s.toLocaleString('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  return `${p} CAD`
}
export function getAvgPrice(product: Product, d?: BookingDetails) {
  const priceData = JSON.parse(product.priceJSON).data
  const defaultNightly = priceData[0]
  if (!defaultNightly?.unit_amount) return ''
  let p = d?.averageRate ? d.averageRate : defaultNightly.unit_amount / 100
  return formattedPrice(p)
}

function findNightlyPrice(prices: any[]): any | null {
  if (prices.length === 0) return null;

  // Attempt to find the price with lookup_key "low_nightly"
  const lowNightly = prices.find(price => price.lookup_key === 'low_nightly');
  if (lowNightly) return lowNightly;

  // If not found, attempt to find any price with a lookup_key ending with "_nightly"
  const nightlySuffix = prices.find(price => price.lookup_key.endsWith('_nightly'));
  if (nightlySuffix) return nightlySuffix;

  // If neither is found, return the first item in the array
  return prices[0];
}
