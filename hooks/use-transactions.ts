import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import type { Hex } from 'viem'
import type { TransactionInfo } from '@/types'

export const useFetchTransactions = (address: Hex, startblock = 0, endblock = 99999999) => {
  return useQuery<TransactionInfo[]>({
    queryKey: ['transactions', address, startblock, endblock],
    queryFn: async () => {
      if (startblock === 0) return [] as TransactionInfo[]
      const response = await axios.get<TransactionInfo[]>('/api/transactions', {
        params: { address, startblock, endblock },
      })
      return response.data
    },
    enabled: !!address && !isNaN(startblock) && !isNaN(endblock),
  })
}
