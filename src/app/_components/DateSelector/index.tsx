'use client'

import * as React from 'react'
import { Dispatch, ReactNode, SetStateAction, useRef, useState } from 'react'
import { dateMatchModifiers, DateRange, Matcher } from 'react-day-picker'
import { UTCDate } from '@date-fns/utc'
import { addDays, differenceInCalendarDays, differenceInDays, format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Gutter } from '@/_components/Gutter'
import { formattedPrice } from '@/_components/Price'
import { Button } from '@/_components/ui/button'
import { Calendar } from '@/_components/ui/calendar'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/_components/ui/drawer'
import { Popover, PopoverContent, PopoverTrigger } from '@/_components/ui/popover'
import { isBookingAvailable } from '@/_lib/bookings'
import { cn } from '@/_lib/utils'
import { useBooking } from '@/_providers/Booking'
import { BookingDetails, calculateBookingDetails } from '@/_utilities/bookingCalculations'
import { formatDateRange } from '@/_utilities/formatDateTime'
import { MobilePrice, MobileProductDetails } from '@/(pages)/products/ProductForm'
import { DEFAULT_MIN_DAYS } from '@/(pages)/products/utils'
export function DatePickerWithRange({
  className,
  children,
}: {
  children?: ReactNode
  className?: HTMLDivElement['className']
}) {
  const [isFirstSelection, setIsFirstSelection] = useState(true)
  const searchParams = useSearchParams()
  const [openPopover, setOpenPopover] = useState<boolean>(false)
  // Get initial dates from URL query parameters (if any)
  const initialFrom = searchParams.get('from')
  const initialTo = searchParams.get('to')

  // Initialize state for DateRange
  const [selectedDates, setSelectedDates] = useState<DateRange>({
    from: initialFrom ? new UTCDate(initialFrom) : undefined,
    to: initialTo ? new UTCDate(initialTo) : undefined,
  })

  const { booking, setDates, settings, unavailableDates } = useBooking()
  // Handle date range selection from the calendar
  const handleDateChange = (range: DateRange | undefined) => {
    if (range?.to && range.to > booking.dates.to && isFirstSelection) {
      setSelectedDates({ from: range.to, to: undefined })
      setIsFirstSelection(false)
    } else if (range?.from && range.from < booking.dates.from && isFirstSelection) {
      setSelectedDates({ from: range.from, to: undefined })
      setIsFirstSelection(false)
    } else {
      setSelectedDates(range)
      if (range?.from && range?.to) {
        setDates(range)
        setOpenPopover(false)
        setIsFirstSelection(true)
      }
    }
    if (range?.from && range?.to) {
      setDates(range)
      setOpenPopover(false)
      setIsFirstSelection(true)
    }
  }
  if (!booking) return <Button className={'w-full'} variant={'outline'}></Button>
  const { dates } = booking
  return (
    <div>
      <div className={'md:block hidden'}>
        <div className={cn('grid gap-2', className)}>
          <Popover open={openPopover} onOpenChange={setOpenPopover}>
            <PopoverTrigger asChild>
              {children ? (
                children
              ) : (
                <Button
                  id="date"
                  variant={'outline'}
                  className={cn(
                    ' justify-start text-left font-normal',
                    !dates && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dates?.from ? (
                    dates.to ? (
                      <>
                        {format(dates.from, 'LLL dd, y')} - {format(dates.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(dates.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              )}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                showOutsideDays={false}
                startMonth={new Date()}
                today={null}
                mode="range"
                defaultMonth={selectedDates?.from ?? new UTCDate(booking?.from ?? '')}
                selected={selectedDates}
                onSelect={handleDateChange}
                min={settings.minBooking}
                numberOfMonths={2}
                disabled={unavailableDates}
                excludeDisabled={true}
                max={settings.maxBooking}
                modifiers={{
                  booked: unavailableDates,
                }}
                modifiersClassNames={{
                  booked: 'booked--day',
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className={'md:hidden block'}>
        <MobileCalendar selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
      </div>
    </div>
  )
}

export function MobileCalendar({
  selectedDates,
  setSelectedDates,
}: {
  selectedDates: DateRange
  setSelectedDates: Dispatch<SetStateAction<DateRange>>
}) {
  const { settings, unavailableDates, product, setBooking, booking } = useBooking()
  const [tmpBooking, setTmpBooking] = useState<BookingDetails | null>(
    calculateBookingDetails(product, selectedDates, booking.guestCount, settings),
  )
  const [open, setOpen] = useState(false)
  const handleMobileDateChange = (range: DateRange | undefined) => {
    setSelectedDates(range)
    if (range.from && range.to) {
      setTmpBooking(calculateBookingDetails(product, range, booking.guestCount, settings))
    } else {
      setTmpBooking(null)
    }
  }
  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      onClose={() => {
        if (tmpBooking) setBooking(tmpBooking)
      }}
    >
      <DrawerTrigger asChild>
        <button className={'text-sm underline'}>
          {selectedDates.from && selectedDates.to ? (
            <>{formatDateRange(selectedDates.from, selectedDates.to)}</>
          ) : (
            <>Select Booking Dates</>
          )}
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className={'text-left'}>
          <DrawerTitle>
            {tmpBooking ? (
              <>
                {tmpBooking.duration} night
                {tmpBooking.duration > 1 ? 's' : ''}
              </>
            ) : (
              <>{selectedDates.from ? 'Select Checkout Date' : 'Select Check-in Date '}</>
            )}
          </DrawerTitle>
          <DrawerDescription>
            {selectedDates.from && selectedDates.to ? (
              <>{formatDateRange(selectedDates.from, selectedDates.to, false)}</>
            ) : (
              <>Minimum Stay: {settings.minBooking}</>
            )}
          </DrawerDescription>
        </DrawerHeader>
        <Gutter>
          <Calendar
            hasDynamicWidth={false}
            showOutsideDays={false}
            startMonth={new Date()}
            today={null}
            mode="range"
            defaultMonth={selectedDates?.from ?? new UTCDate(booking?.from ?? '')}
            selected={selectedDates}
            onSelect={handleMobileDateChange}
            min={settings.minBooking}
            numberOfMonths={2}
            disabled={unavailableDates}
            excludeDisabled={true}
            max={settings.maxBooking}
            modifiers={{
              booked: unavailableDates,
            }}
            modifiersClassNames={{
              booked: 'booked--day',
            }}
          />
        </Gutter>
        <DrawerFooter className={'px-0'}>
          <div className=" border-t pt-4 ">
            <div
              className={
                'flex items-center w-full px-4 justify-between h-full mx-auto font-medium max-w-lg'
              }
            >
              <MobilePrice
                price={tmpBooking?.averageRate ? formattedPrice(tmpBooking.averageRate) : null}
              />
              <div>
                <Button
                  disabled={!tmpBooking}
                  onClick={() => {
                    setBooking(tmpBooking)
                    setOpen(false)
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export const useDateRangeSelector = () => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  })
  return [date, setDate]
}
