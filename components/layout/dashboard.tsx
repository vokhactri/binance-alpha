'use client'

import { getDynamicTimeRange } from '@/lib/utils'
import Alert from './alert'

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const [startTime, endTime] = getDynamicTimeRange()

  return (
    <div className="flex flex-col items-center gap-8 mb-8">
      <Alert>
        <div>
          目前 Alpha 代币互刷已不计入积分计算！
          <a href="https://x.com/binance/status/1934293977668194694" target="_blank" rel="noreferrer noopener" className="underline">
            查看公告
          </a>
        </div>
      </Alert>
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">币安 Alpha 交易统计</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          {startTime.format('YYYY-MM-DD HH:mm:ss')}
          {' '}
          ~
          {endTime.format('YYYY-MM-DD HH:mm:ss')}
        </p>
      </div>
      {children}
    </div>
  )
}
