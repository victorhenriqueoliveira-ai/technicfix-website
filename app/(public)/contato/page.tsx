'use client'

import { useState } from 'react'
import { submitLead } from '@/actions/leads'

const MAPS_EMBED_URL = 'https://maps.google.com/maps?q=Technicfix+S%C3%A3o+Paulo&output=embed'

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') ?? ''
const whatsappHref = whatsappNumber
  ? `https://wa.me/55${whatsappNumber}?text=Olá,%20gostaria%20de%20um%20orçamento!`
  : null

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

  const inputClass =
    'w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-brand-navy placeholder-brand-navy/30 focus:border-brand-amber focus:outline-none transition-colors'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header da página */}
      <div className="bg-brand-navy px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-amber mb-2">
            Fale com a gente
          </span>
          <h1 className="text-4xl font-extrabold text-white">Entre em Contato</h1>
          <p className="mt-3 text-white/60 max-w-xl mx-auto">
            Tire dúvidas, solicite orçamentos ou venha nos visitar. Estamos prontos para te atender!
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* CTA WhatsApp em destaque */}
        {whatsappHref && (
          <div className="mb-10 flex flex-col items-center justify-center gap-4 rounded-2xl bg-brand-navy p-8 text-center shadow-lg">
            <p className="text-lg font-bold text-white">
              Prefere falar agora? Use o WhatsApp!
            </p>
            <p className="text-white/60 text-sm max-w-md">
              Atendimento rápido e personalizado direto pelo WhatsApp. Clique e fale conosco agora!
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-base font-bold text-white transition-all hover:bg-[#1ebe5d] hover:scale-105 shadow-lg"
            >
              <WhatsAppIcon className="h-6 w-6" />
              Falar pelo WhatsApp
            </a>
          </div>
        )}

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Dados de contato e mapa */}
          <div className="space-y-6">
            <section aria-labelledby="info-heading" className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <h2 id="info-heading" className="mb-5 text-xl font-extrabold text-brand-navy">
                Informações de Contato
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-amber/10 text-brand-amber">
                    <LocationIcon className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-brand-navy/70 pt-2">Rua Exemplo, 123 — São Paulo, SP — CEP 01310-000</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-amber/10 text-brand-amber">
                    <PhoneIcon className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-brand-navy/70 pt-2">
                    {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '(11) 99999-0000'}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-amber/10 text-brand-amber">
                    <MailIcon className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-brand-navy/70 pt-2">contato@technicfix.com.br</span>
                </li>
              </ul>
            </section>

            <section aria-labelledby="mapa-heading" className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
              <h2 id="mapa-heading" className="px-6 pt-5 pb-3 text-xl font-extrabold text-brand-navy">
                Localização
              </h2>
              {MAPS_EMBED_URL ? (
                <iframe
                  src={MAPS_EMBED_URL}
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização da TechnicFix no Google Maps"
                />
              ) : (
                <div className="flex h-48 items-center justify-center bg-gray-100 text-gray-500">
                  Mapa não disponível
                </div>
              )}
            </section>
          </div>

          {/* Formulário */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="mb-6 text-xl font-extrabold text-brand-navy">Envie uma Mensagem</h2>

            {status === 'success' ? (
              <div
                role="alert"
                className="rounded-2xl bg-green-50 border-2 border-green-200 p-6 text-center"
              >
                <p className="text-lg font-bold text-green-700 mb-1">Mensagem enviada!</p>
                <p className="text-sm text-green-600">Em breve entraremos em contato.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-bold text-brand-navy">
                    Nome <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className={inputClass}
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-bold text-brand-navy">
                    E-mail <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className={inputClass}
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-sm font-bold text-brand-navy">
                    Telefone <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className={inputClass}
                    placeholder="(11) 99999-0000"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-bold text-brand-navy">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className={inputClass}
                    placeholder="Como podemos ajudar?"
                  />
                </div>

                {status === 'error' && (
                  <p role="alert" className="text-sm text-red-600 font-medium">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full rounded-xl bg-brand-amber px-4 py-3 text-sm font-bold text-brand-navy transition-all hover:bg-brand-amber-dark disabled:opacity-60"
                >
                  {status === 'loading' ? 'Enviando...' : 'Enviar Mensagem'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  )
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  )
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  )
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  )
}
