import { NextResponse } from 'next/server'
import { getTokenPrice, getTransactions } from '@/lib/api'
import pLimit from 'p-limit'
import { isAddressEqual } from 'viem'
import { getSwapInfo, retry } from '@/lib/utils'
import { BN_DEX_ROUTER_ADDRESS } from '@/constants'
import tokens from '@/constants/tokens'
import type { Hex } from 'viem'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address') as Hex
  const startblock = Number(searchParams.get('startblock') || '0')
  const endblock = Number(searchParams.get('endblock') || '99999999')

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 })
  }
  const normalTransactions = await getTransactions({
    action: 'txlist',
    address,
    startblock,
    endblock,
  })

  if (!Array.isArray(normalTransactions)) {
    return []
  }

  const transactions = normalTransactions
    .filter(
      (tx) => isAddressEqual(tx.from, address) && isAddressEqual(tx.to, BN_DEX_ROUTER_ADDRESS) && tx.isError === '0'
    )
    .sort((a, b) => {
      return Number(b.timeStamp) - Number(a.timeStamp)
    })

  const limit = pLimit(100)
  const promises = transactions.map((tx) => limit(() => retry(getSwapInfo, 3)(tx)))
  const swapInfos = await Promise.all(promises)

  const fromTokens = Array.from(new Set(swapInfos.map((tx) => tx.fromTokenSymbol)))
  const prices = await Promise.all(fromTokens.map(getTokenPrice))
  const priceMap = Object.fromEntries(fromTokens.map((token, index) => [token, prices[index]]))

  const resolvedTransactions = transactions
    .map((tx, index) => ({
      hash: tx.hash,
      timestamp: Number(tx.timeStamp),
      ...swapInfos[index],
      amountUSD: swapInfos[index].amount * priceMap[swapInfos[index].fromTokenSymbol as keyof typeof priceMap],
    }))
    .filter((tx) => tokens.some((token) => isAddressEqual(token.contractAddress, tx.toTokenAddress)))

  return NextResponse.json(resolvedTransactions)
}
