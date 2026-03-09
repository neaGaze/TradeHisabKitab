import { Trade } from '@/lib/types/database'

export function calculatePnl(trade: Trade): number {
  const { side, entry_price, exit_price, quantity, fees } = trade
  const rawPnl =
    side === 'long'
      ? (exit_price - entry_price) * quantity
      : (entry_price - exit_price) * quantity
  return rawPnl - fees
}
