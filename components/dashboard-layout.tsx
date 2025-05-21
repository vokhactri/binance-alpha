'use client'

import { motion } from 'motion/react'
import { InfoIcon, HeartIcon } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
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

        <div className="w-full max-w-5xl">
          <TransactionSearch isLoading={isLoading} defaultAddress={defaultAddress} onSearch={onSearch} />
        </div>

        {children}

        <footer className="w-full flex justify-center">
          <div className="flex items-center justify-center text-sm text-muted-foreground/80 gap-1">
            <HeartIcon size={12} className="text-rose-500" />
            <span>
              Made with love by{' '}
              <a
                href="https://github.com/holazz"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-primary transition-colors"
              >
                holazz
              </a>
            </span>
          </div>
        </footer>
      </motion.div>
    </div>
  )
}
