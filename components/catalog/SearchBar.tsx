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

  // Preenche o input com o valor atual da URL ao montar
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
        // Reinicia paginação ao buscar
        params.delete('page')

        router.replace(`${pathname}?${params.toString()}`)
      }, 300)
    },
    [router, pathname, searchParams],
  )

  return (
    <div className="relative">
      <SearchIcon
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="search"
        placeholder={placeholder}
        onChange={handleChange}
        className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        aria-label="Buscar produtos"
        data-testid="search-input"
      />
    </div>
  )
}
