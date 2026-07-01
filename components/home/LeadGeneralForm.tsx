'use client'

import { useState } from 'react'
import { submitLead } from '@/actions/leads'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export function LeadGeneralForm() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormState('loading')
    setErrorMessage('')

    const form = event.currentTarget
    const data = new FormData(form)

    try {
      const result = await submitLead({
        type: 'geral',
        name: data.get('name') as string,
        email: data.get('email') as string,
        phone: data.get('phone') as string,
        message: data.get('message') as string,
      })

      if (result.success) {
        setFormState('success')
        form.reset()
      } else {
        setFormState('error')
        setErrorMessage(result.error ?? 'Ocorreu um erro. Tente novamente.')
      }
    } catch {
      setFormState('error')
      setErrorMessage('Ocorreu um erro inesperado. Tente novamente.')
    }
  }

  if (formState === 'success') {
    return (
      <section className="py-12 px-4 bg-white" aria-label="Formulário de contato">
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="bg-green-50 border border-green-200 rounded-xl p-8"
            data-testid="success-message"
          >
            <p className="text-4xl mb-4">✅</p>
            <h3 className="text-xl font-bold text-green-800 mb-2">
              Mensagem enviada com sucesso!
            </h3>
            <p className="text-green-700">
              Obrigado pelo contato. Nossa equipe retornará em breve.
            </p>
            <button
              onClick={() => setFormState('idle')}
              className="mt-4 text-sm text-green-600 hover:underline"
            >
              Enviar outra mensagem
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      className="py-12 px-4 bg-white"
      aria-label="Formulário de contato"
      data-testid="lead-form-section"
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center">
          Entre em Contato
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Preencha o formulário e nossa equipe retornará o mais breve possível.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          data-testid="lead-form"
          noValidate
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Seu nome completo"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-brand-amber focus:outline-none focus:ring-2 focus:ring-brand-amber/20"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Telefone <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="(11) 99999-9999"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-brand-amber focus:outline-none focus:ring-2 focus:ring-brand-amber/20"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mail <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="seuemail@exemplo.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-brand-amber focus:outline-none focus:ring-2 focus:ring-brand-amber/20"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Mensagem
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Como podemos ajudá-lo?"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-brand-amber focus:outline-none focus:ring-2 focus:ring-brand-amber/20 resize-none"
            />
          </div>

          {formState === 'error' && (
            <p
              className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2"
              data-testid="error-message"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={formState === 'loading'}
            className="w-full bg-brand-amber text-brand-navy font-bold py-3 rounded-xl hover:bg-brand-amber-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            data-testid="submit-button"
          >
            {formState === 'loading' ? 'Enviando...' : 'Enviar Mensagem'}
          </button>
        </form>
      </div>
    </section>
  )
}
