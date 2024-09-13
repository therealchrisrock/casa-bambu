'use client'

import React, { ReactNode, useMemo, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { BathIcon, BedSingleIcon, MapPin, UsersIcon } from 'lucide-react'

import { Booking, Product, Settings } from '../../../../payload/payload-types'

import { AddToCartButton } from '@/_components/AddToCartButton'
import { DatePickerWithRange } from '@/_components/DateSelector'
import { getAvgPrice } from '@/_components/Price'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/_components/ui/select'
import { calculateBookingDetails } from '@/_utilities/bookingCalculations'
import { DEFAULT_MIN_DAYS, findFirstAvailableDateRange, getUnavailableDates } from '@/(pages)/products/utils'
import { PriceBreakdown } from '@/_components/BookingDetails/PriceBreakdown'

export function ProductDetails({
  product,
  bookings,
  settings,
}: {
  settings: Settings
  bookings: Booking[]
  product: Product
}) {
  const padding = 'px-4 pt-4 pb-8'
  const initDates = findFirstAvailableDateRange(bookings)
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
        {initDates ? (
          <ProductForm
            initDates={initDates}
            product={product}
            bookings={bookings}
            settings={settings}
          />
        ) : (
          <div>SOLD OUT</div>
        )}
      </div>
    </div>
  )
}
export function ProductForm({
  product,
  bookings,
  settings,
  initDates,
}: {
  settings: Settings
  bookings: Booking[]
  product: Product
  initDates: DateRange
}) {
  const unavailableDates = getUnavailableDates(bookings, settings)
  const [dates, setDates] = useState<DateRange>(initDates)
  const [guestsQuantity, setGuestsQuantity] = useState(String(product.baseGuestQuantity))
  const bookingDetails = useMemo(() => {
    return calculateBookingDetails(product, dates, parseInt(guestsQuantity), settings)
  }, [product, dates, guestsQuantity])

  return (
    <>
      <div>
        <h3 className={'flex gap-1 items-baseline'}>
          <span className={'text-2xl text-tertiary font-semibold'}>
            {getAvgPrice(product, bookingDetails)}
          </span>
          <span className={'text-sm'}>night</span>
        </h3>
        <h5 className={'text-xs'}>(min. {settings.minBooking ?? DEFAULT_MIN_DAYS} nights)</h5>
      </div>
      <div className={'space-y-6'}>
        <div className={'space-y-2'}>
          <DatePickerWithRange disabled={unavailableDates} dates={dates} setDates={setDates} />
          <Select
            value={guestsQuantity}
            defaultValue={guestsQuantity}
            onValueChange={setGuestsQuantity}
          >
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
          <AddToCartButton settings={settings} bookingDetails={bookingDetails} />

          {/*{CART_MODE === 'invoice' ? (*/}
          {/*  <CreateReservationButton*/}
          {/*    dates={dates}*/}
          {/*    headProduct={product.id}*/}
          {/*    items={[{ product, quantity: calculateNights(dates) }]}*/}
          {/*  />*/}
          {/*) : (*/}
          {/*)}*/}
        </div>
        {bookingDetails && <PriceBreakdown booking={bookingDetails} />}
      </div>
    </>
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
