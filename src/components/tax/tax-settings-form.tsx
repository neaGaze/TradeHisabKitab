'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { FilingStatus } from '@/lib/types/database'

interface TaxSettingsFormProps {
  defaultValues?: {
    filing_status: string
    state: string
    annual_income: number
  }
  onSubmit: (data: {
    filing_status: string
    state: string
    annual_income: number
  }) => Promise<void>
}

const FILING_STATUS_OPTIONS: { value: FilingStatus; label: string }[] = [
  { value: 'single', label: 'Single' },
  { value: 'married_filing_jointly', label: 'Married Filing Jointly' },
  { value: 'married_filing_separately', label: 'Married Filing Separately' },
  { value: 'head_of_household', label: 'Head of Household' },
]

export function TaxSettingsForm({
  defaultValues,
  onSubmit,
}: TaxSettingsFormProps) {
  const [loading, setLoading] = useState(false)
  const [filingStatus, setFilingStatus] = useState(
    defaultValues?.filing_status ?? ''
  )
  const [state, setState] = useState(defaultValues?.state ?? '')
  const [annualIncome, setAnnualIncome] = useState(
    defaultValues?.annual_income?.toString() ?? ''
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!filingStatus || !state || !annualIncome) return

    setLoading(true)
    try {
      await onSubmit({
        filing_status: filingStatus,
        state,
        annual_income: parseFloat(annualIncome),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Settings</CardTitle>
        <CardDescription>
          Configure your tax profile for estimation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="filing-status">Filing Status</Label>
            <Select value={filingStatus} onValueChange={setFilingStatus}>
              <SelectTrigger id="filing-status" className="w-full">
                <SelectValue placeholder="Select filing status" />
              </SelectTrigger>
              <SelectContent>
                {FILING_STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="e.g. CA, NY, TX"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="annual-income">Annual Income</Label>
            <Input
              id="annual-income"
              type="number"
              min={0}
              step={1}
              value={annualIncome}
              onChange={(e) => setAnnualIncome(e.target.value)}
              placeholder="e.g. 85000"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
