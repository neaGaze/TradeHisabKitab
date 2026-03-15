'use client'

import { Pencil, Trash2 } from 'lucide-react'
import type { Trade } from '@/lib/types/database'
import { calculatePnl } from '@/lib/utils/pnl'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'

interface TradeRowProps {
  trade: Trade
  onEdit: (trade: Trade) => void
  onDelete: (id: string) => void
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(n)
}

export function TradeRowItem({ trade, onEdit, onDelete }: TradeRowProps) {
  const pnl = calculatePnl(trade)
  const pnlColor = pnl === null ? 'text-muted-foreground' : pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
  const sideColor = trade.side === 'long' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'

  return (
    <TableRow>
      <TableCell className="font-medium">{trade.symbol}</TableCell>
      <TableCell>
        <Badge variant="secondary" className="capitalize text-xs">
          {trade.asset_class}
        </Badge>
      </TableCell>
      <TableCell className={`capitalize font-medium ${sideColor}`}>
        {trade.side}
      </TableCell>
      <TableCell className="text-right">{trade.quantity}</TableCell>
      <TableCell className="text-right">{formatCurrency(trade.entry_price)}</TableCell>
      <TableCell className="text-right">{formatCurrency(trade.exit_price)}</TableCell>
      <TableCell className={`text-right font-semibold ${pnlColor}`}>
        {pnl === null ? 'Open' : `${pnl >= 0 ? '+' : ''}${formatCurrency(pnl)}`}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onEdit(trade)}
            aria-label={`Edit ${trade.symbol} trade`}
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onDelete(trade.id)}
            aria-label={`Delete ${trade.symbol} trade`}
          >
            <Trash2 className="text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
