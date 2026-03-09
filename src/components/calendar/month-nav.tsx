'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getNextMonth, getPrevMonth } from '@/lib/utils/calendar'

interface MonthNavProps {
  year: number
  month: number
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function MonthNav({ year, month }: MonthNavProps) {
  const router = useRouter()

  function navigate(y: number, m: number) {
    router.push(`/?year=${y}&month=${m}`)
  }

  const prev = getPrevMonth(year, month)
  const next = getNextMonth(year, month)

  return (
    <div className="flex items-center justify-between">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(prev.year, prev.month)}
        aria-label="Previous month"
      >
        <ChevronLeft />
      </Button>

      <h2 className="text-lg font-semibold sm:text-xl">
        {MONTH_NAMES[month - 1]} {year}
      </h2>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(next.year, next.month)}
        aria-label="Next month"
      >
        <ChevronRight />
      </Button>
    </div>
  )
}
