'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import Image from 'next/image'

interface Suggestion {
  id: string
  name: string
  slug: string
  image: string | null
}

interface HeaderSearchBarProps {
  className?: string
}

export function HeaderSearchBar({ className }: HeaderSearchBarProps) {
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const router = useRouter()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Busca sugestões com debounce de 250ms
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (value.trim().length < 2) {
      setSuggestions([])
      setOpen(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/produtos/sugestoes?q=${encodeURIComponent(value.trim())}`
        )
        const data: Suggestion[] = await res.json()
        setSuggestions(data)
        setOpen(data.length > 0)
        setActiveIndex(-1)
      } catch {
        setSuggestions([])
        setOpen(false)
      }
    }, 250)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [value])

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    setOpen(false)
    router.push('/produtos?busca=' + encodeURIComponent(trimmed))
    setValue('')
  }

  function handleSelect(slug: string) {
    setOpen(false)
    setValue('')
    router.push('/produtos/' + slug)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      handleSelect(suggestions[activeIndex].slug)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className ?? ''}`}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="Buscar produtos..."
          aria-label="Buscar produtos"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="search-suggestions"
          className="w-full rounded-lg border border-gray-200 py-2 pl-4 pr-10 text-sm focus:border-brand-amber focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Buscar"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-amber"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>

      {/* Dropdown de sugestões */}
      {open && suggestions.length > 0 && (
        <ul
          id="search-suggestions"
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          {suggestions.map((s, idx) => (
            <li
              key={s.id}
              role="option"
              aria-selected={idx === activeIndex}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseDown={(e) => {
                e.preventDefault()
                handleSelect(s.slug)
              }}
              className={`flex cursor-pointer items-center gap-3 px-3 py-2 text-sm transition-colors ${
                idx === activeIndex ? 'bg-brand-amber/10 text-brand-navy' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {/* Miniatura */}
              <div className="h-9 w-9 shrink-0 overflow-hidden rounded bg-gray-100">
                {s.image ? (
                  <Image
                    src={s.image}
                    alt={s.name}
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-300">
                    <Search className="h-4 w-4" />
                  </div>
                )}
              </div>
              <span className="truncate">{s.name}</span>
            </li>
          ))}

          {/* Link "ver todos os resultados" */}
          <li
            onMouseDown={(e) => {
              e.preventDefault()
              setOpen(false)
              router.push('/produtos?busca=' + encodeURIComponent(value.trim()))
              setValue('')
            }}
            className="cursor-pointer border-t border-gray-100 px-3 py-2 text-center text-xs font-medium text-brand-amber hover:bg-gray-50"
          >
            Ver todos os resultados para &ldquo;{value}&rdquo;
          </li>
        </ul>
      )}
    </div>
  )
}
