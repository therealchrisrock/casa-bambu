import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'


import { Button as ShadButton, buttonVariants } from '@/_components/ui/button'
import { useBooking } from '@/_providers/Booking'
import type { VariantProps } from 'class-variance-authority'

export function CreateReservationButton({ size = 'default' }: { size?: VariantProps<typeof buttonVariants>['size'] }) {
  const router = useRouter()
  const { booking, product, isValidBooking } = useBooking()
  return (
    <ShadButton size={size} className={'w-full'} variant={'tertiary'} disabled={!isValidBooking} asChild>
      <Link
        href={`/book/${product.slug}?guests=${booking?.guestCount}&from=${booking?.from}&to=${booking?.to}`}
      >
        Reserve
      </Link>
    </ShadButton>
  )
}
