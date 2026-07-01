'use client'

import { useRef, useState, useTransition } from 'react'
import { updateSiteConfig } from '@/actions/site-config'
import type { SiteConfig } from '@/lib/types'

interface SiteConfigFormProps {
  config: SiteConfig
}

export function SiteConfigForm({ config }: SiteConfigFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setMessage(null)

    startTransition(async () => {
      const result = await updateSiteConfig(formData)
      if (result.success) {
        setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' })
      } else {
        setMessage({ type: 'error', text: result.error ?? 'Erro ao salvar configurações.' })
      }
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {message && (
        <div
          role="alert"
          className={`rounded-md px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
          Nome da Loja
        </label>
        <input
          id="storeName"
          name="storeName"
          type="text"
          defaultValue={config.storeName}
          required
          minLength={2}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">
          Número do WhatsApp (somente dígitos, 10 ou 11 dígitos)
        </label>
        <input
          id="whatsappNumber"
          name="whatsappNumber"
          type="text"
          defaultValue={config.whatsappNumber}
          placeholder="11987654321"
          pattern="\d{10,11}"
          title="Somente dígitos, 10 ou 11 caracteres"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
          E-mail de Contato
        </label>
        <input
          id="contactEmail"
          name="contactEmail"
          type="email"
          defaultValue={config.contactEmail}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="technocalhasUrl" className="block text-sm font-medium text-gray-700">
          URL da Technocalhas
        </label>
        <input
          id="technocalhasUrl"
          name="technocalhasUrl"
          type="url"
          defaultValue={config.technocalhasUrl}
          placeholder="https://technocalhas.com.br"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="technocalhasDescription" className="block text-sm font-medium text-gray-700">
          Descrição da Technocalhas
        </label>
        <textarea
          id="technocalhasDescription"
          name="technocalhasDescription"
          defaultValue={config.technocalhasDescription}
          rows={4}
          maxLength={500}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Salvando...' : 'Salvar Configurações'}
      </button>
    </form>
  )
}
