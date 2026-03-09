import { getDailyPnlForMonth } from '@/lib/actions/trades'
import { MonthNav } from '@/components/calendar/month-nav'
import { CalendarGrid } from '@/components/calendar/calendar-grid'
import { MonthSummary } from '@/components/calendar/month-summary'

interface DashboardPageProps {
  searchParams: Promise<{ year?: string; month?: string }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams
  const now = new Date()
  const year = params.year ? parseInt(params.year, 10) : now.getFullYear()
  const month = params.month ? parseInt(params.month, 10) : now.getMonth() + 1

  const { data: pnlData } = await getDailyPnlForMonth(year, month)
  const safeData = pnlData ?? []

  return (
    <div className="flex flex-col gap-6">
      <MonthNav year={year} month={month} />
      <CalendarGrid year={year} month={month} pnlData={safeData} />
      <MonthSummary pnlData={safeData} />
    </div>
  )
}
