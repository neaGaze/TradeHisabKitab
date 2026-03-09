import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DailyPnl } from '@/lib/types/database'

interface MonthSummaryProps {
  pnlData: DailyPnl[]
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(n)
}

function pnlColor(n: number) {
  if (n > 0) return 'text-green-600 dark:text-green-400'
  if (n < 0) return 'text-red-600 dark:text-red-400'
  return 'text-muted-foreground'
}

export function MonthSummary({ pnlData }: MonthSummaryProps) {
  if (pnlData.length === 0) return null

  const totalPnl = pnlData.reduce((sum, d) => sum + d.total_pnl, 0)
  const tradingDays = pnlData.length
  const winDays = pnlData.filter((d) => d.total_pnl > 0).length
  const lossDays = pnlData.filter((d) => d.total_pnl < 0).length
  const bestDay = pnlData.reduce((best, d) => (d.total_pnl > best.total_pnl ? d : best), pnlData[0])
  const worstDay = pnlData.reduce((worst, d) => (d.total_pnl < worst.total_pnl ? d : worst), pnlData[0])

  const stats = [
    { label: 'Total P&L', value: `${totalPnl >= 0 ? '+' : ''}${formatCurrency(totalPnl)}`, color: pnlColor(totalPnl) },
    { label: 'Trading Days', value: tradingDays, color: '' },
    { label: 'Win Days', value: winDays, color: 'text-green-600 dark:text-green-400' },
    { label: 'Loss Days', value: lossDays, color: 'text-red-600 dark:text-red-400' },
    { label: 'Best Day', value: `${formatCurrency(bestDay.total_pnl)}`, color: pnlColor(bestDay.total_pnl) },
    { label: 'Worst Day', value: `${formatCurrency(worstDay.total_pnl)}`, color: pnlColor(worstDay.total_pnl) },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
