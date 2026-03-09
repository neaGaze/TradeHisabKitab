'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { createTrade } from '@/lib/actions/trades'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { TradeForm } from './trade-form'
import type { TradeFormValues } from '@/lib/validators/trade'

interface DayPageClientProps {
  date: string
}

export function DayPageClient({ date }: DayPageClientProps) {
  const router = useRouter()
  const [addOpen, setAddOpen] = useState(false)

  async function handleCreate(data: TradeFormValues) {
    const result = await createTrade(data)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success('Trade added')
    setAddOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={addOpen} onOpenChange={setAddOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus /> Add Trade
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Trade</DialogTitle>
          <DialogDescription>Enter your trade details below.</DialogDescription>
        </DialogHeader>
        <TradeForm onSubmit={handleCreate} defaultDate={date} />
      </DialogContent>
    </Dialog>
  )
}
