'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import type { TradeFormValues } from '@/lib/validators/trade'
import { createTrade } from '@/lib/actions/trades'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { TradeForm } from './trade-form'

interface TradesPageClientProps {
  selectedDate: string
  totalPnl: number
  tradeCount: number
  winCount: number
  lossCount: number
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(n)
}

export function TradesPageClient({
  selectedDate,
  totalPnl,
  tradeCount,
  winCount,
  lossCount,
}: TradesPageClientProps) {
  const router = useRouter()
  const [addOpen, setAddOpen] = useState(false)

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const date = e.target.value
    if (date) router.push(`/trades?date=${date}`)
  }

  async function handleCreate(data: TradeFormValues) {
    const result = await createTrade(data)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success('Trade added')
    setAddOpen(false)
    router.refresh()
  }

  const pnlColor =
    totalPnl > 0
      ? 'text-green-600 dark:text-green-400'
      : totalPnl < 0
        ? 'text-red-600 dark:text-red-400'
        : 'text-muted-foreground'

  return (
    <>
      {/* Header row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trades</h1>
          <p className="text-sm text-muted-foreground">Log and review your trades</p>
        </div>

        <div className="flex items-center gap-3">
          <Input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="w-auto"
            aria-label="Select date"
          />

          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus /> Add Trade
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Trade</DialogTitle>
                <DialogDescription>Enter your trade details below.</DialogDescription>
              </DialogHeader>
              <TradeForm onSubmit={handleCreate} defaultDate={selectedDate} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Daily summary */}
      {tradeCount > 0 && (
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
              <p className="text-xl font-bold">{tradeCount}</p>
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
      )}
    </>
  )
}
