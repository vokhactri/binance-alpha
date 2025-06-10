'use client'

import { useState, useEffect } from 'react'
import { isAddressEqual, isAddress } from 'viem'
import { useRouter, usePathname } from 'next/navigation'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus, Settings, Trash2, GripVertical, Pencil, X, Check, Search, Copy, CheckCheck } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/custom-select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn, formatAddress } from '@/lib/utils'
import { useLocalStorage } from '@/hooks/use-local-storage'
import type { Hex } from 'viem'
import type { Wallet } from '@/types'

function SortableWalletItem({
  wallet,
  editingInlineWallet,
  inlineEditLabel,
  setInlineEditLabel,
  handleSaveInlineEdit,
  handleCancelInlineEdit,
  handleStartInlineEdit,
  handleDeleteWallet,
  copiedAddress,
  copyToClipboard,
}: {
  wallet: Wallet
  editingInlineWallet: string | null
  inlineEditLabel: string
  setInlineEditLabel: (value: string) => void
  handleSaveInlineEdit: (address: string) => void
  handleCancelInlineEdit: () => void
  handleStartInlineEdit: (wallet: Wallet) => void
  handleDeleteWallet: (wallet: Wallet) => void
  copiedAddress: Hex
  copyToClipboard: (address: Hex) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: wallet.address })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isEditing = editingInlineWallet === wallet.address

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 border rounded-lg hover:bg-muted/50 transition-colors"
    >
      <div className="touch-none cursor-grab" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <Input
            value={inlineEditLabel}
            onChange={(e) => setInlineEditLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSaveInlineEdit(wallet.address)
              } else if (e.key === 'Escape') {
                handleCancelInlineEdit()
              }
            }}
            className="h-7 text-sm"
            autoFocus
          />
        ) : (
          <div className="flex flex-col gap-1">
            <div className="font-medium text-sm truncate max-w-[200px] md:max-w-[300px]">{wallet.label}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <span>{formatAddress(wallet.address)}</span>
              {isAddress(copiedAddress) && isAddressEqual(copiedAddress, wallet.address) ? (
                <CheckCheck className="size-3 cursor-pointer animate-bounce" />
              ) : (
                <Copy
                  className="size-3 cursor-pointer hover:text-accent-foreground"
                  onClick={() => copyToClipboard(wallet.address)}
                />
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-1 shrink-0">
        {isEditing ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSaveInlineEdit(wallet.address)}
              className="h-7 w-7 p-0"
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCancelInlineEdit} className="h-7 w-7 p-0">
              <X className="h-3 w-3" />
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={() => handleStartInlineEdit(wallet)} className="h-7 w-7 p-0">
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteWallet(wallet)}
              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default function WalletSelector() {
  const [isMounted, setIsMounted] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<Hex>('' as Hex)
  const [wallets, setWallets] = useLocalStorage<Wallet[]>('walletList', [])
  const [manageOpen, setManageOpen] = useState(false)
  const [newWalletAddress, setNewWalletAddress] = useState<Hex>('' as Hex)
  const [newWalletLabel, setNewWalletLabel] = useState('')
  const [editingInlineWallet, setEditingInlineWallet] = useState<string | null>(null)
  const [inlineEditLabel, setInlineEditLabel] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectOpen, setSelectOpen] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState<Hex>('' as Hex)
  const router = useRouter()
  const pathname = usePathname()
  const addressFromPath = (pathname?.substring(1) || '') as Hex

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const selectedWalletData = wallets.find((w) => w.address === selectedWallet)

  const filteredWallets = wallets.filter(
    (wallet) =>
      wallet.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (addressFromPath && wallets.some((w) => w.address.toLowerCase() === addressFromPath.toLowerCase())) {
      setSelectedWallet(addressFromPath)
    }
  }, [addressFromPath, wallets])

  const copyToClipboard = (address: Hex) => {
    navigator.clipboard.writeText(address)
    setCopiedAddress(address)
    setTimeout(() => setCopiedAddress('' as Hex), 2000)
  }

  const handleManageOpen = () => {
    setManageOpen(true)
    setSelectOpen(false)
  }

  const handleSelectWallet = (value: Hex) => {
    setSelectedWallet(value)
    setSelectOpen(false)
    setSearchTerm('')
    router.push(`/${value}`)
  }

  const handleAddWallet = () => {
    if (!newWalletAddress.trim()) {
      toast.error('请输入钱包地址！')
      return
    }
    if (!isAddress(newWalletAddress)) {
      toast.error('钱包地址无效！')
      return
    }
    const isDuplicate = wallets.some((wallet) => isAddressEqual(wallet.address, newWalletAddress))
    if (isDuplicate) {
      toast.error('钱包地址已存在！')
      return
    }
    const newWallet: Wallet = {
      address: newWalletAddress,
      label: newWalletLabel.trim() || formatAddress(newWalletAddress),
    }
    setWallets([...wallets, newWallet])
    setNewWalletAddress('' as Hex)
    setNewWalletLabel('')
    toast.success('钱包已添加！')
  }

  const handleDeleteWallet = (walletToDelete: Wallet) => {
    setWallets(wallets.filter((w) => w.address !== walletToDelete.address))
    if (selectedWallet === walletToDelete.address) {
      setSelectedWallet('' as Hex)
    }
    toast.success('钱包已删除！')
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setWallets((items) => {
        const oldIndex = items.findIndex((item) => item.address === active.id)
        const newIndex = items.findIndex((item) => item.address === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleStartInlineEdit = (wallet: Wallet) => {
    setEditingInlineWallet(wallet.address)
    setInlineEditLabel(wallet.label)
  }

  const handleSaveInlineEdit = (walletValue: string) => {
    if (inlineEditLabel.trim()) {
      setWallets(wallets.map((w) => (w.address === walletValue ? { ...w, label: inlineEditLabel.trim() } : w)))
    }
    setEditingInlineWallet(null)
    setInlineEditLabel('')
  }

  const handleCancelInlineEdit = () => {
    setEditingInlineWallet(null)
    setInlineEditLabel('')
  }

  if (!isMounted) {
    return <div className="w-10 md:w-40 h-9 shrink-0 rounded-md border border-input bg-background" />
  }

  return (
    <>
      {wallets.length === 0 ? (
        <Button onClick={handleManageOpen} variant="outline" className="w-10 md:w-auto" aria-label="添加钱包">
          <Plus className="h-4 w-4" />
          <span className="hidden md:inline">添加钱包</span>
        </Button>
      ) : (
        <Select
          value={selectedWallet}
          onValueChange={handleSelectWallet}
          open={selectOpen}
          onOpenChange={(open) => {
            setSelectOpen(open)
            if (!open) {
              setSearchTerm('')
            }
          }}
        >
          <SelectTrigger id="wallet-selector" className="w-10 md:w-40">
            <SelectValue placeholder="选择钱包">
              {selectedWalletData && <span className="truncate">{selectedWalletData.label}</span>}
            </SelectValue>
          </SelectTrigger>

          <SelectContent
            className="max-h-[332px] overflow-auto"
            header={
              <div className="flex items-center px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <input
                  placeholder="搜索钱包..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex h-8 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  onKeyDown={(e) => e.stopPropagation()}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={handleManageOpen}>
                        <Settings className="h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs" side="right">
                      <p className="text-xs">钱包管理</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            }
          >
            {filteredWallets.length === 0 ? (
              <div className="py-4 text-center text-sm text-muted-foreground">未找到钱包</div>
            ) : (
              filteredWallets.map((wallet) => (
                <SelectItem
                  key={wallet.address}
                  value={wallet.address}
                  disabled={wallet.disabled}
                  className={cn(
                    'cursor-pointer',
                    isAddress(selectedWallet) && isAddressEqual(wallet.address, selectedWallet) && 'bg-accent'
                  )}
                >
                  <div className="flex flex-col gap-1 items-start w-full max-w-[300px]">
                    <span className="font-medium text-sm w-full truncate">{wallet.label}</span>
                    <span className="text-xs text-muted-foreground leading-relaxed w-full truncate">
                      {formatAddress(wallet.address)}
                    </span>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      )}

      <Dialog open={manageOpen} onOpenChange={setManageOpen}>
        <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>钱包管理</DialogTitle>
            <DialogDescription className="sr-only">添加、编辑和删除您的钱包</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 flex-1">
            <div className="border rounded-lg p-3 flex flex-col gap-3">
              <h3 className="font-medium text-sm">添加钱包</h3>
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="钱包地址 (0x...)"
                  value={newWalletAddress}
                  onChange={(e) => setNewWalletAddress(e.target.value as Hex)}
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="钱包备注 (可选)"
                    value={newWalletLabel}
                    onChange={(e) => setNewWalletLabel(e.target.value)}
                    className="text-sm flex-1"
                  />
                  <Button onClick={handleAddWallet} size="sm" className="shrink-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 flex-1 overflow-hidden">
              <h3 className="font-medium text-sm">钱包列表 ({wallets.length})</h3>
              <ScrollArea className="pr-2 -mr-2">
                <div className="max-h-[256px] md:max-h-[322px] flex flex-col gap-2">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                  >
                    <SortableContext
                      items={wallets.map((wallet) => wallet.address)}
                      strategy={verticalListSortingStrategy}
                    >
                      {wallets.map((wallet) => (
                        <SortableWalletItem
                          key={wallet.address}
                          wallet={wallet}
                          editingInlineWallet={editingInlineWallet}
                          inlineEditLabel={inlineEditLabel}
                          setInlineEditLabel={setInlineEditLabel}
                          handleSaveInlineEdit={handleSaveInlineEdit}
                          handleCancelInlineEdit={handleCancelInlineEdit}
                          handleStartInlineEdit={handleStartInlineEdit}
                          handleDeleteWallet={handleDeleteWallet}
                          copiedAddress={copiedAddress}
                          copyToClipboard={copyToClipboard}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
              </ScrollArea>
            </div>
          </div>

          <Button variant="outline" onClick={() => setManageOpen(false)} className="w-full">
            完成
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
