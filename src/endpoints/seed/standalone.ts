import { createLocalReq, getPayload } from 'payload'
import config from '../../payload.config'
import { seed } from './index'
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Configuration is loaded automatically via 'dotenv/config' import above


async function runSeed() {
  console.log('Fetching Payload Config using DATABASE_URI: ', process.env.DATABASE_URL)
  const payload = await getPayload({ config })
  const req = await createLocalReq({}, payload)
  
  await seed({ payload, req })
  process.exit(0)
}

runSeed().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
