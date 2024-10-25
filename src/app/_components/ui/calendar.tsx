'use client'

import * as React from 'react'
import { DayPicker, labelNext, labelPrevious, useDayPicker } from 'react-day-picker'
import { addDays, differenceInCalendarDays, isBefore, isSameDay, isWithinInterval } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button, buttonVariants } from '@/_components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/_components/ui/tooltip'
import { cn } from '@/_lib/utils'

type BaseCalendarProps = React.ComponentProps<typeof DayPicker> & {
  /**
   * In the year view, the number of years to display at once.
   * @default 12
   */
  yearRange?: number
  hasDynamicWidth?: boolean
  /**
   * Wether to let user switch between months and years view.
   * @default false
   */
  showYearSwitcher?: boolean
  min?: number
}
export type CalendarProps = BaseCalendarProps & {
  mode: 'range'
  min: number
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  yearRange = 12,
  showYearSwitcher = false,
  numberOfMonths,
  min,
  hasDynamicWidth = true,
  ...props
}: CalendarProps) {
  const [navView, setNavView] = React.useState<'days' | 'years'>('days')
  const [displayYears, setDisplayYears] = React.useState<{
    from: number
    to: number
  }>(
    React.useMemo(() => {
      const currentYear = new Date().getFullYear()
      return {
        from: currentYear - Math.floor(yearRange / 2 - 1),
        to: currentYear + Math.ceil(yearRange / 2),
      }
    }, [yearRange]),
  )

  const { onNextClick, onPrevClick, startMonth, endMonth } = props

  const columnsDisplayed = navView === 'years' ? 1 : numberOfMonths

  return (
    <DayPicker
      min={min}
      timeZone="UTC"
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      style={{
        width: hasDynamicWidth ? 248.8 * (columnsDisplayed ?? 1) + 'px' : 'auto',
      }}
      classNames={{
        months: 'relative flex flex-col gap-y-4 sm:flex-row sm:gap-y-0',
        month_caption: 'relative mx-10 flex h-7 items-center justify-center',
        weekdays: 'flex flex-row',
        weekday: 'w-8 text-[0.8rem] font-normal text-muted-foreground',
        month: 'w-full gap-y-4 overflow-x-hidden',
        caption: 'relative flex items-center justify-center pt-1',
        caption_label: 'truncate text-sm font-medium',
        button_next: cn(
          buttonVariants({
            variant: 'outline',
            className: 'absolute right-0 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
          }),
        ),
        button_previous: cn(
          buttonVariants({
            variant: 'outline',
            className: 'absolute left-0 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
          }),
        ),
        nav: 'flex items-start',
        month_grid: 'mt-4 mx-auto',
        week: 'mt-2 flex w-full',
        day: 'flex size-8 flex-1 items-center justify-center rounded-md p-0 text-sm [&:has(button)]:hover:!bg-accent [&:has(button)]:hover:text-accent-foreground [&:has(button)]:hover:aria-selected:!bg-primary [&:has(button)]:hover:aria-selected:text-primary-foreground',
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-8 w-8 p-0 font-normal transition-none hover:bg-transparent hover:text-inherit aria-selected:opacity-100',
        ),
        range_start: 'day-range-start rounded-s-md',
        range_end: 'day-range-end rounded-e-md',
        selected:
          'bg-primary text-primary-foreground hover:!bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        outside:
          'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        disabled: 'text-muted-foreground opacity-50 line-through',
        range_middle:
          'rounded-none aria-selected:bg-accent aria-selected:text-accent-foreground hover:aria-selected:!bg-accent hover:aria-selected:text-accent-foreground',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        DayButton: props => {
          const { selected } = useDayPicker()
          const { day, modifiers, ...buttonProps } = props
          if (!selected || !selected['from'] || !min) {
            return <span {...buttonProps} />
          }

          // Determine the effective range for the minimum night tooltip
          const minRangeEnd = addDays(selected['from'], min - 1)

          // If there is no "to" date, apply the minimum nights range from the "from" date
          // If there is a "to" date, ensure the tooltip appears for dates before the "to" date
          const isWithinMinRange = !selected['to']
            ? isWithinInterval(day.date, { start: selected['from'], end: minRangeEnd })
            : isWithinInterval(day.date, { start: selected['from'], end: minRangeEnd }) &&
              isBefore(day.date, selected['to'])

          return (
            <TooltipProvider>
              {isWithinMinRange && !modifiers.range_start ? (
                <Tooltip delayDuration={100}>
                  <TooltipTrigger>
                    <span
                      {...buttonProps}
                      // Prevent the default click event
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Minimum {min} night{min > 1 ? 's' : ''}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <button
                  {...buttonProps}
                  // Prevent the default click event
                />
              )}
            </TooltipProvider>
          )
        },
        Chevron: ({ orientation }) => {
          const Icon = orientation === 'left' ? ChevronLeft : ChevronRight
          return <Icon className="h-4 w-4" />
        },
        Nav: ({ className, children, ...props }) => {
          const { nextMonth, previousMonth, goToMonth } = useDayPicker()

          const isPreviousDisabled = (() => {
            if (navView === 'years') {
              return (
                (startMonth &&
                  differenceInCalendarDays(new Date(displayYears.from - 1, 0, 1), startMonth) <
                    0) ||
                (endMonth &&
                  differenceInCalendarDays(new Date(displayYears.from - 1, 0, 1), endMonth) > 0)
              )
            }
            return !previousMonth
          })()

          const isNextDisabled = (() => {
            if (navView === 'years') {
              return (
                (startMonth &&
                  differenceInCalendarDays(new Date(displayYears.to + 1, 0, 1), startMonth) < 0) ||
                (endMonth &&
                  differenceInCalendarDays(new Date(displayYears.to + 1, 0, 1), endMonth) > 0)
              )
            }
            return !nextMonth
          })()

          const handlePreviousClick = React.useCallback(() => {
            if (!previousMonth) return
            if (navView === 'years') {
              setDisplayYears(prev => ({
                from: prev.from - (prev.to - prev.from + 1),
                to: prev.to - (prev.to - prev.from + 1),
              }))
              onPrevClick?.(
                new Date(displayYears.from - (displayYears.to - displayYears.from), 0, 1),
              )
              return
            }
            goToMonth(previousMonth)
            onPrevClick?.(previousMonth)
          }, [previousMonth, goToMonth])

          const handleNextClick = React.useCallback(() => {
            if (!nextMonth) return
            if (navView === 'years') {
              setDisplayYears(prev => ({
                from: prev.from + (prev.to - prev.from + 1),
                to: prev.to + (prev.to - prev.from + 1),
              }))
              onNextClick?.(
                new Date(displayYears.from + (displayYears.to - displayYears.from), 0, 1),
              )
              return
            }
            goToMonth(nextMonth)
            onNextClick?.(nextMonth)
          }, [goToMonth, nextMonth])
          return (
            <nav className={cn('flex items-center', className)} {...props}>
              <Button
                variant="outline"
                className="absolute left-0 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                type="button"
                tabIndex={isPreviousDisabled ? undefined : -1}
                disabled={isPreviousDisabled}
                aria-label={
                  navView === 'years'
                    ? `Go to the previous ${displayYears.to - displayYears.from + 1} years`
                    : labelPrevious(previousMonth)
                }
                onClick={handlePreviousClick}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                className="absolute right-0 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                type="button"
                tabIndex={isNextDisabled ? undefined : -1}
                disabled={isNextDisabled}
                aria-label={
                  navView === 'years'
                    ? `Go to the next ${displayYears.to - displayYears.from + 1} years`
                    : labelNext(nextMonth)
                }
                onClick={handleNextClick}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </nav>
          )
        },
        CaptionLabel: ({ children, ...props }) => {
          if (!showYearSwitcher) return <span {...props}>{children}</span>

          return (
            <Button
              className="h-7 w-full truncate text-sm font-medium"
              variant="ghost"
              size="sm"
              onClick={() => setNavView(prev => (prev === 'days' ? 'years' : 'days'))}
            >
              {navView === 'days' ? children : displayYears.from + ' - ' + displayYears.to}
            </Button>
          )
        },
        MonthGrid: ({ className, children, ...props }) => {
          const { goToMonth } = useDayPicker()
          if (navView === 'years') {
            return (
              <div className={cn('grid grid-cols-4 gap-y-2', className)} {...props}>
                {Array.from({ length: displayYears.to - displayYears.from + 1 }, (_, i) => {
                  const isBefore =
                    differenceInCalendarDays(new Date(displayYears.from + i, 12, 31), startMonth!) <
                    0

                  const isAfter =
                    differenceInCalendarDays(new Date(displayYears.from + i, 0, 0), endMonth!) > 0

                  const isDisabled = isBefore || isAfter
                  return (
                    <Button
                      key={i}
                      className={cn(
                        'h-7 w-full',
                        displayYears.from + i === new Date().getFullYear() &&
                          'bg-accent text-accent-foreground',
                      )}
                      variant="ghost"
                      onClick={() => {
                        setNavView('days')
                        goToMonth(new Date(displayYears.from + i, new Date().getMonth()))
                      }}
                      disabled={navView === 'years' ? isDisabled : undefined}
                    >
                      {displayYears.from + i}
                    </Button>
                  )
                })}
              </div>
            )
          }
          return (
            <table className={className} {...props}>
              {children}
            </table>
          )
        },
      }}
      numberOfMonths={
        // we need to override the number of months if we are in years view to 1
        columnsDisplayed
      }
      {...props}
    />
  )
}

Calendar.displayName = 'Calendar'

export { Calendar }
