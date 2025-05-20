import type { Hex } from 'viem'

export type Transaction = {
  hash: Hex
  tokenSymbol: string
  tokenAmount: string
  valueUSD: string
  timestamp: number
  blockNumber: string
  blockHash: Hex
  timeStamp: string
  nonce: string
  transactionIndex: string
  from: Hex
  to: Hex
  value: string
  gas: string
  gasPrice: string
  input: Hex
  methodId: string
  functionName: string
  contractAddress: Hex
  cumulativeGasUsed: string
  txreceipt_status: string
  gasUsed: string
  confirmations: string
  isError: string
}

export type TransactionInfo = {
  hash: Hex
  timestamp: number
  fromTokenAddress: Hex
  toTokenAddress: Hex
  fromTokenSymbol: string
  toTokenSymbol: string
  amount: number
  amountUSD: number
}

export type AlphaTokenInfo = {
  tokenId: string
  chainId: string
  chainIconUrl: string
  chainName: string
  contractAddress: Hex
  name: string
  symbol: string
  iconUrl: string
  price: string
  percentChange24h: string
  volume24h: string
  marketCap: string
  fdv: string
  liquidity: string
  totalSupply: string
  circulatingSupply: string
  holders: string
  decimals: number
  listingCex: boolean
  hotTag: boolean
  cexCoinName: string
  canTransfer: boolean
  denomination: number
  offline: boolean
  tradeDecimal: number
  alphaId: string
  offsell: boolean
  priceHigh24h: string
  priceLow24h: string
  onlineTge: boolean
  onlineAirdrop: boolean
}
