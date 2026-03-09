import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, addMonths, subMonths } from 'date-fns'

// Get all days to display in a calendar month grid (includes padding days from prev/next month)
export function getCalendarDays(year: number, month: number): Date[] {
  const monthStart = startOfMonth(new Date(year, month - 1)) // month is 1-indexed
  const monthEnd = endOfMonth(monthStart)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 }) // Sunday
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  return eachDayOfInterval({ start: calStart, end: calEnd })
}

// Format date to YYYY-MM-DD
export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

// Get next/prev month as { year, month }
export function getNextMonth(year: number, month: number): { year: number; month: number } {
  const next = addMonths(new Date(year, month - 1), 1)
  return { year: next.getFullYear(), month: next.getMonth() + 1 }
}

export function getPrevMonth(year: number, month: number): { year: number; month: number } {
  const prev = subMonths(new Date(year, month - 1), 1)
  return { year: prev.getFullYear(), month: prev.getMonth() + 1 }
}

// Get P&L color intensity: stronger green/red for larger absolute values
export function getPnlColorClass(pnl: number): string {
  if (pnl === 0) return 'bg-muted'
  if (pnl > 0) {
    if (pnl > 1000) return 'bg-green-600 text-white dark:bg-green-500'
    if (pnl > 500) return 'bg-green-500 text-white dark:bg-green-400'
    if (pnl > 100) return 'bg-green-400 dark:bg-green-600 text-white'
    return 'bg-green-200 dark:bg-green-900'
  }
  if (pnl < -1000) return 'bg-red-600 text-white dark:bg-red-500'
  if (pnl < -500) return 'bg-red-500 text-white dark:bg-red-400'
  if (pnl < -100) return 'bg-red-400 dark:bg-red-600 text-white'
  return 'bg-red-200 dark:bg-red-900'
}
