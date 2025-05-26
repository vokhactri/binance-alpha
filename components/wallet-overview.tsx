'use client'

import { useState } from 'react'
import { isAddressEqual } from 'viem'
import { Copy, ExternalLink, CheckCheck, Milestone } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatAddress, calculatePoints, cn } from '@/lib/utils'
import alphaTokens from '@/constants/tokens'
import type { Hex } from 'viem'
import type { TransactionInfo, TokenInfo } from '@/types'

interface WalletOverviewProps {
  data: {
    address: Hex
    transactions: TransactionInfo[]
    tokens: TokenInfo[]
  }
  isLoading: boolean
}

const WalletOverviewSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-7 w-40" />
      <Skeleton className="h-[25px] w-60" />
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-7 w-24" />
        </div>
        <div className="flex flex-col gap-1">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-7 w-24" />
        </div>
        <div className="flex flex-col items-end md:items-start gap-1">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-7 w-24" />
        </div>
        <div className="col-span-3 md:col-span-2 flex flex-col gap-1">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-2 w-full" />
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function WalletOverview({ data, isLoading }: WalletOverviewProps) {
  const { address, transactions, tokens } = data
  const [copied, setCopied] = useState(false)

  if (isLoading) {
    return <WalletOverviewSkeleton />
  }

  const tradingValue = transactions
    ?.filter(
      (tx) =>
        tx.status === 'success' && alphaTokens.some((token) => isAddressEqual(token.contractAddress, tx.to.address))
    )
    .reduce((acc, tx) => acc + tx.amountUSD, 0)

  const { points, range } = calculatePoints(tradingValue)

  const pnl = tokens.reduce((acc, token) => {
    const netFlow = token.in - token.out
    if (netFlow === 0) return acc
    const profit = netFlow * token.price
    return acc + profit
  }, 0)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">钱包</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <span>{formatAddress(address)}</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyToClipboard} title="复制地址">
            {copied ? <CheckCheck className="animate-bounce" size={12} /> : <Copy size={12} />}
          </Button>
          <a
            href={`https://bscscan.com/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            title="在区块浏览器中查看"
          >
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ExternalLink size={12} />
            </Button>
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 md:grid-cols-5 gap-4">
          <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
            <p className="text-sm text-muted-foreground">交易额</p>
            <p className="text-lg font-medium">${tradingValue.toFixed(2)}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              积分
              {points > 0 && <Badge className="h-5 bg-muted-foreground rounded-full">+1</Badge>}
            </p>
            <p className="text-lg font-medium">{points === 0 ? 0 : points + 1}</p>
          </div>
          <div className="flex flex-col items-end md:items-start gap-1">
            <p className="text-sm text-muted-foreground">利润</p>
            <p className={cn('text-lg font-medium', pnl > 0 ? 'text-green-600' : pnl < 0 ? 'text-red-600' : '')}>
              ${pnl.toFixed(2)}
            </p>
          </div>
          <div className="col-span-4 md:col-span-2 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Milestone size={16} />
              <p>里程</p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-left">${range[0]}</span>
                <span className="text-xs text-right">
                  ${tradingValue.toFixed(2)} / ${range[1]}
                </span>
              </div>
              <Progress value={((tradingValue - range[0]) / (range[1] - range[0])) * 100} className="h-2" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
