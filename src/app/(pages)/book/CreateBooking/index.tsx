'use client'
import React, { Fragment, ReactNode, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { UTCDate } from '@date-fns/utc'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'

import { DatePickerWithRange } from '@/_components/DateSelector'
import { formattedPrice } from '@/_components/Price'
import { Button } from '@/_components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/_components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/_components/ui/form'
import { Select, SelectContent, SelectItem } from '@/_components/ui/select'
import { Separator } from '@/_components/ui/separator'
import { Textarea } from '@/_components/ui/textarea'
import { useAuth } from '@/_providers/Auth'
import { useBooking } from '@/_providers/Booking'
import { formatDateRange } from '@/_utilities/formatDateTime'

export function CreateBooking({ children }: { children?: ReactNode }) {
  return (
    <div className={'max-w-screen-xl'}>
      <div className={'grid grid-cols-1 lg:grid-cols-2 gap-2'}>
        <div className={'order-2 lg:order-1 pt-8 lg:pt-0 px-2 lg:px-0'}>{children}</div>
        <div className={'lg:order-2 order-1'}>
          <div className={'sticky top-4'}>
            <CartLines />
          </div>
        </div>
      </div>
    </div>
  )
}

const bookingFormSchema = z.object({
  message: z.string().min(1, {
    message:
      'Please let us know some basic information about your trip in your reservation request.',
  }),
  dateRange: z.object(
    {
      from: z.date(),
      to: z.date(),
    },
    {
      required_error: 'Please select a date range',
    },
  ),
})

export function BookingForm() {
  const user = useAuth()
  const { booking, loading, product, isAvailable, setBooking, isValidBooking } = useBooking()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openGuestDropdown, setOpenGuestDropdown] = useState(false)
  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      message: '',
      dateRange: {
        from: booking?.from ? new UTCDate(booking.from) : null,
        to: booking?.to ? new UTCDate(booking.to) : null,
      },
    },
  })
  const handleGuestChange = (value: string) => {
    if (booking) {
      const updatedBooking = {
        ...booking,
        guestCount: parseInt(value, 10),
      }
      setBooking(updatedBooking)
    }
  }
  useEffect(() => {
    const df = form.getValues('dateRange')
    if (booking?.from && booking?.to) {
      form.setValue('dateRange', {
        from: new UTCDate(booking.from),
        to: new UTCDate(booking.to),
      })
    }
  }, [booking])
  const onSubmit = useCallback(
    async data => {
      try {
        setIsSubmitting(true)
        const res = await fetch('/api/create-invoice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: booking.from,
            to: booking.to,
            guests: booking.guestCount,
            pid: booking.productID,
            message: data.message,
          }),
        })
        const d = await res.json()
        setIsSubmitting(false)
        if (d?.error) {
          if (d?.message) {
            const params = new URLSearchParams(searchParams)
            // Append the error message to query params
            params.set('error', d.message)
            // Construct the new URL with pathname and updated query params
            const newUrl = `${pathname}?${params.toString()}`
            // Push the updated URL with query parameters
            router.push(newUrl)
            // Push the updated URL with query parameters
          }
        }
        if (res.status === 200) {
          router.push('/booking-confirmation')
        }
      } catch (err) {
        console.error('an error has occurred', err)
      }
    },
    [user, booking],
  )
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = form

  // Show skeleton while loading or booking data is not yet available
  if (loading || !booking?.from || !booking?.to) {
    return <BookingFormSkeleton />
  }

  return (
    <Form {...form}>
      {booking?.from && booking?.to && booking?.guestCount && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={'divide-y grid grid-cols-1 gap-8'}>
            <div className={'space-y-2'}>
              <h3 className={'text-xl font-semibold '}>Your Trip</h3>
              <div>
                <FormField
                  control={form.control}
                  name="dateRange"
                  render={({ field }) => (
                    <FormItem>
                      <div className={'flex justify-between font-semibold'}>
                        <FormLabel className={'flex-1 text-md font-semibold'}>Dates</FormLabel>
                        <DatePickerWithRange>
                          <button className={'underline flex-0'}>Edit</button>
                        </DatePickerWithRange>
                      </div>
                      <span>
                        {formatDateRange(new UTCDate(booking.from), new UTCDate(booking.to))}
                      </span>
                      {!isAvailable && (
                        <div className={'text-destructive text-xs'}>
                          Sorry, your booking dates are no longer available. Please select another
                          booking date to continue
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <div className={'flex justify-between font-semibold'}>
                  <h3 className={'flex-1'}>Guests</h3>
                  <button className={'underline flex-0'} onClick={() => setOpenGuestDropdown(true)}>
                    Edit
                  </button>
                  <Select
                    open={openGuestDropdown}
                    onOpenChange={setOpenGuestDropdown}
                    value={booking?.guestCount.toString()}
                    onValueChange={handleGuestChange}
                  >
                    <SelectContent>
                      {Array.from({ length: product.maxGuestQuantity }, (_, i) => i + 1).map(
                        num => (
                          <SelectItem key={num} value={String(num)}>
                            {num} Guest{num > 1 ? 's' : ''}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <span>
                  {booking.guestCount} guest{booking.guestCount > 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <div className={'prose  pt-8'}>
              <h3 className={'text-xl font-semibold '}>Write a Message to The Host</h3>
              <p className={' text-copy'}>
                Before you can continue, let us know a little about your trip and why our place is a
                good fit.
              </p>
              <FormField
                control={control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        className={'resize-none min-h-28'}
                        placeholder={
                          'Example: "Hi Whitney, my partner and I are planning to spend a lot of time scuba diving in Roatan and your place is near the dive shop."'
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className={'pt-8'}>
              <p className={'text-xs prose'}>
                By selecting the button, I agree to the{' '}
                <a target={'_blank'} href={'/policies/rental-agreement'}>
                  booking terms
                </a>
                . I also agree to the updated{' '}
                <a target={'_blank'} href={'/policies/terms-and-conditions'}>
                  Terms and Conditions
                </a>
                , and I acknowledge the{' '}
                <a target={'_blank'} href={'/policies/privacy-policy'}>
                  Privacy Policy
                </a>
                .
              </p>
            </div>
            <div className={'pt-8'}>
              <Button type={'submit'} size={'lg'} disabled={isSubmitting || !isValidBooking()}>
                Request to Book
              </Button>
            </div>
          </div>
        </form>
      )}
    </Form>
  )
}

function BookingFormSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="divide-y grid grid-cols-1 gap-8">
        <div className="space-y-2">
          <div className="h-6 w-40 bg-gray-300 rounded"></div>
          <div className="h-5 w-full bg-gray-200 rounded mt-2"></div>
          <div className="h-5 w-full bg-gray-200 rounded mt-2"></div>
        </div>
        <div className="space-y-2">
          <div className="h-6 w-40 bg-gray-300 rounded"></div>
          <div className="h-5 w-full bg-gray-200 rounded mt-2"></div>
        </div>
        <div className="pt-8">
          <div className="h-6 w-60 bg-gray-300 rounded"></div>
          <div className="h-20 w-full bg-gray-200 rounded mt-2"></div>
        </div>
        <div className="pt-8">
          <div className="h-6 w-60 bg-gray-300 rounded"></div>
        </div>
        <div className="pt-8">
          <div className="h-10 w-32 bg-gray-400 rounded"></div>
        </div>
      </div>
    </div>
  )
}

function CartLines() {
  const { booking, product, loading } = useBooking()
  if (loading || !booking) {
    return <CartLinesSkeleton /> // Display skeleton while loading
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">{booking.listing}</CardTitle>
          {booking.from && booking.to && (
            <CardDescription>
              {new UTCDate(booking.from).toDateString()} - {new UTCDate(booking.to).toDateString()}
            </CardDescription>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Reservation Details</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {booking.listing} x {booking.duration} nights
              </span>
              <span>{formattedPrice(booking.basePrice)}</span>
            </li>
            {(booking.additionalFees ?? []).map(f => (
              <li key={f.priceID} className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  <span>{f.label}</span>
                </span>
                <span>{formattedPrice(f.total)}</span>
              </li>
            ))}
          </ul>
          <Separator className="my-2" />
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formattedPrice(booking.subtotal)}</span>
            </li>
            {(booking.coupons ?? []).map(f => (
              <li className="flex items-center justify-between" key={f.couponID}>
                <span className="text-primary">
                  <span>{f.label}</span>
                </span>
                <span className="text-primary">{formattedPrice(f.total)}</span>
              </li>
            ))}
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>Tax Included</span>
            </li>
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">Total</span>
              <span>{formattedPrice(booking.total)}</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

function CartLinesSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            <div className="h-6 w-32 bg-gray-300 animate-pulse rounded"></div>
          </CardTitle>
          <CardDescription className="h-4 w-48 bg-gray-300 animate-pulse rounded mt-2"></CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">
            <div className="h-4 w-36 bg-gray-300 animate-pulse rounded"></div>
          </div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="h-4 w-40 bg-gray-300 animate-pulse rounded"></span>
              <span className="h-4 w-16 bg-gray-300 animate-pulse rounded"></span>
            </li>
            <li className="flex items-center justify-between">
              <span className="h-4 w-32 bg-gray-300 animate-pulse rounded"></span>
              <span className="h-4 w-16 bg-gray-300 animate-pulse rounded"></span>
            </li>
          </ul>
          <Separator className="my-2" />
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="h-4 w-28 bg-gray-300 animate-pulse rounded"></span>
              <span className="h-4 w-16 bg-gray-300 animate-pulse rounded"></span>
            </li>
            <li className="flex items-center justify-between">
              <span className="h-4 w-20 bg-gray-300 animate-pulse rounded"></span>
              <span className="h-4 w-16 bg-gray-300 animate-pulse rounded"></span>
            </li>
            <li className="flex items-center justify-between">
              <span className="h-4 w-24 bg-gray-300 animate-pulse rounded"></span>
              <span className="h-4 w-12 bg-gray-300 animate-pulse rounded"></span>
            </li>
            <li className="flex items-center justify-between font-semibold">
              <span className="h-4 w-24 bg-gray-300 animate-pulse rounded"></span>
              <span className="h-4 w-20 bg-gray-300 animate-pulse rounded"></span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
