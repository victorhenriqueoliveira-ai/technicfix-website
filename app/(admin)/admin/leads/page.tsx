import Link from 'next/link'
import { db } from '@/lib/prisma'
import { LeadStatusBadge } from '@/components/admin/LeadStatusBadge'
import { LeadTypeBadge } from '@/components/admin/LeadTypeBadge'
import type { LeadStatus, LeadType } from '@/lib/types'

const ITEMS_PER_PAGE = 20

interface LeadsPageProps {
  searchParams: Promise<{
    tipo?: string
    status?: string
    page?: string
  }>
}

const tiposValidos: LeadType[] = ['varejo', 'atacado', 'geral']
const statusValidos: LeadStatus[] = ['novo', 'em_atendimento', 'convertido', 'perdido']

const statusLabels: Record<LeadStatus, string> = {
  novo: 'Novo',
  em_atendimento: 'Em Atendimento',
  convertido: 'Convertido',
  perdido: 'Perdido',
}

const tipoLabels: Record<LeadType, string> = {
  varejo: 'Varejo',
  atacado: 'Atacado',
  geral: 'Geral',
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page ?? '1', 10))
  const skip = (page - 1) * ITEMS_PER_PAGE

  const tipoFiltro =
    params.tipo && tiposValidos.includes(params.tipo as LeadType)
      ? (params.tipo as LeadType)
      : undefined

  const statusFiltro =
    params.status && statusValidos.includes(params.status as LeadStatus)
      ? (params.status as LeadStatus)
      : undefined

  const where = {
    ...(tipoFiltro ? { type: tipoFiltro } : {}),
    ...(statusFiltro ? { status: statusFiltro } : {}),
  }

  const [leads, total] = await Promise.all([
    db.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: ITEMS_PER_PAGE,
      include: { product: { select: { name: true, slug: true } } },
    }),
    db.lead.count({ where }),
  ])

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  const buildUrl = (overrides: Record<string, string | undefined>) => {
    const p: Record<string, string> = {}
    if (tipoFiltro) p.tipo = tipoFiltro
    if (statusFiltro) p.status = statusFiltro
    Object.entries(overrides).forEach(([k, v]) => {
      if (v === undefined) {
        delete p[k]
      } else {
        p[k] = v
      }
    })
    const qs = new URLSearchParams(p).toString()
    return `/admin/leads${qs ? `?${qs}` : ''}`
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Leads</h1>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-4" data-testid="leads-filters">
        {/* Filtro por tipo */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Tipo:</span>
          <div className="flex gap-1">
            <Link
              href={buildUrl({ tipo: undefined, page: undefined })}
              data-testid="filtro-tipo-todos"
              className={`rounded-md px-3 py-1 text-sm font-medium ${
                !tipoFiltro
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </Link>
            {tiposValidos.map((t) => (
              <Link
                key={t}
                href={buildUrl({ tipo: t, page: undefined })}
                data-testid={`filtro-tipo-${t}`}
                className={`rounded-md px-3 py-1 text-sm font-medium ${
                  tipoFiltro === t
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tipoLabels[t]}
              </Link>
            ))}
          </div>
        </div>

        {/* Filtro por status */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <div className="flex gap-1">
            <Link
              href={buildUrl({ status: undefined, page: undefined })}
              data-testid="filtro-status-todos"
              className={`rounded-md px-3 py-1 text-sm font-medium ${
                !statusFiltro
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </Link>
            {statusValidos.map((s) => (
              <Link
                key={s}
                href={buildUrl({ status: s, page: undefined })}
                data-testid={`filtro-status-${s}`}
                className={`rounded-md px-3 py-1 text-sm font-medium ${
                  statusFiltro === s
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {statusLabels[s]}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Contagem */}
      <p className="mb-4 text-sm text-gray-500">
        {total} lead{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
      </p>

      {/* Tabela */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200" data-testid="leads-table">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                E-mail
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Telefone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Data
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500" data-testid="empty-state">
                  Nenhum lead encontrado.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {lead.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {lead.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {lead.phone}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <LeadTypeBadge type={lead.type} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <LeadStatusBadge status={lead.status} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-medium text-orange-600 hover:text-orange-700"
                    >
                      Ver detalhe
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <nav
          className="mt-6 flex items-center justify-center gap-4"
          aria-label="Paginação de leads"
        >
          {page > 1 && (
            <Link
              href={buildUrl({ page: String(page - 1) })}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Anterior
            </Link>
          )}
          <span className="text-sm text-gray-600">
            Página {page} de {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={buildUrl({ page: String(page + 1) })}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Próxima
            </Link>
          )}
        </nav>
      )}
    </div>
  )
}
