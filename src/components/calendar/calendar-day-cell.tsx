import Link from 'next/link'
import { cn } from '@/lib/utils'
import { formatDate, getPnlColorClass } from '@/lib/utils/calendar'

interface CalendarDayCellProps {
  date: Date
  pnl?: number
  tradeCount?: number
  isCurrentMonth: boolean
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

export function CalendarDayCell({ date, pnl, tradeCount, isCurrentMonth }: CalendarDayCellProps) {
  const dateStr = formatDate(date)
  const day = date.getDate()
  const hasTrades = tradeCount !== undefined && tradeCount > 0

  const cellClasses = cn(
    'relative flex flex-col items-center justify-start rounded-md border p-1 transition-colors min-h-[60px] sm:min-h-[80px] sm:p-2',
    !isCurrentMonth && 'opacity-30',
    hasTrades && pnl !== undefined
      ? getPnlColorClass(pnl)
      : 'bg-card hover:bg-accent/50',
  )

  const content = (
    <div className={cellClasses}>
      <span className="text-xs font-medium sm:text-sm">{day}</span>
      {hasTrades && pnl !== undefined && (
        <>
          <span className="mt-auto text-[10px] font-semibold leading-tight sm:text-xs">
            {pnl >= 0 ? '+' : ''}{formatCurrency(pnl)}
          </span>
          <span className="text-[9px] opacity-75 sm:text-[10px]">
            {tradeCount} {tradeCount === 1 ? 'trade' : 'trades'}
          </span>
        </>
      )}
    </div>
  )

  if (!isCurrentMonth) return content

  return (
    <Link href={`/day/${dateStr}`} aria-label={`View trades for ${dateStr}`}>
      {content}
    </Link>
  )
}
