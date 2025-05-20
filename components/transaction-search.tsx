'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { isAddress } from 'viem'
import { motion } from 'motion/react'
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

export function TransactionSearch({ isLoading = false, defaultAddress = '' as Hex, onSearch }: TransactionSearchProps) {
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
    <motion.div
      className="flex w-full gap-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
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
    </motion.div>
  )
}
