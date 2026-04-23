'use client'

import { Button } from '@/components/ui/button'
import type { Product, Variant } from '@/payload-types'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import clsx from 'clsx'
import { useSearchParams } from 'next/navigation'
import React, { useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import { useKiSpark } from '@/components/Header/index.client'
type Props = {
  product: Product
}

export function AddToCart({ product }: Props) {
  const { addItem, cart, isLoading } = useCart()
  const searchParams = useSearchParams()
  const { triggerSpark, SparkLayer } = useKiSpark()

  const variants = product.variants?.docs || []

  const selectedVariant = useMemo<Variant | undefined>(() => {
    if (product.enableVariants && variants.length) {
      const variantId = searchParams.get('variant')

      const validVariant = variants.find((variant) => {
        if (typeof variant === 'object') {
          return String(variant.id) === variantId
        }
        return String(variant) === variantId
      })

      if (validVariant && typeof validVariant === 'object') {
        return validVariant
      }
    }

    return undefined
  }, [product.enableVariants, searchParams, variants])

  const addToCart = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      triggerSpark(e)
      toast.success('Item added to cart.')

      addItem({
        product: product.id,
        variant: selectedVariant?.id ?? undefined,
      }).catch(() => {
        toast.error('Failed to add item to cart.')
      })
    },
    [addItem, product, selectedVariant, triggerSpark],
  )

  const disabled = useMemo<boolean>(() => {
    if (product.enableVariants) {
      if (!selectedVariant) {
        return true
      }
    }
    return false
  }, [selectedVariant, product])

  return (
    <>
      <SparkLayer />
      <Button
        aria-label="Add to cart"
        variant={'outline'}
        className={clsx({
          'hover:opacity-90': true,
        })}
        disabled={disabled || isLoading}
        onClick={addToCart}
        type="submit"
      >
        Add To Cart
      </Button>
    </>
  )
}
