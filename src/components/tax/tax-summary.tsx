import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface TaxSummaryProps {
  taxEstimate: {
    taxWithoutTrading: number
    taxWithTrading: number
    additionalTax: number
    effectiveRate: number
    marginalRate: number
  }
  tradingPnl: number
  year: number
}

const fmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

function pct(value: number) {
  return `${(value * 100).toFixed(1)}%`
}

export function TaxSummary({ taxEstimate, tradingPnl, year }: TaxSummaryProps) {
  const pnlColor = tradingPnl >= 0 ? 'text-green-600' : 'text-red-600'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Estimate - {year}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Trading P&L</span>
          <span className={`font-semibold ${pnlColor}`}>
            {fmt.format(tradingPnl)}
          </span>
        </div>

        <hr className="border-border" />

        <div className="space-y-3">
          <Row
            label="Tax without trading"
            value={fmt.format(taxEstimate.taxWithoutTrading)}
          />
          <Row
            label="Tax with trading"
            value={fmt.format(taxEstimate.taxWithTrading)}
          />
        </div>

        <div className="rounded-lg bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Additional tax from trading</span>
            <span className="text-lg font-bold">
              {fmt.format(taxEstimate.additionalTax)}
            </span>
          </div>
        </div>

        <hr className="border-border" />

        <div className="space-y-3">
          <Row
            label="Effective tax rate"
            value={pct(taxEstimate.effectiveRate)}
          />
          <Row
            label="Marginal tax rate"
            value={pct(taxEstimate.marginalRate)}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}
