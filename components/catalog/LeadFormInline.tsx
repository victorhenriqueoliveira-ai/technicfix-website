'use client'

import { useState, useTransition } from 'react'
import { submitLead } from '@/actions/leads'
import { varejoSchema, atacadoSchema } from '@/lib/validations/lead'

type LeadType = 'varejo' | 'atacado'

interface LeadFormInlineProps {
  productId?: string
  productName?: string
  defaultType?: LeadType
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  companyName?: string
  cnpj?: string
  estimatedVolume?: string
  desiredDeadline?: string
  message?: string
}

export function LeadFormInline({
  productId,
  productName: _productName,
  defaultType = 'varejo',
}: LeadFormInlineProps) {
  const [expanded, setExpanded] = useState(false)
  const [tipo, setTipo] = useState<LeadType>(defaultType)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isPending, startTransition] = useTransition()

  // Campos controlados
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [volume, setVolume] = useState('')
  const [prazo, setPrazo] = useState('')

  function resetForm() {
    setNome('')
    setEmail('')
    setTelefone('')
    setMensagem('')
    setEmpresa('')
    setCnpj('')
    setVolume('')
    setPrazo('')
    setErrors({})
  }

  function validateForm(): boolean {
    const payload =
      tipo === 'varejo'
        ? { type: 'varejo' as const, name: nome, email, phone: telefone, message: mensagem, productId }
        : {
            type: 'atacado' as const,
            name: nome,
            email,
            phone: telefone,
            companyName: empresa,
            cnpj,
            estimatedVolume: volume,
            desiredDeadline: prazo,
            message: mensagem,
            productId,
          }

    const schema = tipo === 'varejo' ? varejoSchema : atacadoSchema
    const result = schema.safeParse(payload)

    if (!result.success) {
      const fieldErrors: FormErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormErrors
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      }
      setErrors(fieldErrors)
      return false
    }

    setErrors({})
    return true
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!validateForm()) return

    const payload =
      tipo === 'varejo'
        ? { type: 'varejo' as const, name: nome, email, phone: telefone, message: mensagem || undefined, productId }
        : {
            type: 'atacado' as const,
            name: nome,
            email,
            phone: telefone,
            companyName: empresa,
            cnpj,
            estimatedVolume: volume || undefined,
            desiredDeadline: prazo || undefined,
            message: mensagem || undefined,
            productId,
          }

    startTransition(async () => {
      const result = await submitLead(payload)
      if (result.success) {
        setSubmitStatus('success')
        resetForm()
      } else {
        setSubmitStatus('error')
        setSubmitError(result.error ?? 'Erro ao enviar formulário.')
      }
    })
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50">
      {/* Trigger colapsável */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        data-testid="lead-form-trigger"
        aria-expanded={expanded}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-brand-navy"
      >
        <span>Prefere preencher um formulário?</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={`h-4 w-4 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Conteúdo colapsável */}
      {expanded && (
        <div className="border-t border-gray-200 px-4 pb-4 pt-3">
          {submitStatus === 'success' ? (
            <div
              className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800"
              data-testid="lead-form-success"
              role="alert"
            >
              Obrigado! Entraremos em contato em breve.
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate data-testid="lead-form">
              {/* Seletor de tipo */}
              <div className="mb-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setTipo('varejo')}
                  data-testid="form-tipo-varejo"
                  className={`flex-1 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors ${
                    tipo === 'varejo'
                      ? 'border-brand-navy bg-brand-navy text-white'
                      : 'border-gray-300 text-brand-navy hover:border-brand-navy'
                  }`}
                >
                  Varejo
                </button>
                <button
                  type="button"
                  onClick={() => setTipo('atacado')}
                  data-testid="form-tipo-atacado"
                  className={`flex-1 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors ${
                    tipo === 'atacado'
                      ? 'border-brand-navy bg-brand-navy text-white'
                      : 'border-gray-300 text-brand-navy hover:border-brand-navy'
                  }`}
                >
                  Atacado
                </button>
              </div>

              {/* Erro de envio */}
              {submitStatus === 'error' && (
                <div
                  className="mb-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700"
                  data-testid="lead-form-error"
                  role="alert"
                >
                  {submitError}
                </div>
              )}

              {/* Campos básicos */}
              <div className="flex flex-col gap-3">
                <div>
                  <label htmlFor="lead-nome" className="mb-1 block text-xs font-medium text-gray-700">
                    Nome *
                  </label>
                  <input
                    id="lead-nome"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    data-testid="lead-input-nome"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                    autoComplete="name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="lead-email" className="mb-1 block text-xs font-medium text-gray-700">
                    E-mail *
                  </label>
                  <input
                    id="lead-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="lead-input-email"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="lead-telefone" className="mb-1 block text-xs font-medium text-gray-700">
                    Telefone *
                  </label>
                  <input
                    id="lead-telefone"
                    type="tel"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    data-testid="lead-input-telefone"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                    autoComplete="tel"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-600" role="alert">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Campos de atacado — aparecem ao selecionar tipo atacado */}
                {tipo === 'atacado' && (
                  <>
                    <div data-testid="campos-atacado">
                      <label htmlFor="lead-empresa" className="mb-1 block text-xs font-medium text-gray-700">
                        Empresa (Razão Social) *
                      </label>
                      <input
                        id="lead-empresa"
                        type="text"
                        value={empresa}
                        onChange={(e) => setEmpresa(e.target.value)}
                        data-testid="lead-input-empresa"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                        autoComplete="organization"
                      />
                      {errors.companyName && (
                        <p className="mt-1 text-xs text-red-600" role="alert">
                          {errors.companyName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lead-cnpj" className="mb-1 block text-xs font-medium text-gray-700">
                        CNPJ *
                      </label>
                      <input
                        id="lead-cnpj"
                        type="text"
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
                        data-testid="lead-input-cnpj"
                        placeholder="00.000.000/0000-00"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                      />
                      {errors.cnpj && (
                        <p className="mt-1 text-xs text-red-600" role="alert">
                          {errors.cnpj}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lead-volume" className="mb-1 block text-xs font-medium text-gray-700">
                        Volume estimado
                      </label>
                      <input
                        id="lead-volume"
                        type="text"
                        value={volume}
                        onChange={(e) => setVolume(e.target.value)}
                        data-testid="lead-input-volume"
                        placeholder="Ex: 500 unidades/mês"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                      />
                    </div>

                    <div>
                      <label htmlFor="lead-prazo" className="mb-1 block text-xs font-medium text-gray-700">
                        Prazo desejado
                      </label>
                      <input
                        id="lead-prazo"
                        type="text"
                        value={prazo}
                        onChange={(e) => setPrazo(e.target.value)}
                        data-testid="lead-input-prazo"
                        placeholder="Ex: 30 dias"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label htmlFor="lead-mensagem" className="mb-1 block text-xs font-medium text-gray-700">
                    Mensagem (opcional)
                  </label>
                  <textarea
                    id="lead-mensagem"
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    data-testid="lead-input-mensagem"
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  data-testid="lead-form-submit"
                  className="w-full rounded-xl bg-brand-navy px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-navy/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
