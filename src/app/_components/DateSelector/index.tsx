'use client'

import * as React from 'react'
import { Dispatch, SetStateAction } from 'react'
import { DateRange, Matcher } from 'react-day-picker'
import { addDays, format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { Button } from '@/_components/ui/button'
import { Calendar } from '@/_components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/_components/ui/popover'
import { cn } from '@/_lib/utils'
import { DEFAULT_MIN_DAYS } from '@/(pages)/products/utils'
export function DatePickerWithRange({
  className,
  dates,
  setDates,
  disabled = [],
  min = DEFAULT_MIN_DAYS,
}: {
  className?: HTMLDivElement['className']
  dates?: DateRange
  setDates?: Dispatch<SetStateAction<DateRange>>
  disabled?: Matcher[]
  min?: number
}) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
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
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            showOutsideDays={false}
            startMonth={new Date()}
            today={null}
            mode="range"
            defaultMonth={dates?.from}
            selected={dates}
            onSelect={setDates}
            min={min}
            numberOfMonths={2}
            disabled={disabled}
            excludeDisabled={true}
            modifiers={{
              booked: disabled,
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
