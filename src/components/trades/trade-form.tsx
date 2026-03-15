'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { tradeSchema, type TradeFormValues } from '@/lib/validators/trade'
import { ASSET_CLASSES } from '@/lib/constants/asset-classes'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TradeFormProps {
  defaultValues?: Partial<TradeFormValues>
  onSubmit: (data: TradeFormValues) => Promise<void>
  defaultDate?: string
}

export function TradeForm({ defaultValues, onSubmit, defaultDate }: TradeFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TradeFormValues>({
    resolver: zodResolver(tradeSchema),
    defaultValues: {
      trade_date: defaultDate ?? defaultValues?.trade_date ?? new Date().toISOString().split('T')[0],
      asset_class: defaultValues?.asset_class ?? 'stocks',
      symbol: defaultValues?.symbol ?? '',
      side: defaultValues?.side ?? 'long',
      quantity: defaultValues?.quantity,
      entry_price: defaultValues?.entry_price,
      exit_price: defaultValues?.exit_price,
      fees: defaultValues?.fees ?? 0,
      leverage: defaultValues?.leverage ?? 1,
      notes: defaultValues?.notes ?? '',
    },
  })

  const assetClass = watch('asset_class')
  const side = watch('side')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      {/* Row 1: Date + Asset Class */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="trade_date">Date</Label>
          <Input id="trade_date" type="date" {...register('trade_date')} />
          {errors.trade_date && (
            <p className="text-xs text-destructive">{errors.trade_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="asset_class">Asset Class</Label>
          <Select
            value={assetClass}
            onValueChange={(v) => setValue('asset_class', v as TradeFormValues['asset_class'])}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select asset class" />
            </SelectTrigger>
            <SelectContent>
              {ASSET_CLASSES.map((ac) => (
                <SelectItem key={ac.value} value={ac.value}>
                  {ac.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.asset_class && (
            <p className="text-xs text-destructive">{errors.asset_class.message}</p>
          )}
        </div>
      </div>

      {/* Row 2: Symbol + Side */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="symbol">Symbol</Label>
          <Input id="symbol" placeholder="AAPL" {...register('symbol')} />
          {errors.symbol && (
            <p className="text-xs text-destructive">{errors.symbol.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="side">Side</Label>
          <Select
            value={side}
            onValueChange={(v) => setValue('side', v as TradeFormValues['side'])}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select side" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="long">Long</SelectItem>
              <SelectItem value="short">Short</SelectItem>
            </SelectContent>
          </Select>
          {errors.side && (
            <p className="text-xs text-destructive">{errors.side.message}</p>
          )}
        </div>
      </div>

      {/* Row 3: Quantity + Fees */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            step="any"
            placeholder="0"
            {...register('quantity')}
          />
          {errors.quantity && (
            <p className="text-xs text-destructive">{errors.quantity.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fees">Fees</Label>
          <Input
            id="fees"
            type="number"
            step="any"
            placeholder="0.00"
            {...register('fees')}
          />
          {errors.fees && (
            <p className="text-xs text-destructive">{errors.fees.message}</p>
          )}
        </div>
      </div>

      {/* Leverage (forex/futures only) */}
      {(assetClass === 'forex' || assetClass === 'futures') && (
        <div className="space-y-2">
          <Label htmlFor="leverage">Leverage</Label>
          <Input
            id="leverage"
            type="number"
            step="1"
            min="1"
            placeholder="1"
            {...register('leverage')}
          />
          {errors.leverage && (
            <p className="text-xs text-destructive">{errors.leverage.message}</p>
          )}
        </div>
      )}

      {/* Row 4: Entry + Exit Price */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="entry_price">Entry Price</Label>
          <Input
            id="entry_price"
            type="number"
            step="any"
            placeholder="0.00"
            {...register('entry_price')}
          />
          {errors.entry_price && (
            <p className="text-xs text-destructive">{errors.entry_price.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="exit_price">Exit Price</Label>
          <Input
            id="exit_price"
            type="number"
            step="any"
            placeholder="0.00"
            {...register('exit_price')}
          />
          {errors.exit_price && (
            <p className="text-xs text-destructive">{errors.exit_price.message}</p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          rows={3}
          placeholder="Optional trade notes..."
          className="w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50 dark:bg-input/30"
          {...register('notes')}
        />
        {errors.notes && (
          <p className="text-xs text-destructive">{errors.notes.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto sm:ml-auto">
        {isSubmitting && <Loader2 className="animate-spin" />}
        {defaultValues?.symbol ? 'Update Trade' : 'Add Trade'}
      </Button>
    </form>
  )
}
