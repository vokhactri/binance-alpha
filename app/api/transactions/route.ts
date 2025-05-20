import { NextResponse } from 'next/server'
import { getTransactions } from '@/lib/api'
import type { Hex } from 'viem'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address') as Hex
  const startblock = Number(searchParams.get('startblock') || '0')
  const endblock = Number(searchParams.get('endblock') || '99999999')

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 })
  }
  const transactions = await getTransactions(address, startblock, endblock)
  return NextResponse.json(transactions)
}
