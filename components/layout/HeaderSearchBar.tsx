'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

interface HeaderSearchBarProps {
  className?: string
}

export function HeaderSearchBar({ className }: HeaderSearchBarProps) {
  const [value, setValue] = useState('')
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    router.push('/produtos?busca=' + encodeURIComponent(trimmed))
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className ?? ''}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar produtos..."
        aria-label="Buscar produtos"
        className="rounded-lg border border-gray-200 py-2 pl-4 pr-10 text-sm focus:border-brand-amber focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-amber"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  )
}
