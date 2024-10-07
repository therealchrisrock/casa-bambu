import React, { useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'


import { Button as ShadButton } from '@/_components/ui/button'
import { useBooking } from '@/_providers/Booking'

export function CreateReservationButton() {
  const router = useRouter()
  const { booking, product, isValidBooking } = useBooking()
  return (
    <ShadButton className={'w-full'} variant={'tertiary'} disabled={!isValidBooking} asChild>
      <Link
        href={`/book/${product.slug}?guests=${booking?.guestCount}&from=${booking?.from}&to=${booking?.to}`}
      >
        Reserve
      </Link>
    </ShadButton>
  )
}
