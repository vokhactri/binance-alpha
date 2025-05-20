import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import type { Hex } from 'viem'
import type { TransactionInfo } from '@/types'

export const useFetchTransactions = (address: Hex, startblock = 49970546, endblock = 99999999) => {
  return useQuery({
    queryKey: ['transactions', address, startblock, endblock],
    queryFn: () =>
      axios.get('/api/transactions', {
        params: { address, startblock, endblock },
      }),
    enabled: !!address && !isNaN(startblock) && !isNaN(endblock),
    select: (response) => response.data as TransactionInfo[],
  })
}
