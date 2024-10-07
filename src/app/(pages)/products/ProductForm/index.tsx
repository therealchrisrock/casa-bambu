'use client'

import React, { ReactNode } from 'react'
import { DateRange } from 'react-day-picker'
import { BathIcon, BedSingleIcon, MapPin, UsersIcon } from 'lucide-react'

import { PriceBreakdown } from '@/_components/BookingDetails/PriceBreakdown'
import { CreateReservationButton } from '@/_components/CreateReservationButton'
import { DatePickerWithRange } from '@/_components/DateSelector'
import { formattedPrice } from '@/_components/Price'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/_components/ui/select'
import { useBooking } from '@/_providers/Booking'
import { DEFAULT_MIN_DAYS } from '@/(pages)/products/utils'

export function ProductDetails() {
  const { product } = useBooking()
  const padding = 'px-4 pt-4 pb-8'
  return (
    <div className={'rounded-lg border shadow-lg'}>
      <div
        className={`bg-secondary text-secondary-foreground space-y-4 text-center ${padding} overflow-hidden rounded-t-lg`}
      >
        <div className={''}>
          <h1 className={'text-lg font-semibold'}>{product.title}</h1>
          <h3 className={'text-copy flex items-center justify-center gap-1'}>
            <MapPin width={20} height={20} />
            <span>West Bay, Roatan</span>
          </h3>
        </div>
        <div className={'grid grid-cols-3'}>
          <ProductFeature
            icon={<UsersIcon strokeWidth={1} width={33} height={33} />}
            quantity={product.maxGuestQuantity}
            label={'Guests'}
          />
          <ProductFeature
            icon={<BedSingleIcon strokeWidth={1} width={33} height={33} />}
            quantity={product.bedroomQuantity}
            label={'Bdrms'}
          />
          <ProductFeature
            icon={<BathIcon strokeWidth={1} width={33} height={33} />}
            quantity={product.bathQuantity}
            label={'Bath'}
          />
        </div>
      </div>
      <div className={` space-y-6 ${padding}`}>
        <ProductForm />
      </div>
    </div>
  )
}

export function ProductForm() {
  const { loading, settings, unavailableDates, product, booking, setBooking, clearBooking } =
    useBooking()

  // Handle guest selection change
  const handleGuestChange = (value: string) => {
    if (booking) {
      const updatedBooking = {
        ...booking,
        guestCount: parseInt(value, 10),
      }
      setBooking(updatedBooking)
    }
  }
  if (loading) return <ProductFormSkeleton />
  return (
    <>
      <div>
        {booking?.averageRate && (
          <h3 className={'flex gap-1 items-baseline'}>
            <span className={'text-2xl text-tertiary font-semibold'}>
              {formattedPrice(booking.averageRate)}
            </span>
            <span className={'text-sm'}>night</span>
          </h3>
        )}
        <h5 className={'text-xs'}>(min. {(settings.minBooking ?? DEFAULT_MIN_DAYS) - 1} nights)</h5>
      </div>
      <div className={'space-y-6'}>
        <div className={'space-y-2'}>
          <DatePickerWithRange />
          <Select value={booking?.guestCount.toString()} onValueChange={handleGuestChange}>
            <SelectTrigger className="">
              <SelectValue placeholder="Number of Guests" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: product.maxGuestQuantity }, (_, i) => i + 1).map(num => (
                <SelectItem key={num} value={String(num)}>
                  {num} Guest{num > 1 ? 's' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <CreateReservationButton />
          {/*<AddToCartButton settings={settings} bookingDetails={bookingDetails} />*/}
          {/*{CART_MODE === 'invoice' ? (*/}
          {/*  <CreateReservationButton*/}
          {/*    dates={dates}*/}
          {/*    headProduct={product.id}*/}
          {/*    items={[{ product, quantity: calculateNights(dates) }]}*/}
          {/*  />*/}
          {/*) : (*/}
          {/*)}*/}
        </div>
        {booking && <PriceBreakdown booking={booking} />}
      </div>
    </>
  )
}

export function ProductFormSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Skeleton for the price display */}
      <div className="h-7 bg-gray-200 rounded w-1/3"></div>

      {/* Skeleton for the minimum booking nights text */}
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className={'space-y-2'}>
        {/* Skeleton for the date picker placeholder */}
        <div className="h-10 bg-gray-200 rounded"></div>

        {/* Skeleton for the guest picker placeholder */}
        <div className="h-10 bg-gray-200 rounded"></div>

        {/* Skeleton for the reservation button */}
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>

      {/* Skeleton for the price breakdown (optional) */}
      <div className="space-y-2">
        <div className={'flex justify-between'}>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className={'flex justify-between'}>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className={'flex justify-between'}>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
      <div>
        <div className="h-8 bg-gray-200 rounded pt-5"></div>
      </div>
    </div>
  )
}

function ProductFeature({
  icon,
  quantity,
  label,
}: {
  icon: ReactNode
  quantity: number
  label: string
}) {
  return (
    <div className={'col-span-1 flex items-end justify-center gap-2'}>
      {icon}
      <div className={'text-xs grid text-left grid-cols-1'}>
        <span>{quantity}</span>
        <span>{label}</span>
      </div>
    </div>
  )
}

const calculateNights = (dates: DateRange) => {
  if (dates.from && dates.to) {
    const timeDiff = dates.to.getTime() - dates.from.getTime()
    const nights = timeDiff / (1000 * 60 * 60 * 24) // Convert milliseconds to days
    return Math.floor(nights) // Use Math.floor to exclude the end date as a night
  }
  return 0
}
