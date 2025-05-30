'use client'

import Alert from './alert'
import { getDynamicTimeRange } from '@/lib/utils'

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const [startTime, endTime] = getDynamicTimeRange()

  return (
    <div className="flex flex-col items-center gap-8 mb-8">
      <Alert>BscScan 正在维护中，区块数据可能有延迟！</Alert>
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">币安 Alpha 交易统计</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          {startTime} ~ {endTime}
        </p>
      </div>
      {children}
    </div>
  )
}
