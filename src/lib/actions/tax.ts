'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { TaxSettings } from '@/lib/types/database'

async function getAuthUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  return { supabase, user }
}

export async function getTaxSettings(): Promise<{ data?: TaxSettings | null; error?: string }> {
  try {
    const { supabase, user } = await getAuthUser()
    const { data, error } = await supabase
      .from('tax_settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) return { error: error.message }
    return { data }
  } catch {
    return { error: 'Failed to fetch tax settings' }
  }
}

export async function saveTaxSettings(input: {
  filing_status: string
  state: string
  annual_income: number
}): Promise<{ error?: string }> {
  try {
    const { filing_status, state, annual_income } = input

    if (!filing_status || !state || annual_income == null) {
      return { error: 'All fields are required' }
    }
    if (annual_income < 0) {
      return { error: 'Annual income must be non-negative' }
    }

    const validStatuses = ['single', 'married_filing_jointly', 'married_filing_separately', 'head_of_household']
    if (!validStatuses.includes(filing_status)) {
      return { error: 'Invalid filing status' }
    }

    const { supabase, user } = await getAuthUser()

    // Check if settings exist
    const { data: existing } = await supabase
      .from('tax_settings')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (existing) {
      const { error } = await supabase
        .from('tax_settings')
        .update({ filing_status, state, annual_income })
        .eq('user_id', user.id)
      if (error) return { error: error.message }
    } else {
      const { error } = await supabase
        .from('tax_settings')
        .insert({ user_id: user.id, filing_status, state, annual_income })
      if (error) return { error: error.message }
    }

    revalidatePath('/')
    return {}
  } catch {
    return { error: 'Failed to save tax settings' }
  }
}

export async function getTradingPnlForYear(year: number): Promise<{ data?: number; error?: string }> {
  try {
    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      return { error: 'Invalid year' }
    }

    const { supabase, user } = await getAuthUser()
    const startDate = `${year}-01-01`
    const endDate = `${year + 1}-01-01`

    const { data, error } = await supabase
      .from('trades')
      .select('side, quantity, entry_price, exit_price, fees')
      .eq('user_id', user.id)
      .gte('trade_date', startDate)
      .lt('trade_date', endDate)

    if (error) return { error: error.message }

    const totalPnl = (data || []).reduce((sum, trade) => {
      const multiplier = trade.side === 'long' ? 1 : -1
      const pnl = multiplier * trade.quantity * (trade.exit_price - trade.entry_price) - trade.fees
      return sum + pnl
    }, 0)

    return { data: totalPnl }
  } catch {
    return { error: 'Failed to fetch trading PnL' }
  }
}
