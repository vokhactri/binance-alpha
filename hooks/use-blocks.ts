import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useLocalStorage } from '@/hooks/use-local-storage'

interface BlockCache {
  timestamp: number
  blockNumber: number
}

export const useBlockNumber = (timestamp: number) => {
  const [blockCache, setBlockCache] = useLocalStorage<BlockCache | null>('blockCache', null)
  return useQuery({
    queryKey: ['blocks', timestamp],
    queryFn: async () => {
      if (blockCache?.timestamp === timestamp) {
        return {
          data: blockCache.blockNumber,
        }
      }
      const response = await axios.get('/api/blocks', {
        params: { timestamp },
      })
      setBlockCache({
        timestamp,
        blockNumber: response.data,
      })
      return response
    },
    enabled: !isNaN(timestamp),
    select: (response) => response.data,
  })
}
