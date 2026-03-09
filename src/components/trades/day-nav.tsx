'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DayNavProps {
  date: string // YYYY-MM-DD
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function DayNav({ date }: DayNavProps) {
  const router = useRouter()
  const prev = addDays(date, -1)
  const next = addDays(date, 1)

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/day/${prev}`)}
          aria-label="Previous day"
        >
          <ChevronLeft />
        </Button>

        <h2 className="text-base font-semibold sm:text-lg">
          {formatDisplayDate(date)}
        </h2>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/day/${next}`)}
          aria-label="Next day"
        >
          <ChevronRight />
        </Button>
      </div>

      <Button variant="outline" size="sm" asChild>
        <Link href="/">
          <Calendar /> Calendar
        </Link>
      </Button>
    </div>
  )
}
