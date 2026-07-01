import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/prisma'
import { LeadStatusBadge } from '@/components/admin/LeadStatusBadge'
import { LeadTypeBadge } from '@/components/admin/LeadTypeBadge'
import { LeadStatusForm, LeadNotesForm } from '@/components/admin/LeadUpdateForms'

interface LeadDetailPageProps {
  params: Promise<{ id: string }>
}

function Campo({ label, valor }: { label: string; valor?: string | null }) {
  if (!valor) return null
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{valor}</dd>
    </div>
  )
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params

  const lead = await db.lead.findUnique({
    where: { id },
    include: { product: { select: { name: true, slug: true } } },
  })

  if (!lead) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Cabeçalho */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/admin/leads"
            className="mb-2 inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            ← Voltar para leads
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <LeadTypeBadge type={lead.type} />
          <LeadStatusBadge status={lead.status} />
        </div>
      </div>

      <div className="space-y-6">
        {/* Dados do lead */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Dados do Lead</h2>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Campo label="Nome" valor={lead.name} />
            <Campo label="E-mail" valor={lead.email} />
            <Campo label="Telefone" valor={lead.phone} />
            <Campo label="Empresa" valor={lead.companyName} />
            <Campo label="CNPJ" valor={lead.cnpj} />
            <Campo label="Volume Estimado" valor={lead.estimatedVolume} />
            <Campo label="Prazo Desejado" valor={lead.desiredDeadline} />
            <div>
              <dt className="text-sm font-medium text-gray-500">Data de Criação</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(lead.createdAt).toLocaleString('pt-BR')}
              </dd>
            </div>
          </dl>

          {lead.message && (
            <div className="mt-4">
              <dt className="text-sm font-medium text-gray-500">Mensagem</dt>
              <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{lead.message}</dd>
            </div>
          )}
        </section>

        {/* Produto associado */}
        {lead.product && (
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Produto de Interesse</h2>
            <Link
              href={`/produtos/${lead.product.slug}`}
              className="text-sm font-medium text-orange-600 hover:text-orange-700 hover:underline"
            >
              {lead.product.name}
            </Link>
          </section>
        )}

        {/* Atualizar status */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Atualizar Status</h2>
          <LeadStatusForm leadId={lead.id} currentStatus={lead.status} />
        </section>

        {/* Anotações internas */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Anotações Internas</h2>
          <LeadNotesForm leadId={lead.id} currentNotes={lead.notes} />
        </section>
      </div>
    </div>
  )
}
