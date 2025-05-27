import axios from 'axios'
import { apiKeys } from '@/configs'
import { getRandomElementFromArray } from '@/lib/utils'
import type { Hex } from 'viem'
import type { AlphaTokenInfo, TransactionActionMap } from '@/types'

const client = axios.create({
  baseURL: 'https://api.etherscan.io',
  params: {
    // apikey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
    chainId: 56,
  },
})

client.interceptors.request.use(
  (config) => {
    if (config.params) {
      if (config.params.action === 'txlist') {
        config.params.apikey = getRandomElementFromArray(apiKeys.txlist)
      } else if (config.params.action === 'txlistinternal') {
        config.params.apikey = getRandomElementFromArray(apiKeys.txlistinternal)
      } else if (config.params.action === 'tokentx') {
        config.params.apikey = getRandomElementFromArray(apiKeys.tokentx)
      } else {
        config.params.apikey = getRandomElementFromArray(apiKeys.default)
      }
    }
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

export async function getTokenPrice({ symbol, address }: { symbol: string; address?: Hex }): Promise<number> {
  const res = await axios.get('https://min-api.cryptocompare.com/data/price', {
    params: {
      fsym: symbol === 'WBNB' ? 'BNB' : symbol,
      tsyms: 'USD',
    },
  })
  if (res.data.USD !== undefined) return res.data.USD

  const fallbackRes = await axios.post('https://web3.bitget.com/api/home/marketApi/quotev2/coinInfo', {
    chain: 'bnb',
    contract: address,
  })
  return Number(fallbackRes.data.data.price)
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

export async function getTransactions<T extends keyof TransactionActionMap>({
  action,
  address,
  startblock = 0,
  endblock = 99999999,
}: {
  action: T
  address: Hex
  startblock?: number
  endblock?: number
}): Promise<TransactionActionMap[T][]> {
  const res = await client.get<{ result: TransactionActionMap[T][] }>('/v2/api', {
    params: {
      module: 'account',
      action,
      address,
      startblock,
      endblock,
      page: 1,
      offset: 10000,
    },
  })
  return res.data.result
}
