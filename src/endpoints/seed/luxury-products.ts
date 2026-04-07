import type { Category, Product, VariantType } from '@/payload-types'
import type { Media } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

type ProductArgs = {
  galleryImage: Media
  metaImage: Media
  variantTypes?: VariantType[]
  categories: Category[]
  relatedProducts?: Product[]
}

export const luxuryProductsData = {
  onyxTable: ({
    galleryImage,
    metaImage,
    categories,
    relatedProducts = [],
  }: ProductArgs): RequiredDataFromCollectionSlug<'products'> => ({
    meta: {
      title: 'Onyx Monolith Coffee Table | Roshane',
      image: metaImage,
      description: 'A striking minimalist black marble coffee table forged from single slab Onyx.',
    },
    _status: 'published',
    layout: [],
    categories,
    description: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'A stunning statement piece for modern living spaces. Forged from a single slab of deep black Onyx marble, the Monolith Coffee Table anchors your aesthetic with unapologetic brutalism and architectural elegance.',
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
            textFormat: 0,
            textStyle: '',
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    },
    gallery: [{ image: galleryImage }],
    title: 'Onyx Monolith Table',
    slug: 'onyx-monolith-table',
    priceInUSDEnabled: true,
    priceInUSD: 12500,
    relatedProducts,
  }),

  velvetChair: ({
    galleryImage,
    metaImage,
    categories,
    relatedProducts = [],
  }: ProductArgs): RequiredDataFromCollectionSlug<'products'> => ({
    meta: {
      title: 'Velvet Lounge Chair | Roshane',
      image: metaImage,
      description: 'A high-end modern dark velvet accent lounge chair.',
    },
    _status: 'published',
    layout: [],
    categories,
    description: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Embrace absolute luxury. Wrapped in midnight velvet, this accent chair combines ergonomic contouring with bold structural lines to create an unparalleled seating experience.',
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
            textFormat: 0,
            textStyle: '',
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    },
    gallery: [{ image: galleryImage }],
    title: 'Midnight Velvet Chair',
    slug: 'midnight-velvet-chair',
    priceInUSDEnabled: true,
    priceInUSD: 4200,
    relatedProducts,
  }),

  aeroLamp: ({
    galleryImage,
    metaImage,
    categories,
    relatedProducts = [],
  }: ProductArgs): RequiredDataFromCollectionSlug<'products'> => ({
    meta: {
      title: 'Aero Floor Lamp | Roshane',
      image: metaImage,
      description: 'A sleek modern minimalist floor lamp with ambient light control.',
    },
    _status: 'published',
    layout: [],
    categories,
    description: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Illuminate your void. The Aero Floor Lamp projects architectural lines of warm light across your space, utilizing hidden LEDs inside a matte-black vertical scupture.',
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
            textFormat: 0,
            textStyle: '',
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    },
    gallery: [{ image: galleryImage }],
    title: 'Aero Floor Lamp',
    slug: 'aero-floor-lamp',
    priceInUSDEnabled: true,
    priceInUSD: 1800,
    relatedProducts,
  }),

  monolithSofa: ({
    galleryImage,
    metaImage,
    categories,
    relatedProducts = [],
  }: ProductArgs): RequiredDataFromCollectionSlug<'products'> => ({
    meta: {
      title: 'Quantum Lounge Sofa | Roshane',
      image: metaImage,
      description: 'A massive modern monolith lounge sofa in dark gray fabric.',
    },
    _status: 'published',
    layout: [],
    categories,
    description: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Uncompromising scale. The Quantum features ultra-deep seating woven in Italian dark grey textiles, providing the ultimate anchor for vast, cinematic interiors.',
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
            textFormat: 0,
            textStyle: '',
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    },
    gallery: [{ image: galleryImage }],
    title: 'Quantum Lounge Sofa',
    slug: 'quantum-lounge-sofa',
    priceInUSDEnabled: true,
    priceInUSD: 18500,
    relatedProducts,
  }),
}
