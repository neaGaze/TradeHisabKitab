import { getCalendarDays, formatDate } from '@/lib/utils/calendar'
import { CalendarDayCell } from './calendar-day-cell'
import type { DailyPnl } from '@/lib/types/database'

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface CalendarGridProps {
  year: number
  month: number
  pnlData: DailyPnl[]
}

export function CalendarGrid({ year, month, pnlData }: CalendarGridProps) {
  const days = getCalendarDays(year, month)

  // Build lookup map: date string -> DailyPnl
  const pnlMap = new Map<string, DailyPnl>()
  for (const entry of pnlData) {
    pnlMap.set(entry.trade_date, entry)
  }

  return (
    <div>
      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1 sm:text-sm">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date) => {
          const dateStr = formatDate(date)
          const pnlEntry = pnlMap.get(dateStr)
          const isCurrentMonth = date.getMonth() === month - 1

          return (
            <CalendarDayCell
              key={dateStr}
              date={date}
              pnl={pnlEntry?.total_pnl}
              tradeCount={pnlEntry?.trade_count}
              isCurrentMonth={isCurrentMonth}
            />
          )
        })}
      </div>
    </div>
  )
}
