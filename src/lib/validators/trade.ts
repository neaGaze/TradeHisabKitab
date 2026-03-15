import { z } from 'zod'

export const tradeSchema = z.object({
  trade_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  asset_class: z.enum(['stocks', 'options', 'futures', 'forex', 'crypto']),
  symbol: z.string().min(1, 'Symbol required').max(20).transform((v) => v.toUpperCase()),
  side: z.enum(['long', 'short']),
  quantity: z.coerce.number().positive('Quantity must be positive'),
  entry_price: z.coerce.number().nonnegative('Entry price must be non-negative'),
  exit_price: z.coerce.number().nonnegative('Exit price must be non-negative'),
  fees: z.coerce.number().nonnegative('Fees must be non-negative').default(0),
  leverage: z.coerce.number().min(1, 'Leverage must be at least 1').default(1),
  notes: z.string().max(500, 'Notes max 500 chars').optional().nullable(),
})

export type TradeFormValues = z.infer<typeof tradeSchema>
