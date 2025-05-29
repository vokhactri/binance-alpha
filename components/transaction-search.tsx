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
      toast.error('请输入钱包地址！')
      return
    }

    if (!isAddress(address)) {
      toast.error('钱包地址无效！')
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
        name="wallet-address"
        id="wallet-address-input"
        type="text"
        placeholder="请输入钱包地址 (0x...)"
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
