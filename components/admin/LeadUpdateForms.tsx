'use client'

import { useTransition } from 'react'
import { updateLeadStatus, updateLeadNotes } from '@/actions/admin-leads'
import type { LeadStatus } from '@/lib/types'

interface LeadStatusFormProps {
  leadId: string
  currentStatus: LeadStatus
}

const statusOptions: { value: LeadStatus; label: string }[] = [
  { value: 'novo', label: 'Novo' },
  { value: 'em_atendimento', label: 'Em Atendimento' },
  { value: 'convertido', label: 'Convertido' },
  { value: 'perdido', label: 'Perdido' },
]

export function LeadStatusForm({ leadId, currentStatus }: LeadStatusFormProps) {
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const novoStatus = e.target.value as LeadStatus
    startTransition(() => {
      updateLeadStatus(leadId, novoStatus)
    })
  }

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="lead-status" className="text-sm font-medium text-gray-700">
        Status:
      </label>
      <select
        id="lead-status"
        name="status"
        defaultValue={currentStatus}
        onChange={handleChange}
        disabled={isPending}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:opacity-50"
        aria-label="Atualizar status do lead"
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {isPending && <span className="text-xs text-gray-500">Salvando...</span>}
    </div>
  )
}

interface LeadNotesFormProps {
  leadId: string
  currentNotes: string | null
}

export function LeadNotesForm({ leadId, currentNotes }: LeadNotesFormProps) {
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const notes = (form.elements.namedItem('notes') as HTMLTextAreaElement).value
    startTransition(() => {
      updateLeadNotes(leadId, notes)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor="lead-notes" className="block text-sm font-medium text-gray-700">
        Anotações internas
      </label>
      <textarea
        id="lead-notes"
        name="notes"
        defaultValue={currentNotes ?? ''}
        rows={4}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        placeholder="Adicione anotações internas sobre este lead..."
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
      >
        {isPending ? 'Salvando...' : 'Salvar anotações'}
      </button>
    </form>
  )
}
