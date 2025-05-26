import { NextResponse } from 'next/server'
import { getTokenPrice, getTransactions } from '@/lib/api'
import pLimit from 'p-limit'
import { isAddressEqual, formatEther, formatUnits, zeroAddress } from 'viem'
import { getSwapInfo, retry } from '@/lib/utils'
import { BN_DEX_ROUTER_ADDRESS } from '@/constants'
import alphaTokens from '@/constants/tokens'
import type { Hex } from 'viem'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address') as Hex
  const startblock = Number(searchParams.get('startblock') || '0')
  const endblock = Number(searchParams.get('endblock') || '99999999')

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 })
  }

  const [normalTransactions, internalTransactions, tokenTransactions] = await Promise.all([
    getTransactions({
      action: 'txlist',
      address,
      startblock,
      endblock,
    }),
    getTransactions({
      action: 'txlistinternal',
      address,
      startblock,
      endblock,
    }),
    getTransactions({
      action: 'tokentx',
      address,
      startblock,
      endblock,
    }),
  ])

  if (!Array.isArray(normalTransactions)) {
    return NextResponse.json({
      transactions: [],
      tokens: [],
    })
  }

  const rawTransactions = normalTransactions.filter(
    (tx) => isAddressEqual(tx.from, address) && isAddressEqual(tx.to, BN_DEX_ROUTER_ADDRESS)
  )
  const limit = pLimit(100)
  const promises = rawTransactions.map((tx) => limit(() => retry(getSwapInfo, 3)(tx)))
  const swapInfos = await Promise.all(promises)

  const uniqueTokens = [
    ...new Set(['BNB', ...swapInfos.map((tx) => tx.from.symbol), ...swapInfos.map((tx) => tx.to.symbol)]),
  ]
  const prices = await Promise.all(uniqueTokens.map(getTokenPrice))
  const priceMap = Object.fromEntries(uniqueTokens.map((token, index) => [token, prices[index]]))

  const transactions = rawTransactions
    .map((tx, index) => ({
      hash: tx.hash,
      timestamp: Number(tx.timeStamp),
      gas: Number(formatEther(BigInt(tx.gasUsed) * BigInt(tx.gasPrice))),
      status: tx.isError === '0' ? 'success' : 'failed',
      ...swapInfos[index],
      amountUSD: swapInfos[index].amount * priceMap[swapInfos[index].from.symbol as keyof typeof priceMap],
    }))
    .filter((tx) =>
      alphaTokens.some(
        (token) =>
          isAddressEqual(token.contractAddress, tx.from.address) || isAddressEqual(token.contractAddress, tx.to.address)
      )
    )
    .sort((a, b) => b.timestamp - a.timestamp)

  const totalGas = transactions.reduce((sum, tx) => sum + tx.gas, 0)
  const bnbOut =
    transactions
      .filter((tx) => tx.from.symbol === 'BNB' && tx.status === 'success')
      .reduce((sum, tx) => sum + tx.amount, 0) + totalGas
  const rawInternalTransactions = internalTransactions.filter(
    (tx) => isAddressEqual(tx.from, BN_DEX_ROUTER_ADDRESS) && isAddressEqual(tx.to, address)
  )
  const bnbInWei = rawInternalTransactions.reduce((sum, tx) => sum + BigInt(tx.value), 0n)
  const bnbIn = Number(formatEther(bnbInWei))

  const tokens = Object.keys(priceMap).map((symbol) => {
    if (symbol === 'BNB') {
      return {
        address: zeroAddress,
        symbol: 'BNB',
        in: bnbIn,
        out: bnbOut,
        price: priceMap[symbol],
      }
    }
    const selectedToken = tokenTransactions.find(
      (token) => (token.tokenSymbol === 'BSC-USD' && symbol === 'USDT') || token.tokenSymbol === symbol
    )!
    const inAmountWei = tokenTransactions
      .filter(
        (token) =>
          ((token.tokenSymbol === 'BSC-USD' && symbol === 'USDT') || token.tokenSymbol === symbol) &&
          isAddressEqual(token.to, address)
      )
      .reduce((sum, token) => sum + BigInt(token.value), 0n)
    const outAmountWei = tokenTransactions
      .filter(
        (token) =>
          ((token.tokenSymbol === 'BSC-USD' && symbol === 'USDT') || token.tokenSymbol === symbol) &&
          isAddressEqual(token.from, address)
      )
      .reduce((sum, token) => sum + BigInt(token.value), 0n)

    return {
      address: selectedToken.contractAddress,
      symbol,
      in: Number(formatUnits(inAmountWei, Number(selectedToken.tokenDecimal))),
      out: Number(formatUnits(outAmountWei, Number(selectedToken.tokenDecimal))),
      price: priceMap[symbol as keyof typeof priceMap],
    }
  })

  return NextResponse.json({
    transactions,
    tokens,
  })
}
