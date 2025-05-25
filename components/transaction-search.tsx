'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { isAddress } from 'viem'
import { Search } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Hex } from 'viem'

interface TransactionSearchProps {
  isLoading?: boolean
  defaultAddress?: Hex
  onSearch?: (address: Hex) => void
}

export default function TransactionSearch({
  isLoading = false,
  defaultAddress = '' as Hex,
  onSearch,
}: TransactionSearchProps) {
  const [address, setAddress] = useState(defaultAddress)
  const router = useRouter()
  const pathname = usePathname()

  const handleSearch = () => {
    if (!address.trim()) {
      toast.error('Please enter a wallet address!')
      return
    }

    if (!isAddress(address)) {
      toast.error('Invalid address!')
      return
    }

    if (pathname === `/${address}` && onSearch) {
      onSearch(address)
      return
    }

    router.push(`/${address}`)
  }

  return (
    <div className="flex gap-2">
      <Input
        type="text"
        placeholder="Enter wallet address (0x...)"
        value={address}
        onChange={(e) => setAddress(e.target.value as Hex)}
        className="flex-1"
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <Button onClick={handleSearch} disabled={isLoading}>
        <Search className="h-4 w-4" />
      </Button>
    </div>
  )
}
