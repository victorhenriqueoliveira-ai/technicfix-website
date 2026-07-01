'use client'

import { useState, useTransition } from 'react'
import { deleteProduct } from '@/actions/products'

interface DeleteProductButtonProps {
  id: string
  name: string
}

export function DeleteProductButton({ id, name }: DeleteProductButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleConfirm() {
    setError(null)
    startTransition(async () => {
      const result = await deleteProduct(id)
      if (result.success) {
        setIsOpen(false)
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <>
      <button
        onClick={() => {
          setError(null)
          setIsOpen(true)
        }}
        className="text-sm font-medium text-red-600 hover:text-red-800"
      >
        Deletar
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !isPending && setIsOpen(false)}
          />

          {/* Dialog */}
          <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">Excluir produto</h2>
            <p className="mt-2 text-sm text-gray-600">
              Tem certeza que deseja excluir o produto{' '}
              <strong>&quot;{name}&quot;</strong>? Os leads associados serão desvinculados. Esta
              ação não pode ser desfeita.
            </p>

            {error && (
              <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={isPending}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isPending ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
