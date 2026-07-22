'use client'

import { useState } from 'react'
import { submitLead } from '@/actions/leads'
import { maskPhone, maskCNPJ } from '@/lib/utils/masks'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface LeadAtacadoModalProps {
  productId?: string
  productName?: string
  open: boolean
  onClose: () => void
}

type FormState = 'idle' | 'loading' | 'success' | 'error'

export function LeadAtacadoModal({
  productId,
  productName,
  open,
  onClose,
}: LeadAtacadoModalProps) {
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [phoneValue, setPhoneValue] = useState('')
  const [cnpjValue, setCnpjValue] = useState('')

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      onClose()
      setTimeout(() => {
        setFormState('idle')
        setErrorMessage('')
        setPhoneValue('')
        setCnpjValue('')
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
        type: 'atacado',
        name: data.get('name') as string,
        email: data.get('email') as string,
        phone: data.get('phone') as string,
        companyName: data.get('companyName') as string,
        cnpj: cnpjValue,
        estimatedVolume: data.get('estimatedVolume') as string,
        desiredDeadline: data.get('desiredDeadline') as string,
        message: data.get('message') as string,
        productId,
      })

      if (result.success) {
        setFormState('success')
        form.reset()
        setPhoneValue('')
        setCnpjValue('')
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
      <DialogContent
        className="max-h-[90vh] overflow-y-auto"
        data-testid="modal-atacado"
      >
        <DialogHeader>
          <DialogTitle>Solicitar orçamento</DialogTitle>
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
              Orçamento solicitado com sucesso!
            </h3>
            <p className="text-sm text-green-700">
              Entraremos em contato em breve com uma proposta comercial.
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
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            data-testid="form-atacado"
            noValidate
          >
            <div>
              <label
                htmlFor="atacado-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nome <span className="text-red-500">*</span>
              </label>
              <input
                id="atacado-name"
                name="name"
                type="text"
                required
                placeholder="Seu nome completo"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand-amber focus:outline-none focus:ring-2 focus:ring-brand-amber/20"
              />
            </div>

            <div>
              <label
                htmlFor="atacado-email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                E-mail <span className="text-red-500">*</span>
              </label>
              <input
                id="atacado-email"
                name="email"
                type="email"
                required
                placeholder="contato@empresa.com.br"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand-amber focus:outline-none focus:ring-2 focus:ring-brand-amber/20"
              />
            </div>

            <div>
              <label
                htmlFor="atacado-phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Telefone <span className="text-red-500">*</span>
              </label>
              <input
                id="atacado-phone"
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
                htmlFor="atacado-companyName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Razão Social <span className="text-red-500">*</span>
              </label>
              <input
                id="atacado-companyName"
                name="companyName"
                type="text"
                required
                placeholder="Empresa LTDA"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand-amber focus:outline-none focus:ring-2 focus:ring-brand-amber/20"
              />
            </div>

            <div>
              <label
                htmlFor="atacado-cnpj"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                CNPJ <span className="text-red-500">*</span>
              </label>
              <input
                id="atacado-cnpj"
                name="cnpj"
                type="text"
                required
                placeholder="00.000.000/0001-00"
                value={cnpjValue}
                onChange={(e) => setCnpjValue(maskCNPJ(e.target.value))}
                maxLength={18}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand-amber focus:outline-none focus:ring-2 focus:ring-brand-amber/20"
                data-testid="cnpj-input"
              />
            </div>

            <div>
              <label
                htmlFor="atacado-estimatedVolume"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Volume estimado
              </label>
              <input
                id="atacado-estimatedVolume"
                name="estimatedVolume"
                type="text"
                placeholder="Ex: 500 unidades/mês"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand-amber focus:outline-none focus:ring-2 focus:ring-brand-amber/20"
              />
            </div>

            <div>
              <label
                htmlFor="atacado-desiredDeadline"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Prazo desejado
              </label>
              <input
                id="atacado-desiredDeadline"
                name="desiredDeadline"
                type="text"
                placeholder="Ex: 30 dias"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand-amber focus:outline-none focus:ring-2 focus:ring-brand-amber/20"
              />
            </div>

            <div>
              <label
                htmlFor="atacado-message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mensagem
              </label>
              <textarea
                id="atacado-message"
                name="message"
                rows={3}
                placeholder="Detalhes do seu pedido ou dúvidas"
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
              {formState === 'loading' ? 'Enviando...' : 'Solicitar orçamento'}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
