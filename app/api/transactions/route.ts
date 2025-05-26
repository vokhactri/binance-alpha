import { NextResponse } from 'next/server'
import pLimit from 'p-limit'
import { uniqBy } from 'lodash-es'
import { getTokenPrice, getTransactions } from '@/lib/api'
import { isAddressEqual, formatEther, formatUnits, zeroAddress } from 'viem'
import { getSwapInfo, isNativeToken, retry } from '@/lib/utils'
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

  const [rawNormalTransactions = [], rawInternalTransactions = [], rawTokenTransactions = []] = await Promise.all([
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

  if (rawNormalTransactions.length === 0 || rawTokenTransactions.length === 0) {
    return NextResponse.json({
      transactions: [],
      tokens: [],
    })
  }

  const normalTransactions = rawNormalTransactions.filter(
    (tx) => isAddressEqual(tx.from, address) && isAddressEqual(tx.to, BN_DEX_ROUTER_ADDRESS)
  )
  const limit = pLimit(100)
  const promises = normalTransactions.map((tx) => limit(() => retry(getSwapInfo, 3)(tx)))
  const swapInfos = await Promise.all(promises)
  const uniqueTokens = uniqBy(
    [
      { symbol: 'BNB', address: zeroAddress, decimals: 18 },
      ...swapInfos.flatMap((tx) => [
        { symbol: tx.from.symbol, address: tx.from.address, decimals: tx.from.decimals },
        { symbol: tx.to.symbol, address: tx.to.address, decimals: tx.to.decimals },
      ]),
    ],
    (token) => token.address
  )
  const priceMap = await Promise.all(
    uniqueTokens.map(async (token) => {
      const price = await getTokenPrice(token.symbol)
      return {
        ...token,
        price,
      }
    })
  )

  const transactions = normalTransactions
    .map((tx, index) => ({
      hash: tx.hash,
      timestamp: Number(tx.timeStamp),
      gas: Number(formatEther(BigInt(tx.gasUsed) * BigInt(tx.gasPrice))),
      status: tx.isError === '0' ? 'success' : 'failed',
      ...swapInfos[index],
      amountUSD:
        swapInfos[index].amount *
        priceMap.find((token) => isAddressEqual(token.address, swapInfos[index].from.address))!.price,
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
  const internalTransactions = rawInternalTransactions.filter(
    (tx) => isAddressEqual(tx.from, BN_DEX_ROUTER_ADDRESS) && isAddressEqual(tx.to, address)
  )
  const bnbInWei = internalTransactions.reduce((sum, tx) => sum + BigInt(tx.value), 0n)
  const bnbIn = Number(formatEther(bnbInWei))

  const tokens = priceMap.map((p) => {
    if (isNativeToken(p.address)) {
      return {
        address: zeroAddress,
        symbol: 'BNB',
        in: bnbIn,
        out: bnbOut,
        price: p.price,
      }
    }

    const tokenTransactions = rawTokenTransactions.filter((token) => transactions.some((tx) => tx.hash === token.hash))
    const inAmountWei = tokenTransactions
      .filter((token) => isAddressEqual(token.contractAddress, p.address) && isAddressEqual(token.to, address))
      .reduce((sum, token) => sum + BigInt(token.value), 0n)
    const outAmountWei = tokenTransactions
      .filter((token) => isAddressEqual(token.contractAddress, p.address) && isAddressEqual(token.from, address))
      .reduce((sum, token) => sum + BigInt(token.value), 0n)

    return {
      address: p.address,
      symbol: p.symbol,
      in: Number(formatUnits(inAmountWei, p.decimals)),
      out: Number(formatUnits(outAmountWei, p.decimals)),
      price: p.price,
    }
  })

  return NextResponse.json({
    transactions,
    tokens,
  })
}
