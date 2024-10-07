'use client'

import * as React from 'react'
import { ReactNode, useRef, useState } from 'react'
import { dateMatchModifiers, DateRange, Matcher } from 'react-day-picker'
import { UTCDate } from '@date-fns/utc'
import { addDays, differenceInCalendarDays, format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/_components/ui/button'
import { Calendar } from '@/_components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/_components/ui/popover'
import { isBookingAvailable } from '@/_lib/bookings'
import { cn } from '@/_lib/utils'
import { useBooking } from '@/_providers/Booking'
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
  )
}

export const useDateRangeSelector = () => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  })
  return [date, setDate]
}
