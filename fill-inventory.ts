import * as dotenv from 'dotenv'
dotenv.config()

import { getPayload } from 'payload'
import configPromise from './src/payload.config'

async function run() {
  console.log('Initializing payload...')
  const payload = await getPayload({ config: configPromise })

  console.log('Fetching products...')
  const products = await payload.find({
    collection: 'products',
    limit: 1000,
  })

  console.log(`Found ${products.docs.length} products.`)

  let count = 0
  for (const product of products.docs) {
    await payload.update({
      collection: 'products',
      id: product.id,
      data: {
        inventory: 9999,
      },
    })
    count++
    console.log(`Updated product: ${product.title}`)
  }

  console.log(`Fetching variants...`)
  const variants = await payload.find({
    collection: 'variants',
    limit: 1000,
  })

  let variantCount = 0
  for (const variant of variants.docs) {
    await payload.update({
      collection: 'variants',
      id: variant.id,
      data: {
        inventory: 9999,
      },
    })
    variantCount++
  }
  
  console.log(`Successfully restocked ${count} products and ${variantCount} variants!`)
  process.exit(0)
}

run()
