import { Card, CardContent } from '@/components/ui/card'
import { calculatePnl } from '@/lib/utils/pnl'
import type { Trade } from '@/lib/types/database'

interface DaySummaryProps {
  trades: Trade[]
  date: string
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(n)
}

export function DaySummary({ trades, date }: DaySummaryProps) {
  if (trades.length === 0) return null

  const pnls = trades.map(calculatePnl).filter((p): p is number => p !== null)
  const totalPnl = pnls.reduce((s, p) => s + p, 0)
  const winCount = pnls.filter((p) => p > 0).length
  const lossCount = pnls.filter((p) => p < 0).length

  const pnlColor =
    totalPnl > 0
      ? 'text-green-600 dark:text-green-400'
      : totalPnl < 0
        ? 'text-red-600 dark:text-red-400'
        : 'text-muted-foreground'

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center gap-6 py-4">
        <div>
          <p className="text-xs text-muted-foreground">Daily P&L</p>
          <p className={`text-xl font-bold ${pnlColor}`}>
            {totalPnl >= 0 ? '+' : ''}{formatCurrency(totalPnl)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Trades</p>
          <p className="text-xl font-bold">{trades.length}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Win / Loss</p>
          <p className="text-xl font-bold">
            <span className="text-green-600 dark:text-green-400">{winCount}</span>
            {' / '}
            <span className="text-red-600 dark:text-red-400">{lossCount}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
