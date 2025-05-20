'use client'

import { motion } from 'motion/react'
import { TransactionSearch } from '@/components/transaction-search'
import { getDynamicTimeRange } from '@/lib/utils'
import type { Hex } from 'viem'

interface DashboardLayoutProps {
  children?: React.ReactNode
  isLoading?: boolean
  defaultAddress?: Hex
  onSearch?: (address: Hex) => void
}

export default function DashboardLayout({
  children,
  isLoading = false,
  defaultAddress = '' as Hex,
  onSearch,
}: DashboardLayoutProps) {
  const [startTime, endTime] = getDynamicTimeRange()

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-8"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Binance Alpha Trading Statistics</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {startTime} ~ {endTime}
          </p>
        </div>

        <div className="w-full max-w-5xl">
          <TransactionSearch isLoading={isLoading} defaultAddress={defaultAddress} onSearch={onSearch} />
        </div>

        {children}
      </motion.div>
    </div>
  )
}
