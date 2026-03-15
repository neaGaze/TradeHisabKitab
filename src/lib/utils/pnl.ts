import { Trade } from '@/lib/types/database'

export function isOpenTrade(trade: Trade): boolean {
  return trade.exit_price === 0
}

export function calculatePnl(trade: Trade): number | null {
  if (isOpenTrade(trade)) return null
  const { side, entry_price, exit_price, quantity, fees, leverage } = trade
  const rawPnl =
    side === 'long'
      ? (exit_price - entry_price) * quantity
      : (entry_price - exit_price) * quantity
  return rawPnl * (leverage ?? 1) - fees
}
