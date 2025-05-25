import axios from 'axios'
import pLimit from 'p-limit'
import { isAddressEqual } from 'viem'
import tokens from '@/constants/tokens'
import { getSwapInfo, retry } from './utils'
import type { Hex } from 'viem'
import type { AlphaTokenInfo, Transaction } from '@/types'

const client = axios.create({
  baseURL: 'https://api.etherscan.io',
  params: {
    apikey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
    chainId: 56,
  },
})

export async function getTokenPrice(symbol: string): Promise<number> {
  const res = await axios.get('https://min-api.cryptocompare.com/data/price', {
    params: {
      fsym: symbol,
      tsyms: 'USD',
    },
  })
  return res.data.USD
}

export async function getBlockNumberByTimestamp(timestamp: number) {
  const res = await client.get('/v2/api', {
    params: {
      module: 'block',
      action: 'getblocknobytime',
      timestamp,
      closest: 'before',
    },
  })
  const blockNumber = Number(res.data.result)
  return isNaN(blockNumber) ? 99999999 : blockNumber
}

export async function getAlphaTokens() {
  const res = await axios.get(
    'https://www.binance.com/bapi/defi/v1/public/wallet-direct/buw/wallet/cex/alpha/all/token/list'
  )
  return res.data.data.filter((token: AlphaTokenInfo) => token.chainId === '56')
}

export async function getTransactions(address: Hex, startblock = 0, endblock = 99999999) {
  const res = await client.get('/v2/api', {
    params: {
      module: 'account',
      action: 'txlist',
      address,
      startblock,
      endblock,
      page: 1,
      offset: 10000,
    },
  })

  if (!Array.isArray(res.data.result)) {
    return []
  }

  const transactions: Transaction[] = res.data.result
    .filter(
      (tx: Transaction) =>
        isAddressEqual(tx.from, address) &&
        isAddressEqual(tx.to, '0xb300000b72deaeb607a12d5f54773d1c19c7028d') &&
        tx.isError === '0'
    )
    .sort((a: Transaction, b: Transaction) => {
      return Number(b.timeStamp) - Number(a.timeStamp)
    })

  const limit = pLimit(100)
  const promises = transactions.map((tx) => limit(() => retry(getSwapInfo, 3)(tx)))
  const swapInfos = await Promise.all(promises)

  const fromTokens = Array.from(new Set(swapInfos.map((tx) => tx.fromTokenSymbol)))
  const prices = await Promise.all(fromTokens.map(getTokenPrice))
  const priceMap = Object.fromEntries(fromTokens.map((token, index) => [token, prices[index]]))

  return transactions
    .map((tx, index) => ({
      hash: tx.hash,
      timestamp: Number(tx.timeStamp),
      ...swapInfos[index],
      amountUSD: swapInfos[index].amount * priceMap[swapInfos[index].fromTokenSymbol as keyof typeof priceMap],
    }))
    .filter((tx) => tokens.some((token) => isAddressEqual(token.contractAddress, tx.toTokenAddress)))
}
