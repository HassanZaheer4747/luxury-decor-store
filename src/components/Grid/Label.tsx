import clsx from 'clsx'
import React from 'react'

import { Price } from '@/components/Price'

type Props = {
  amount: number
  position?: 'bottom' | 'center'
  title: string
}

export const Label: React.FC<Props> = ({ amount, position = 'bottom', title }) => {
  return (
    <div
      className={clsx('absolute bottom-0 left-0 flex w-full flex-row px-2 pb-2 @container/label', {
        '': position === 'center',
      })}
    >
      <div className="flex flex-row items-center justify-between grow gap-1.5 w-full font-semibold">
        <h3 className="font-mono text-[9px] @[200px]/label:text-[10px] @[250px]/label:text-[11px] truncate min-w-0 border py-1 px-2 leading-tight tracking-tight rounded-full bg-white/70 text-black backdrop-blur-md dark:border-white/10 dark:bg-black/80 dark:text-white">
          {title}
        </h3>

        <Price
          amount={amount}
          className="flex-none rounded-full bg-blue-600 px-2 py-1 text-[9px] @[200px]/label:text-[10px] @[250px]/label:text-[11px] text-white tracking-widest whitespace-nowrap"
          currencyCodeClassName="hidden @[275px]/label:inline"
        />
      </div>
    </div>
  )
}
