import { getTaxSettings, getTradingPnlForYear } from '@/lib/actions/tax'
import { estimateTaxWithTradingGains } from '@/lib/utils/tax-calculator'
import { TaxPageClient } from '@/components/tax/tax-page-client'

export default async function TaxPage() {
  const year = new Date().getFullYear()

  const [settingsResult, pnlResult] = await Promise.all([
    getTaxSettings(),
    getTradingPnlForYear(year),
  ])

  const settings = settingsResult.data
  const tradingPnl = pnlResult.data ?? 0

  let taxEstimate = null
  if (settings) {
    taxEstimate = estimateTaxWithTradingGains(
      settings.annual_income,
      tradingPnl,
      settings.filing_status
    )
  }

  const defaultValues = settings
    ? {
        filing_status: settings.filing_status,
        state: settings.state,
        annual_income: settings.annual_income,
      }
    : undefined

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tax Estimation</h1>

      <TaxPageClient
        defaultValues={defaultValues}
        taxEstimate={taxEstimate}
        tradingPnl={tradingPnl}
        year={year}
      />
    </div>
  )
}
