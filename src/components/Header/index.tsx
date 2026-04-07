import { getCachedGlobal } from '@/utilities/getGlobals'
import { RoshaneHeader } from './index.client'

export async function Header() {
  const header = await getCachedGlobal('header', 1)()
  return <RoshaneHeader header={header} />
}
