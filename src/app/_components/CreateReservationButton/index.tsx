import React from 'react'
import { DateRange } from 'react-day-picker'

import { Product } from '../../../payload/payload-types'

import classes from '@/_components/AddToCartButton/index.module.scss'
import { Button as ShadButton } from '@/_components/ui/button'
import { useCart } from '@/_providers/Cart'
import { useRouter } from 'next/navigation'

export function CreateReservationButton({
  dates,
  headProduct,
  items,
}: {
  dates: DateRange
  headProduct: string
  items: { product: Product; quantity: number }[]
}) {
  const { cart, addBooking } = useCart()
  const router = useRouter()
  return (
    <ShadButton
      className={'w-full'}
      variant={'tertiary'}
      onClick={() => {
        addBooking({
          headProduct,
          startDate: dates.from.toDateString(),
          endDate: dates.to.toDateString(),
        })
        // router.push('/booking')
      }}
    >
      Reserve
    </ShadButton>
  )
}
