import React from 'react'
import type { VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button as ShadButton, buttonVariants } from '@/_components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/_components/ui/tooltip'
import { useBooking } from '@/_providers/Booking'

export function CreateReservationButton({
  size = 'default',
}: {
  size?: VariantProps<typeof buttonVariants>['size']
}) {
  const router = useRouter()
  const { booking, product, isValidBooking } = useBooking()
  if (!isValidBooking()) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className={'w-full'}>
            <ShadButton size={size} className={'w-full'} variant={'tertiary'} disabled>
              Reserve
            </ShadButton>
          </TooltipTrigger>
          <TooltipContent>
            <p>The Selected Booking Dates are no longer available.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
  return (
    <ShadButton size={size} className={'w-full'} variant={'tertiary'} asChild>
      <Link
        href={`/book/${product.slug}?guests=${booking?.guestCount}&from=${booking?.from}&to=${booking?.to}`}
      >
        Reserve
      </Link>
    </ShadButton>
  )
}
