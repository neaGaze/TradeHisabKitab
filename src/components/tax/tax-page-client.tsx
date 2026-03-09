'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { TaxSettingsForm } from '@/components/tax/tax-settings-form'
import { TaxSummary } from '@/components/tax/tax-summary'
import { saveTaxSettings } from '@/lib/actions/tax'

interface TaxEstimate {
  taxWithoutTrading: number
  taxWithTrading: number
  additionalTax: number
  effectiveRate: number
  marginalRate: number
}

interface TaxPageClientProps {
  defaultValues?: {
    filing_status: string
    state: string
    annual_income: number
  }
  taxEstimate?: TaxEstimate | null
  tradingPnl?: number
  year: number
}

export function TaxPageClient({
  defaultValues,
  taxEstimate,
  tradingPnl,
  year,
}: TaxPageClientProps) {
  const router = useRouter()

  async function handleSubmit(data: {
    filing_status: string
    state: string
    annual_income: number
  }) {
    const result = await saveTaxSettings(data)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success('Tax settings saved')
    router.refresh()
  }

  const hasEstimate = taxEstimate && tradingPnl !== undefined

  return (
    <div className="space-y-6">
      {!defaultValues && (
        <p className="text-sm text-muted-foreground">
          Set up your tax profile to see estimated tax impact from trading.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <TaxSettingsForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
        />

        {hasEstimate ? (
          <TaxSummary
            taxEstimate={taxEstimate}
            tradingPnl={tradingPnl}
            year={year}
          />
        ) : (
          !defaultValues ? null : (
            <div className="flex items-center justify-center rounded-xl border p-8 text-sm text-muted-foreground">
              No trading data for {year}
            </div>
          )
        )}
      </div>
    </div>
  )
}
