'use client'

import { getDynamicTimeRange } from '@/lib/utils'

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const [startTime, endTime] = getDynamicTimeRange()

  return (
    <div className="flex flex-col items-center gap-8 mb-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Binance Alpha Trading Statistics</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          {startTime.format('HH:mm:ss DD/MM/YYYY')}
          &nbsp;
          ~
          &nbsp;
          {endTime.format('HH:mm:ss DD/MM/YYYY')}
        </p>
      </div>
      {children}
    </div>
  )
}
