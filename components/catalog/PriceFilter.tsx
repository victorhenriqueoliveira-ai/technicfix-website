'use client'

import * as Slider from '@base-ui/react/Slider'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export interface PriceFilterProps {
  min: number // limite global mínimo
  max: number // limite global máximo
  currentMin: number
  currentMax: number
}

function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })
}

export function PriceFilter({ min, max, currentMin, currentMax }: PriceFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [displayValues, setDisplayValues] = useState<[number, number]>([currentMin, currentMax])

  function handleValueChange(value: number | readonly number[]) {
    const arr = Array.isArray(value) ? (value as readonly number[]) : [value as number, value as number]
    setDisplayValues([arr[0], arr[1]])
  }

  function handleValueCommitted(value: number | readonly number[]) {
    const arr = Array.isArray(value) ? (value as readonly number[]) : [value as number, value as number]
    const [committedMin, committedMax] = arr

    const params = new URLSearchParams()

    // Preservar params existentes
    const categoria = searchParams.get('categoria')
    const busca = searchParams.get('busca')
    const page = searchParams.get('page')
    if (categoria) params.set('categoria', categoria)
    if (busca) params.set('busca', busca)
    if (page) params.set('page', page)

    // Adicionar filtro de preço
    params.set('minPrice', String(committedMin))
    params.set('maxPrice', String(committedMax))

    router.push(`/produtos?${params.toString()}`)
  }

  return (
    <div className="mt-4">
      <div className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-navy/40">
        Faixa de Preço
      </div>

      <div className="mb-3 text-sm font-semibold text-brand-navy">
        {formatBRL(displayValues[0])} — {formatBRL(displayValues[1])}
      </div>

      <Slider.Root
        min={min}
        max={max}
        value={[displayValues[0], displayValues[1]]}
        onValueChange={handleValueChange}
        onValueCommitted={handleValueCommitted}
        className="relative flex w-full touch-none select-none items-center"
        data-testid="price-slider"
      >
        <Slider.Control className="relative flex w-full items-center">
          <Slider.Track className="relative h-1.5 w-full grow rounded-full bg-brand-navy/20">
            <Slider.Indicator className="absolute h-full rounded-full bg-brand-amber" />
            <Slider.Thumb
              className="block h-4 w-4 rounded-full border-2 border-brand-amber bg-white shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-amber"
              aria-label="Preço mínimo"
            />
            <Slider.Thumb
              className="block h-4 w-4 rounded-full border-2 border-brand-amber bg-white shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-amber"
              aria-label="Preço máximo"
            />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>

      <div className="mt-1 flex justify-between text-xs text-brand-navy/50">
        <span>{formatBRL(min)}</span>
        <span>{formatBRL(max)}</span>
      </div>
    </div>
  )
}
