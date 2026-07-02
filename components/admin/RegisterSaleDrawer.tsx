'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { registerSale } from '@/actions/sales'

export type ActiveProduct = {
  id: string
  name: string
  stock: number
}

interface RegisterSaleDrawerProps {
  products: ActiveProduct[]
}

export function RegisterSaleDrawer({ products }: RegisterSaleDrawerProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Form state
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<ActiveProduct | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [buyerType, setBuyerType] = useState<'varejo' | 'atacado'>('varejo')
  const [notes, setNotes] = useState('')

  // Feedback state
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  function resetForm() {
    setSearch('')
    setSelectedProduct(null)
    setQuantity(1)
    setBuyerType('varejo')
    setNotes('')
    setError(null)
    setSuccessMessage(null)
  }

  function handleOpenChange(value: boolean) {
    if (!value) {
      resetForm()
    }
    setOpen(value)
  }

  // Auto-dismiss success toast
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  function handleConfirm() {
    if (!selectedProduct || quantity <= 0) return

    setError(null)
    startTransition(async () => {
      const result = await registerSale({
        productId: selectedProduct.id,
        quantity,
        buyerType,
        notes: notes.trim() || undefined,
      })

      if (result.success) {
        setOpen(false)
        resetForm()
        router.refresh()
      } else {
        setError(result.error)
      }
    })
  }

  const isConfirmDisabled = !selectedProduct || quantity <= 0 || isPending

  return (
    <>
      {/* Toast de sucesso (externo ao drawer) */}
      {successMessage && (
        <div
          role="status"
          aria-live="polite"
          data-testid="success-toast"
          className="fixed right-4 top-4 z-[100] rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-lg"
        >
          {successMessage}
        </div>
      )}

      <Button onClick={() => setOpen(true)} data-testid="open-drawer-btn">
        Registrar Venda
      </Button>

      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent side="right" showCloseButton>
          <SheetHeader>
            <SheetTitle>Registrar Venda</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-4 overflow-y-auto p-4">
            {/* Busca de produto */}
            <div>
              <label
                htmlFor="product-search"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Produto
              </label>
              <input
                id="product-search"
                type="text"
                placeholder="Buscar produto por nome..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setSelectedProduct(null)
                }}
                data-testid="product-search"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />

              {search && !selectedProduct && filteredProducts.length > 0 && (
                <ul
                  className="mt-1 max-h-48 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-sm"
                  data-testid="product-suggestions"
                >
                  {filteredProducts.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProduct(p)
                          setSearch(p.name)
                        }}
                        data-testid={`product-option-${p.id}`}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        {p.name}{' '}
                        <span className="text-gray-400">(estoque: {p.stock})</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {search && !selectedProduct && filteredProducts.length === 0 && (
                <p className="mt-1 text-xs text-gray-500" data-testid="no-products">
                  Nenhum produto ativo com estoque encontrado.
                </p>
              )}

              {selectedProduct && (
                <p className="mt-1 text-xs text-green-600" data-testid="selected-product">
                  Selecionado: {selectedProduct.name} (estoque atual: {selectedProduct.stock})
                </p>
              )}
            </div>

            {/* Quantidade */}
            <div>
              <label
                htmlFor="quantity"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Quantidade
              </label>
              <input
                id="quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value, 10) || 0))}
                data-testid="quantity-input"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Tipo de comprador */}
            <div>
              <label
                htmlFor="buyer-type"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Tipo de comprador
              </label>
              <select
                id="buyer-type"
                value={buyerType}
                onChange={(e) => setBuyerType(e.target.value as 'varejo' | 'atacado')}
                data-testid="buyer-type-select"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="varejo">Varejo</option>
                <option value="atacado">Atacado</option>
              </select>
            </div>

            {/* Notas */}
            <div>
              <label
                htmlFor="notes"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Notas (opcional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                data-testid="notes-input"
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Mensagem de erro */}
            {error && (
              <div
                role="alert"
                data-testid="error-message"
                className="rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {error}
              </div>
            )}
          </div>

          <SheetFooter>
            <Button
              onClick={handleConfirm}
              disabled={isConfirmDisabled}
              data-testid="confirm-btn"
              className="w-full"
            >
              {isPending ? 'Registrando...' : 'Confirmar Venda'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
