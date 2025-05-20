import axios from 'axios'
import { useQuery, } from '@tanstack/react-query'

export const useBlockNumber = (timestamp: number) => {
  return useQuery({
    queryKey: ['blocks', timestamp],
    queryFn: () =>
      axios.get('/api/blocks', {
        params: { timestamp },
      }),
    enabled: !isNaN(timestamp),
    select: (response) => response.data,
  })
}
