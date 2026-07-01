'use client'

import { useState } from 'react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { submitLead } from '@/actions/leads'

const MAPS_EMBED_URL = 'https://maps.google.com/maps?q=Technicfix+S%C3%A3o+Paulo&output=embed'

export default function ContatoPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const result = await submitLead({ type: 'geral', ...form })

    if (result.success) {
      setStatus('success')
      setForm({ name: '', email: '', phone: '', message: '' })
    } else {
      setStatus('error')
      setErrorMsg(result.error ?? 'Erro ao enviar mensagem. Tente novamente.')
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: 'Contato' }]} />

      <h1 className="mb-8 text-3xl font-bold text-gray-900">Entre em Contato</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Dados de contato e mapa */}
        <div className="space-y-6">
          {/* Informações de contato */}
          <section aria-labelledby="info-heading">
            <h2 id="info-heading" className="mb-4 text-xl font-semibold text-gray-800">
              Informações de Contato
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-orange-500" aria-hidden="true">📍</span>
                <span>Rua Exemplo, 123 — São Paulo, SP — CEP 01310-000</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-orange-500" aria-hidden="true">📞</span>
                <span>
                  {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
                    ? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
                    : '(11) 99999-0000'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-orange-500" aria-hidden="true">✉️</span>
                <span>contato@technicfix.com.br</span>
              </li>
            </ul>
          </section>

          {/* Mapa Google Maps */}
          <section aria-labelledby="mapa-heading">
            <h2 id="mapa-heading" className="mb-3 text-xl font-semibold text-gray-800">
              Localização no Mapa
            </h2>
            {MAPS_EMBED_URL ? (
              <iframe
                src={MAPS_EMBED_URL}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização da Technicfix no Google Maps"
                className="rounded-lg"
              />
            ) : (
              <div className="flex h-48 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                Mapa não disponível
              </div>
            )}
          </section>
        </div>

        {/* Formulário de contato */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Envie uma Mensagem</h2>

          {status === 'success' ? (
            <div
              role="alert"
              className="rounded-lg bg-green-50 border border-green-200 p-4 text-green-700"
            >
              Mensagem enviada com sucesso! Em breve entraremos em contato.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
                  Nome <span aria-hidden="true">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                  E-mail <span aria-hidden="true">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
                  Telefone <span aria-hidden="true">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="(11) 99999-0000"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-1 block text-sm font-medium text-gray-700">
                  Mensagem
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="Como podemos ajudar?"
                />
              </div>

              {status === 'error' && (
                <p role="alert" className="text-sm text-red-600">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:opacity-60"
              >
                {status === 'loading' ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
