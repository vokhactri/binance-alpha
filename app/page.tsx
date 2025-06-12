import TransactionSearch from '@/components/transaction-search'
import WalletSelector from '@/components/wallet-selector'

export default function Home() {
  return (
    <div className="w-full max-w-5xl flex items-center gap-2">
      <WalletSelector />
      <TransactionSearch />
    </div>
  )
}
