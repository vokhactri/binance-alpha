import { atomWithStorage } from 'jotai/utils'
import type { Wallet } from '@/types'

export const walletsAtom = atomWithStorage<Wallet[]>('walletList', [])
