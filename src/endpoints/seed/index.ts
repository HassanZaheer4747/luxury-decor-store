import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { contactFormData } from './contact-form'
import { contactPageData } from './contact-page'
import { luxuryProductsData } from './luxury-products'
import { homePageData } from './home'
import { mediaOnyx, mediaVelvet, mediaAero, mediaSofa, mediaHeroText } from './luxury-media'
import { Address, Transaction } from '@/payload-types'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'products',
  'forms',
  'form-submissions',
  'variants',
  'variantOptions',
  'variantTypes',
  'carts',
  'transactions',
  'addresses',
  'orders',
]

const categoriesList = ['Furniture', 'Lighting', 'Decor']
const globals: GlobalSlug[] = ['header', 'footer']

const baseAddressUSData: Transaction['billingAddress'] = {
  title: 'Mr.',
  firstName: 'Bruce',
  lastName: 'Wayne',
  phone: '1234567890',
  company: 'Wayne Enterprises',
  addressLine1: '1007 Mountain Drive',
  city: 'Gotham',
  state: 'NJ',
  postalCode: '10001',
  country: 'US',
}

export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding 3D Luxury Showroom database...')

  // Clear global nav
  await Promise.all(
    globals.map((global) =>
      payload.updateGlobal({
        slug: global,
        data: { navItems: [] },
        depth: 0,
        context: { disableRevalidate: true },
      }),
    ),
  )

  for (const collection of collections) {
    await payload.db.deleteMany({ collection, req, where: {} })
    if (payload.collections[collection].config.versions) {
      await payload.db.deleteVersions({ collection, req, where: {} })
    }
  }

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: { email: { equals: 'customer@example.com' } },
  })

  payload.logger.info(`— Seeding high-end media...`)

  // Use local files we generated
  const fetchLocalFile = (name: string): File => {
    const filePath = path.join(dirname, name)
    const data = fs.readFileSync(filePath)
    return {
      name,
      data: Buffer.from(data),
      mimetype: 'image/png',
      size: data.byteLength,
    }
  }

  const [onyxBuf, velvetBuf, aeroBuf, monolithBuf] = [
    fetchLocalFile('onyx_table.png'),
    fetchLocalFile('velvet_chair.png'),
    fetchLocalFile('aero_lamp.png'),
    fetchLocalFile('monolith_sofa.png'),
  ]

  const [
    customer,
    imageOnyx,
    imageVelvet,
    imageAero,
    imageSofa,
    furnCat,
    lightCat,
    decorCat,
  ] = await Promise.all([
    payload.create({
      collection: 'users',
      data: {
        name: 'Esteemed Guest',
        email: 'customer@example.com',
        password: 'password',
        roles: ['customer'],
      },
    }),
    payload.create({ collection: 'media', data: mediaOnyx, file: onyxBuf }),
    payload.create({ collection: 'media', data: mediaVelvet, file: velvetBuf }),
    payload.create({ collection: 'media', data: mediaAero, file: aeroBuf }),
    payload.create({ collection: 'media', data: mediaSofa, file: monolithBuf }),
    ...categoriesList.map((c) =>
      payload.create({ collection: 'categories', data: { title: c, slug: c.toLowerCase() } }),
    ),
  ])

  payload.logger.info(`— Seeding luxury products...`)

  const prodOnyx = await payload.create({
    collection: 'products',
    depth: 0,
    data: luxuryProductsData.onyxTable({
      galleryImage: imageOnyx,
      metaImage: imageOnyx,
      categories: [furnCat, decorCat],
    }),
  })

  const prodVelvet = await payload.create({
    collection: 'products',
    depth: 0,
    data: luxuryProductsData.velvetChair({
      galleryImage: imageVelvet,
      metaImage: imageVelvet,
      categories: [furnCat],
    }),
  })

  const prodAero = await payload.create({
    collection: 'products',
    depth: 0,
    data: luxuryProductsData.aeroLamp({
      galleryImage: imageAero,
      metaImage: imageAero,
      categories: [lightCat, decorCat],
      relatedProducts: [prodOnyx, prodVelvet],
    }),
  })

  const prodSofa = await payload.create({
    collection: 'products',
    depth: 0,
    data: luxuryProductsData.monolithSofa({
      galleryImage: imageSofa,
      metaImage: imageSofa,
      categories: [furnCat],
      relatedProducts: [prodOnyx, prodAero],
    }),
  })

  payload.logger.info(`— Seeding forms & pages...`)

  const contactForm = await payload.create({ collection: 'forms', depth: 0, data: contactFormData() })

  await Promise.all([
    payload.create({
      collection: 'pages',
      depth: 0,
      data: homePageData({ contentImage: imageOnyx, metaImage: imageOnyx }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: contactPageData({ contactForm }),
    }),
  ])

  payload.logger.info(`— Seeding mock luxury orders...`)

  await payload.create({
    collection: 'addresses',
    depth: 0,
    data: { customer: customer.id, ...(baseAddressUSData as Address) },
  })

  const succeededTransaction = await payload.create({
    collection: 'transactions',
    data: {
      currency: 'USD',
      customer: customer.id,
      paymentMethod: 'stripe',
      stripe: { customerID: 'cus_lx_123', paymentIntentID: 'pi_lx_123' },
      status: 'succeeded',
      billingAddress: baseAddressUSData,
    },
  })

  await payload.create({
    collection: 'orders',
    data: {
      amount: 14300,
      currency: 'USD',
      customer: customer.id,
      shippingAddress: baseAddressUSData,
      items: [
        { product: prodOnyx.id, quantity: 1 },
        { product: prodAero.id, quantity: 1 },
      ],
      status: 'completed',
      transactions: [succeededTransaction.id],
    },
  })

  payload.logger.info(`— Seeding globals...`)

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: [
          { link: { type: 'custom', label: 'Collections', url: '/shop' } },
          { link: { type: 'custom', label: 'Atelier', url: '/atelier' } },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      data: {
        navItems: [{ link: { type: 'custom', label: 'Admin', url: '/admin' } }],
      },
    }),
  ])

  payload.logger.info('Luxury database seeded successfully!')
}
