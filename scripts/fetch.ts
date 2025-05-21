import fsp from 'node:fs/promises'
import c from 'picocolors'
import { getAlphaTokens } from '@/lib/api'

async function run() {
  const tokens = await getAlphaTokens()
  await fsp.writeFile(
    'constants/tokens.ts',
    `const tokens = ${JSON.stringify(tokens, null, 2)} as const\n\nexport default tokens\n`
  )
  console.log(c.green('Tokens fetched successfully!'))
}

run()
