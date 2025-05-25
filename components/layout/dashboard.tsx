'use client'

import { InfoIcon } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getDynamicTimeRange } from '@/lib/utils'

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const [startTime, endTime] = getDynamicTimeRange()

  return (
    <div className="flex flex-col items-center gap-8 mb-8">
      <Alert className="w-full max-w-5xl bg-yellow-50 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-800">
        <InfoIcon size={10} className="!text-yellow-500" />
        <AlertDescription className="text-yellow-700 dark:text-yellow-300 flex">
          Only count the buy transactions of keyless wallet on BSC chain.
        </AlertDescription>
      </Alert>
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Binance Alpha Trading Statistics</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          {startTime} ~ {endTime}
        </p>
      </div>
      {children}
    </div>
  )
}
