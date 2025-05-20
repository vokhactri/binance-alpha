'use client'

import { use, useEffect } from 'react'
import { motion } from 'motion/react'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import dayjs from '@/lib/dayjs'
import { useBlockNumber } from '@/hooks/use-blocks'
import { useFetchTransactions } from '@/hooks/use-transactions'
import DashboardLayout from '@/components/dashboard-layout'
import { WalletOverview } from '@/components/wallet-overview'
import { TransactionsTable } from '@/components/transactions-table'
import { isAddressEqual, type Hex } from 'viem'

export default function AddressPage({ params }: { params: Promise<{ address: Hex }> }) {
  const { address } = use(params)
  const today = dayjs().startOf('day').add(8, 'hour').unix()
  const { data: blockNumber } = useBlockNumber(today)
  const { data: transactions, isFetching, error, isError, refetch } = useFetchTransactions(address, blockNumber)
  const tradingValue = transactions?.reduce((acc, tx) => acc + tx.amountUSD, 0)

  const handleSearch = (searchAddress: Hex) => {
    if (isAddressEqual(searchAddress, address)) {
      refetch()
    }
  }

  useEffect(() => {
    refetch()
  }, [address, blockNumber, refetch])

  return (
    <DashboardLayout isLoading={isFetching} defaultAddress={address} onSearch={handleSearch}>
      <div className="w-full max-w-5xl">
        <WalletOverview address={address} tradingValue={tradingValue!} isLoading={isFetching} />
      </div>

      <div className="w-full max-w-5xl">
        <TransactionsTable transactions={transactions!} isLoading={isFetching} />
      </div>

      {isError && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to fetch transactions. Please try again later.'}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </DashboardLayout>
  )
}
