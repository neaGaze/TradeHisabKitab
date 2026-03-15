export type AssetClass = 'stocks' | 'options' | 'futures' | 'forex' | 'crypto'
export type TradeSide = 'long' | 'short'
export type FilingStatus = 'single' | 'married_filing_jointly' | 'married_filing_separately' | 'head_of_household'

export interface Trade {
  id: string
  user_id: string
  trade_date: string
  asset_class: AssetClass
  symbol: string
  side: TradeSide
  quantity: number
  entry_price: number
  exit_price: number
  fees: number
  leverage: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface TaxSettings {
  id: string
  user_id: string
  filing_status: FilingStatus
  state: string
  annual_income: number
  created_at: string
  updated_at: string
}

export interface DailyPnl {
  trade_date: string
  total_pnl: number
  trade_count: number
}

// Insert/Update types (omit auto-generated fields)
export type TradeInsert = Omit<Trade, 'id' | 'created_at' | 'updated_at'>
export type TradeUpdate = Partial<Omit<Trade, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
export type TaxSettingsInsert = Omit<TaxSettings, 'id' | 'created_at' | 'updated_at'>
export type TaxSettingsUpdate = Partial<Omit<TaxSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
