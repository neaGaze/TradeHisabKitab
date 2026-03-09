import { format } from 'date-fns'
import { getTradesForDate } from '@/lib/actions/trades'
import { calculatePnl } from '@/lib/utils/pnl'
import type { Trade } from '@/lib/types/database'
import { TradeList } from '@/components/trades/trade-list'
import { TradesPageClient } from '@/components/trades/trades-page-client'

interface TradesPageProps {
  searchParams: Promise<{ date?: string }>
}

export default async function TradesPage({ searchParams }: TradesPageProps) {
  const params = await searchParams
  const today = format(new Date(), 'yyyy-MM-dd')
  const selectedDate = params.date ?? today

  const result = await getTradesForDate(selectedDate)
  const trades: Trade[] = result.data ?? []

  const totalPnl = trades.reduce((sum, t) => sum + calculatePnl(t), 0)
  const winCount = trades.filter((t) => calculatePnl(t) > 0).length
  const lossCount = trades.filter((t) => calculatePnl(t) < 0).length

  return (
    <div className="space-y-6">
      <TradesPageClient
        selectedDate={selectedDate}
        totalPnl={totalPnl}
        tradeCount={trades.length}
        winCount={winCount}
        lossCount={lossCount}
      />

      <TradeList trades={trades} />
    </div>
  )
}
