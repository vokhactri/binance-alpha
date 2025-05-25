'use client'

import { ethAddress, zeroAddress, isAddressEqual } from 'viem'
import { motion, AnimatePresence } from 'motion/react'
import { ExternalLink } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Skeleton } from '@/components/ui/skeleton'
import { formatAddress } from '@/lib/utils'
import dayjs from '@/lib/dayjs'
import type { TransactionInfo } from '@/types'

interface TransactionsTableProps {
  transactions: TransactionInfo[]
  isLoading: boolean
}

const TransactionTableSkeleton = () => (
  <div className="w-full overflow-hidden rounded-lg border">
    <div className="bg-background">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-16">#</TableHead>
            <TableHead>Transaction Hash</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>From Token</TableHead>
            <TableHead>To Token</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="text-right">Value (USD)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-5 w-8" />
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Skeleton className="h-5 w-28" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-36" />
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-16" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-5 w-20 ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
)

export default function TransactionTable({ transactions, isLoading }: TransactionsTableProps) {
  if (isLoading) {
    return <TransactionTableSkeleton />
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border">
      <div className="bg-background">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-16">#</TableHead>
              <TableHead>Transaction Hash</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>From Token</TableHead>
              <TableHead>To Token</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Value (USD)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence>
                {transactions.map((transaction, index) => (
                  <motion.tr
                    key={transaction.hash}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <TableCell className="font-medium">{transactions.length - index}</TableCell>
                    <TableCell className="font-medium">
                      <a
                        href={`https://bscscan.com/tx/${transaction.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center hover:text-primary"
                      >
                        {formatAddress(transaction.hash)}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell>{dayjs.unix(transaction.timestamp).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{transaction.fromTokenSymbol}</span>
                        <span className="text-xs text-muted-foreground">
                          {isAddressEqual(transaction.fromTokenAddress, ethAddress) ||
                          isAddressEqual(transaction.fromTokenAddress, zeroAddress)
                            ? 'Native Token'
                            : formatAddress(transaction.fromTokenAddress)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{transaction.toTokenSymbol}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-xs text-muted-foreground">
                                {formatAddress(transaction.toTokenAddress)}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p className="font-mono text-xs">{transaction.toTokenAddress}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell className="text-right">${transaction.amountUSD.toLocaleString()}</TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
