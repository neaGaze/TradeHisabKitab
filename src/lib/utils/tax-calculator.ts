import { FEDERAL_BRACKETS, STANDARD_DEDUCTION } from '@/lib/constants/tax-brackets'

/** Calculate progressive federal tax on taxable income */
export function calculateFederalTax(taxableIncome: number, filingStatus: string): number {
  const brackets = FEDERAL_BRACKETS[filingStatus] || FEDERAL_BRACKETS.single
  let tax = 0
  for (const bracket of brackets) {
    if (taxableIncome <= bracket.min) break
    const upper = bracket.max ?? Infinity
    const taxable = Math.min(taxableIncome, upper) - bracket.min
    tax += taxable * bracket.rate
  }
  return tax
}

/** Estimate total tax including short-term trading gains (taxed as ordinary income) */
export function estimateTaxWithTradingGains(
  annualIncome: number,
  tradingGains: number,
  filingStatus: string
): {
  taxWithoutTrading: number
  taxWithTrading: number
  additionalTax: number
  effectiveRate: number
  marginalRate: number
} {
  const deduction = STANDARD_DEDUCTION[filingStatus] || STANDARD_DEDUCTION.single
  const taxableWithout = Math.max(0, annualIncome - deduction)
  const taxableWith = Math.max(0, annualIncome + tradingGains - deduction)

  const taxWithout = calculateFederalTax(taxableWithout, filingStatus)
  const taxWith = calculateFederalTax(taxableWith, filingStatus)
  const totalIncome = annualIncome + tradingGains

  return {
    taxWithoutTrading: taxWithout,
    taxWithTrading: taxWith,
    additionalTax: taxWith - taxWithout,
    effectiveRate: totalIncome > 0 ? taxWith / totalIncome : 0,
    marginalRate: getMarginalRate(taxableWith, filingStatus),
  }
}

function getMarginalRate(taxableIncome: number, filingStatus: string): number {
  const brackets = FEDERAL_BRACKETS[filingStatus] || FEDERAL_BRACKETS.single
  for (let i = brackets.length - 1; i >= 0; i--) {
    if (taxableIncome > brackets[i].min) return brackets[i].rate
  }
  return brackets[0].rate
}
