'use client'

import { useState } from 'react'
import { submitLead } from '@/actions/leads'
import { maskPhone } from '@/lib/utils/masks'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface LeadVarejoModalProps {
  productId?: string
  productName?: string
  open: boolean
  onClose: () => void
}

type FormState = 'idle' | 'loading' | 'success' | 'error'

export function LeadVarejoModal({
  productId,
  productName,
  open,
  onClose,
}: LeadVarejoModalProps) {
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [phoneValue, setPhoneValue] = useState('')

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      onClose()
      setTimeout(() => {
        setFormState('idle')
        setErrorMessage('')
        setPhoneValue('')
      }, 200)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormState('loading')
    setErrorMessage('')

    const form = event.currentTarget
    const data = new FormData(form)

    try {
      const result = await submitLead({
        type: 'varejo',
        name: data.get('name') as string,
        email: data.get('email') as string,
        phone: data.get('phone') as string,
        productId,
        message: data.get('message') as string,
      })

      if (result.success) {
        setFormState('success')
        form.reset()
        setPhoneValue('')
      } else {
        setFormState('error')
        setErrorMessage(result.error ?? 'Ocorreu um erro. Tente novamente.')
      }
    } catch {
      setFormState('error')
      setErrorMessage('Ocorreu um erro inesperado. Tente novamente.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent data-testid="modal-varejo">
        <DialogHeader>
          <DialogTitle>Tenho interesse</DialogTitle>
          {productName && (
            <DialogDescription>
              Produto: <strong>{productName}</strong>
            </DialogDescription>
          )}
        </DialogHeader>

        {formState === 'success' ? (
          <div
            className="rounded-lg bg-green-50 border border-green-200 p-6 text-center"
            data-testid="success-message"
          >
            <p className="text-2xl mb-2">✅</p>
            <h3 className="text-base font-semibold text-green-800 mb-1">
              Entraremos em contato em breve
            </h3>
            <p className="text-sm text-green-700">
              Recebemos seu interesse e nossa equipe retornará o mais breve possível.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 text-sm text-green-600 hover:underline"
            >
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" data-testid="form-varejo" noValidate>
            <div>
              <label htmlFor="varejo-name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome <span className="text-red-500">*</span>
              </label>
              <input
                id="varejo-name"
                name="name"
                type="text"
                required
                placeholder="Seu nome completo"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand-amber focus:outline-none focus:ring-2 focus:ring-brand-amber/20"
              />
            </div>

            <div>
              <label htmlFor="varejo-email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail <span className="text-red-500">*</span>
              </label>
              <input
                id="varejo-email"
                name="email"
                type="email"
                required
                placeholder="seuemail@exemplo.com"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand-amber focus:outline-none focus:ring-2 focus:ring-brand-amber/20"
              />
            </div>

            <div>
              <label htmlFor="varejo-phone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefone <span className="text-red-500">*</span>
              </label>
              <input
                id="varejo-phone"
                name="phone"
                type="tel"
                required
                placeholder="(11) 99999-9999"
                value={phoneValue}
                onChange={(e) => setPhoneValue(maskPhone(e.target.value))}
                maxLength={15}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand-amber focus:outline-none focus:ring-2 focus:ring-brand-amber/20"
              />
            </div>

            <div>
              <label
                htmlFor="varejo-message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mensagem
              </label>
              <textarea
                id="varejo-message"
                name="message"
                rows={3}
                placeholder="Alguma informação adicional?"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand-amber focus:outline-none focus:ring-2 focus:ring-brand-amber/20 resize-none"
              />
            </div>

            {formState === 'error' && (
              <p
                className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                data-testid="error-message"
              >
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={formState === 'loading'}
              className="w-full rounded-xl bg-brand-amber px-4 py-2.5 text-sm font-bold text-brand-navy hover:bg-brand-amber-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              data-testid="submit-button"
            >
              {formState === 'loading' ? 'Enviando...' : 'Enviar interesse'}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
