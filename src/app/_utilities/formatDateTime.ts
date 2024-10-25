import { format } from 'date-fns'

export const formatDateTime = (timestamp: string): string => {
  const now = new Date()
  let date = now
  if (timestamp) date = new Date(timestamp)
  const months = date.getMonth()
  const days = date.getDate()
  // const hours = date.getHours();
  // const minutes = date.getMinutes();
  // const seconds = date.getSeconds();

  const MM = months + 1 < 10 ? `0${months + 1}` : months + 1
  const DD = days < 10 ? `0${days}` : days
  const YYYY = date.getFullYear()
  // const AMPM = hours < 12 ? 'AM' : 'PM';
  // const HH = hours > 12 ? hours - 12 : hours;
  // const MinMin = (minutes < 10) ? `0${minutes}` : minutes;
  // const SS = (seconds < 10) ? `0${seconds}` : seconds;

  return `${MM}/${DD}/${YYYY}`
}

export function formatDateToDayMonthYear(date: Date): string {
  return format(date, 'd MMM, yyyy')
}

export function getDateForStorage(date: Date): string {
  return date.toISOString().split('T')[0]
}



export function formatDateRange(from: Date, to: Date, isVariable = true): string {
  const currentYear = new Date().getFullYear();

  const fromMonth = from.toLocaleDateString('en-US', { month: 'short' });
  const toMonth = to.toLocaleDateString('en-US', { month: 'short' });

  const fromDay = from.getDate();
  const toDay = to.getDate();

  const fromYear = from.getFullYear();
  const toYear = to.getFullYear();
  if (isVariable) {
    // Same month and year
    if (fromMonth === toMonth && fromYear === toYear) {
      // If in the current year
      if (fromYear === currentYear) {
        return `${fromMonth} ${fromDay} – ${toDay}`;
      } else {
        // If in a future year
        return `${fromMonth} ${fromDay} – ${toDay}, ${fromYear}`;
      }
    }

    // Same year, different months
    if (fromYear === toYear) {
      // If in the current year
      if (fromYear === currentYear) {
        return `${fromMonth} ${fromDay} – ${toMonth} ${toDay}`;
      } else {
        // If in a future year
        return `${fromMonth} ${fromDay}, ${fromYear} – ${toMonth} ${toDay}, ${toYear}`;
      }
    }

  }
  // Different years
  return `${fromMonth} ${fromDay}, ${fromYear} – ${toMonth} ${toDay}, ${toYear}`;
}
