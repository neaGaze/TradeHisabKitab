'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { tradeSchema, TradeFormValues } from '@/lib/validators/trade'

async function getAuthUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  return { supabase, user }
}

export async function createTrade(data: TradeFormValues) {
  try {
    const parsed = tradeSchema.safeParse(data)
    if (!parsed.success) return { error: parsed.error.errors[0].message }

    const { supabase, user } = await getAuthUser()
    const { error } = await supabase
      .from('trades')
      .insert({ ...parsed.data, user_id: user.id })

    if (error) return { error: error.message }
    revalidatePath('/')
    return {}
  } catch {
    return { error: 'Failed to create trade' }
  }
}

export async function updateTrade(id: string, data: TradeFormValues) {
  try {
    const parsed = tradeSchema.safeParse(data)
    if (!parsed.success) return { error: parsed.error.errors[0].message }

    const { supabase, user } = await getAuthUser()
    const { error, count } = await supabase
      .from('trades')
      .update(parsed.data, { count: 'exact' })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) return { error: error.message }
    if (count === 0) return { error: 'Trade not found' }
    revalidatePath('/')
    return {}
  } catch {
    return { error: 'Failed to update trade' }
  }
}

export async function deleteTrade(id: string) {
  try {
    const { supabase, user } = await getAuthUser()
    const { error, count } = await supabase
      .from('trades')
      .delete({ count: 'exact' })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) return { error: error.message }
    if (count === 0) return { error: 'Trade not found' }
    revalidatePath('/')
    return {}
  } catch {
    return { error: 'Failed to delete trade' }
  }
}

export async function getTradesForDate(date: string) {
  try {
    const { supabase, user } = await getAuthUser()
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', user.id)
      .eq('trade_date', date)
      .order('created_at', { ascending: false })

    if (error) return { error: error.message }
    return { data }
  } catch {
    return { error: 'Failed to fetch trades' }
  }
}

export async function getTradesForMonth(year: number, month: number) {
  try {
    const { supabase, user } = await getAuthUser()
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`
    const endDate =
      month === 12
        ? `${year + 1}-01-01`
        : `${year}-${String(month + 1).padStart(2, '0')}-01`

    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', user.id)
      .gte('trade_date', startDate)
      .lt('trade_date', endDate)
      .order('trade_date', { ascending: true })

    if (error) return { error: error.message }
    return { data }
  } catch {
    return { error: 'Failed to fetch trades' }
  }
}

export async function getDailyPnlForMonth(year: number, month: number) {
  try {
    const { supabase, user } = await getAuthUser()
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`
    const endDate =
      month === 12
        ? `${year + 1}-01-01`
        : `${year}-${String(month + 1).padStart(2, '0')}-01`

    const { data, error } = await supabase.rpc('get_daily_pnl', {
      p_user_id: user.id,
      p_start_date: startDate,
      p_end_date: endDate,
    })

    if (error) return { error: error.message }
    return { data }
  } catch {
    return { error: 'Failed to fetch daily PnL' }
  }
}
