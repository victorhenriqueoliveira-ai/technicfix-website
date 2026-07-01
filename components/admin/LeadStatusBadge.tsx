import type { LeadStatus } from '@/lib/types'

interface LeadStatusBadgeProps {
  status: LeadStatus
}

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  novo: {
    label: 'Novo',
    className: 'bg-blue-100 text-blue-800',
  },
  em_atendimento: {
    label: 'Em Atendimento',
    className: 'bg-yellow-100 text-yellow-800',
  },
  convertido: {
    label: 'Convertido',
    className: 'bg-green-100 text-green-800',
  },
  perdido: {
    label: 'Perdido',
    className: 'bg-red-100 text-red-800',
  },
}

export function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: 'bg-gray-100 text-gray-800' }

  return (
    <span
      data-testid="lead-status-badge"
      data-status={status}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  )
}
