import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import type { Hex } from 'viem'
import type { TransactionInfo, TokenInfo } from '@/types'

export function useTransaction(address: Hex, startblock = 0, endblock = 99999999) {
  return useQuery<{
    transactions: TransactionInfo[]
    tokens: TokenInfo[]
  }>({
    queryKey: ['transactions', address, startblock, endblock],
    queryFn: async () => {
      if (startblock === 0) return { transactions: [], tokens: [] }
      const response = await axios.get<{ transactions: TransactionInfo[]; tokens: TokenInfo[] }>('/api/transactions', {
        params: { address, startblock, endblock },
      })
      return response.data
    },
    enabled: !!address && !isNaN(startblock) && !isNaN(endblock),
  })
}
