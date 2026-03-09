import { getTradesForDate } from '@/lib/actions/trades'
import { DayNav } from '@/components/trades/day-nav'
import { DaySummary } from '@/components/trades/day-summary'
import { DayPageClient } from '@/components/trades/day-page-client'
import { TradeList } from '@/components/trades/trade-list'

interface DayPageProps {
  params: Promise<{ date: string }>
}

export default async function DayPage({ params }: DayPageProps) {
  const { date } = await params
  const { data: trades } = await getTradesForDate(date)
  const safeTrades = trades ?? []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <DayNav date={date} />
      </div>

      <DaySummary trades={safeTrades} date={date} />

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Trades</h3>
        <DayPageClient date={date} />
      </div>

      <TradeList trades={safeTrades} />
    </div>
  )
}
