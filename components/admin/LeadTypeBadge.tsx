import type { LeadType } from '@/lib/types'

interface LeadTypeBadgeProps {
  type: LeadType
}

const typeConfig: Record<LeadType, { label: string; className: string }> = {
  varejo: {
    label: 'Varejo',
    className: 'bg-orange-100 text-orange-800',
  },
  atacado: {
    label: 'Atacado',
    className: 'bg-purple-100 text-purple-800',
  },
  geral: {
    label: 'Geral',
    className: 'bg-gray-100 text-gray-800',
  },
}

export function LeadTypeBadge({ type }: LeadTypeBadgeProps) {
  const config = typeConfig[type] ?? { label: type, className: 'bg-gray-100 text-gray-800' }

  return (
    <span
      data-testid="lead-type-badge"
      data-type={type}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  )
}
