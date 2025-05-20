import c from 'picocolors'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import {
  decodeFunctionData,
  getContract,
  createPublicClient,
  http,
  ethAddress,
  zeroAddress,
  isAddressEqual,
  formatUnits,
} from 'viem'
import { bsc } from 'viem/chains'
import {
  ERC20_ABI,
  PROXY_SWAP_ABI,
  PROXY_SWAP_V2_ABI,
  CALL_ONEINCH_ABI,
  SWAP_EXACT_IN_ABI,
  SWAP_ABI,
} from '@/constants/abis'
import tokens from '@/constants/tokens'
import type { Hex } from 'viem'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function getPublicClient() {
  return createPublicClient({
    chain: bsc,
    transport: http('https://bsc.blockrazor.xyz'),
  })
}

export async function getTokenInfo(address: Hex) {
  if (isAddressEqual(address, ethAddress) || isAddressEqual(address, zeroAddress)) {
    return {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    }
  }
  if (isAddressEqual(address, '0x55d398326f99059fF775485246999027B3197955')) {
    return {
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 18,
    }
  }
  if (isAddressEqual(address, '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d')) {
    return {
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 18,
    }
  }
  const token = tokens.find((token) => isAddressEqual(token.contractAddress, address))
  if (token) {
    return {
      symbol: token.symbol,
      decimals: token.decimals,
    }
  }
  const client = getPublicClient()
  const contract = getContract({
    abi: ERC20_ABI,
    address,
    client,
  })
  const [symbol, decimals] = await Promise.all([contract.read.symbol(), contract.read.decimals()])
  return { symbol, decimals }
}

export async function getSwapInfo(data: Hex) {
  let amount: number
  let _fromTokenAddress: Hex
  let _toTokenAddress: Hex
  let _fromTokenSymbol: string
  let _toTokenSymbol: string

  if (data.startsWith('0xdad12b6c') || data.startsWith('0xe5e8894b')) {
    const { args } = decodeFunctionData({
      abi: data.startsWith('0xdad12b6c') ? PROXY_SWAP_ABI : PROXY_SWAP_V2_ABI,
      data,
    })
    const callData = args![args!.length - 1] as Hex
    const { args: swapArgs } = decodeFunctionData({
      abi: SWAP_EXACT_IN_ABI,
      data: callData,
    })
    const { inputToken, outputToken } = swapArgs[1]
    const { symbol: fromTokenSymbol, decimals: fromTokenDecimals } = await getTokenInfo(inputToken)
    const { symbol: toTokenSymbol } = await getTokenInfo(outputToken)
    amount = Number(formatUnits(args![2] as bigint, fromTokenDecimals))
    _fromTokenAddress = inputToken
    _toTokenAddress = outputToken
    _fromTokenSymbol = fromTokenSymbol
    _toTokenSymbol = toTokenSymbol
  } else {
    const { args } = decodeFunctionData({
      abi: CALL_ONEINCH_ABI,
      data,
    })
    const callData = args![args!.length - 1] as Hex
    const { args: swapArgs } = decodeFunctionData({
      abi: SWAP_ABI,
      data: callData,
    })
    const { srcToken, dstToken } = swapArgs[1]
    const { symbol: fromTokenSymbol, decimals: fromTokenDecimals } = await getTokenInfo(srcToken)
    const { symbol: toTokenSymbol } = await getTokenInfo(dstToken)
    amount = Number(formatUnits(args![1] as bigint, fromTokenDecimals))
    _fromTokenAddress = srcToken
    _toTokenAddress = dstToken
    _fromTokenSymbol = fromTokenSymbol
    _toTokenSymbol = toTokenSymbol
  }

  return {
    amount,
    fromTokenAddress: _fromTokenAddress,
    toTokenAddress: _toTokenAddress,
    fromTokenSymbol: _fromTokenSymbol,
    toTokenSymbol: _toTokenSymbol,
  }
}

export function calculatePoints(value: number) {
  if (value < 0) throw new Error('Value must be non-negative')

  if (value < 2) {
    return { value, points: 0, range: [0, 2] }
  }

  const exponent = Math.floor(Math.log2(value))
  const lower = 2 ** exponent
  const upper = 2 ** (exponent + 1)

  return {
    value,
    points: exponent,
    range: [lower, upper],
  }
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function getErrorMessage(error: any) {
  const errorPaths = [
    ['response', 'data', 'message'],
    ['response', 'data', 'error'],
    ['response', 'data'],
    ['response', 'statusText'],
    ['error', 'reason'],
    ['cause'],
    ['reason'],
    ['message'],
  ]

  for (const path of errorPaths) {
    let value = error
    for (const key of path) {
      if (value === null || value === undefined) break
      value = value[key]
    }
    if (value) {
      return typeof value === 'object' ? JSON.stringify(value, Object.getOwnPropertyNames(value)) : String(value)
    }
  }
  return 'error'
}

export function retry<A extends unknown[], T>(fn: (...args: A) => Promise<T>, times = 0, delay = 0) {
  return (...args: A): Promise<T> =>
    new Promise((resolve, reject) => {
      const attempt = async () => {
        try {
          resolve(await fn(...args))
        } catch (err: any) {
          console.log(c.red(`[${fn.name || 'anonymous'}] ${getErrorMessage(err)}`))
          if (times-- <= 0) {
            reject(err)
          } else {
            setTimeout(attempt, delay)
          }
        }
      }
      attempt()
    })
}
