'use client'

import { useState, useTransition } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { calculatePnl } from '@/lib/utils/pnl'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { Trade } from '@/lib/types/database'
import type { TradeFormValues } from '@/lib/validators/trade'
import { updateTrade, deleteTrade } from '@/lib/actions/trades'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TradeRowItem } from './trade-row'
import { TradeForm } from './trade-form'

interface TradeListProps {
  trades: Trade[]
}

export function TradeList({ trades }: TradeListProps) {
  const router = useRouter()
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null)
  const [, startTransition] = useTransition()

  async function handleUpdate(data: TradeFormValues) {
    if (!editingTrade) return
    const result = await updateTrade(editingTrade.id, data)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success('Trade updated')
    setEditingTrade(null)
    startTransition(() => router.refresh())
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this trade?')) return

    const result = await deleteTrade(id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Trade deleted')
      startTransition(() => router.refresh())
    }
  }

  if (trades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-sm">No trades for this date</p>
        <p className="text-xs mt-1">Click &quot;Add Trade&quot; to get started</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Side</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Entry</TableHead>
              <TableHead className="text-right">Exit</TableHead>
              <TableHead className="text-right">P&L</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map((trade) => (
              <TradeRowItem
                key={trade.id}
                trade={trade}
                onEdit={setEditingTrade}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {trades.map((trade) => (
          <MobileTradeCard
            key={trade.id}
            trade={trade}
            onEdit={setEditingTrade}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editingTrade} onOpenChange={(open) => !open && setEditingTrade(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Trade</DialogTitle>
            <DialogDescription>Update trade details below.</DialogDescription>
          </DialogHeader>
          {editingTrade && (
            <TradeForm
              defaultValues={{
                trade_date: editingTrade.trade_date,
                asset_class: editingTrade.asset_class,
                symbol: editingTrade.symbol,
                side: editingTrade.side,
                quantity: editingTrade.quantity,
                entry_price: editingTrade.entry_price,
                exit_price: editingTrade.exit_price,
                fees: editingTrade.fees,
                notes: editingTrade.notes,
              }}
              onSubmit={handleUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

/* ---- Mobile card for small screens ---- */

function MobileTradeCard({
  trade,
  onEdit,
  onDelete,
}: {
  trade: Trade
  onEdit: (trade: Trade) => void
  onDelete: (id: string) => void
}) {
  const pnl = calculatePnl(trade)
  const pnlColor = pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
  const sideColor = trade.side === 'long' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n)

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{trade.symbol}</span>
          <Badge variant="secondary" className="capitalize text-xs">{trade.asset_class}</Badge>
          <span className={`text-xs font-medium capitalize ${sideColor}`}>{trade.side}</span>
        </div>
        <span className={`font-semibold text-sm ${pnlColor}`}>
          {pnl >= 0 ? '+' : ''}{fmt(pnl)}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
        <div>
          <span className="block text-foreground font-medium">{trade.quantity}</span>
          Qty
        </div>
        <div>
          <span className="block text-foreground font-medium">{fmt(trade.entry_price)}</span>
          Entry
        </div>
        <div>
          <span className="block text-foreground font-medium">{fmt(trade.exit_price)}</span>
          Exit
        </div>
      </div>

      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="xs" onClick={() => onEdit(trade)} aria-label={`Edit ${trade.symbol}`}>
          <Pencil /> Edit
        </Button>
        <Button variant="ghost" size="xs" onClick={() => onDelete(trade.id)} aria-label={`Delete ${trade.symbol}`}>
          <Trash2 className="text-destructive" /> Delete
        </Button>
      </div>
    </div>
  )
}
