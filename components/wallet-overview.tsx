'use client'

import { useState } from 'react'
import { Copy, ExternalLink, CheckCheck, Milestone } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatAddress, calculatePoints } from '@/lib/utils'
import type { Hex } from 'viem'

interface WalletOverviewProps {
  address: Hex
  tradingValue: number
  isLoading: boolean
}

const WalletOverviewSkeleton = () => (
  <Card>
    <CardHeader className="pb-2">
      <Skeleton className="h-7 w-40" />
      <Skeleton className="h-5 w-60 mt-1" />
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
        <div className="col-span-2 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-2 w-full" />
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function WalletOverview({ address, tradingValue, isLoading }: WalletOverviewProps) {
  const [copied, setCopied] = useState(false)

  if (isLoading) {
    return <WalletOverviewSkeleton />
  }

  const { points, range } = calculatePoints(tradingValue * 2)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Wallet Overview</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <span>{formatAddress(address)}</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyToClipboard} title="Copy address">
            {copied ? <CheckCheck className="animate-bounce" size={12} /> : <Copy size={12} />}
          </Button>
          <a
            href={`https://bscscan.com/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            title="View on BscScan"
          >
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ExternalLink size={12} />
            </Button>
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Trading Value <Badge className="bg-muted-foreground">2x</Badge>
            </p>
            <p className="text-lg font-medium">${(tradingValue * 2).toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Points</p>
            <p className="text-lg font-medium">{points}</p>
          </div>
          <div className="col-span-2 space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Milestone size={16} />
              <p>Milestone</p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-left">${range[0]}</span>
                <span className="text-xs text-right">
                  ${(tradingValue * 2).toFixed(2)} / ${range[1]}
                </span>
              </div>
              <Progress value={((tradingValue * 2 - range[0]) / (range[1] - range[0])) * 100} className="h-2" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
