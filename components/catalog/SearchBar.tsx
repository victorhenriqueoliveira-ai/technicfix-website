'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useRef, useEffect, useCallback } from 'react'
import { SearchIcon } from 'lucide-react'

interface SearchBarProps {
  placeholder?: string
}

export function SearchBar({ placeholder = 'Buscar produtos...' }: SearchBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = searchParams.get('busca') ?? ''
    }
  }, [searchParams])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value

      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString())

        if (value) {
          params.set('busca', value)
        } else {
          params.delete('busca')
        }
        params.delete('page')

        router.replace(`${pathname}?${params.toString()}`)
      }, 300)
    },
    [router, pathname, searchParams],
  )

  return (
    <div className="relative">
      <SearchIcon
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-navy/40"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="search"
        placeholder={placeholder}
        onChange={handleChange}
        className="w-full rounded-xl border-2 border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-brand-navy placeholder-brand-navy/30 focus:border-brand-amber focus:outline-none focus:ring-0 transition-colors"
        aria-label="Buscar produtos"
        data-testid="search-input"
      />
    </div>
  )
}
