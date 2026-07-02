/**
 * @jest-environment jsdom
 *
 * Testes unitários de ProductForm — task_04
 * Novos campos: showPrice, productType, relatedProductIds
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

// Mock de dependências externas
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}))

jest.mock('@/lib/utils/slugify', () => ({
  slugify: (s: string) => s.toLowerCase().replace(/\s+/g, '-'),
}))

jest.mock('@/components/admin/products/ImageUploader', () => ({
  ImageUploader: ({ images, onChange }: { images: string[]; onChange: (imgs: string[]) => void }) => (
    <div data-testid="image-uploader">{images.length} imagens</div>
  ),
}))

import { ProductForm } from '@/components/admin/products/ProductForm'

const mockAction = jest.fn().mockResolvedValue({ success: true, id: 'prod-1' })

const baseCategories = [{ id: 'cat-1', name: 'Ferragens' }]

const baseInitialData = {
  id: 'prod-1',
  name: 'Parafuso M8',
  slug: 'parafuso-m8',
  description: 'Descrição do produto',
  technicalDetails: null,
  price: null,
  sku: null,
  stock: 0,
  categoryId: 'cat-1',
  featured: false,
  status: 'ativo' as const,
  images: [],
  showPrice: true,
  productType: 'ambos' as const,
  relatedProductIds: [],
}

beforeEach(() => {
  jest.clearAllMocks()
})

// ─── showPrice ────────────────────────────────────────────────────────────────

describe('ProductForm — campo showPrice', () => {
  it('renderiza checkbox showPrice marcado por padrão (sem initialData)', () => {
    render(<ProductForm categories={baseCategories} action={mockAction} />)
    const checkbox = screen.getByRole('checkbox', { name: /exibir preço/i }) as HTMLInputElement
    expect(checkbox).toBeTruthy()
    expect(checkbox.defaultChecked).toBe(true)
  })

  it('renderiza checkbox showPrice marcado quando initialData.showPrice=true', () => {
    render(
      <ProductForm
        categories={baseCategories}
        action={mockAction}
        initialData={{ ...baseInitialData, showPrice: true }}
      />
    )
    const checkbox = screen.getByRole('checkbox', { name: /exibir preço/i }) as HTMLInputElement
    expect(checkbox.defaultChecked).toBe(true)
  })

  it('renderiza checkbox showPrice desmarcado quando initialData.showPrice=false', () => {
    render(
      <ProductForm
        categories={baseCategories}
        action={mockAction}
        initialData={{ ...baseInitialData, showPrice: false }}
      />
    )
    const checkbox = screen.getByRole('checkbox', { name: /exibir preço/i }) as HTMLInputElement
    expect(checkbox.defaultChecked).toBe(false)
  })
})

// ─── productType ──────────────────────────────────────────────────────────────

describe('ProductForm — campo productType', () => {
  it('renderiza select de tipo de público com opção "Ambos" selecionada por padrão', () => {
    render(<ProductForm categories={baseCategories} action={mockAction} />)
    const select = screen.getByRole('combobox', { name: /tipo de público/i }) as HTMLSelectElement
    expect(select).toBeTruthy()
    expect(select.value).toBe('ambos')
  })

  it('renderiza select com todas as opções: Ambos, Varejo, Atacado', () => {
    render(<ProductForm categories={baseCategories} action={mockAction} />)
    expect(screen.getByRole('option', { name: 'Ambos' })).toBeTruthy()
    expect(screen.getByRole('option', { name: 'Varejo' })).toBeTruthy()
    expect(screen.getByRole('option', { name: 'Atacado' })).toBeTruthy()
  })

  it('renderiza select com valor do initialData.productType', () => {
    render(
      <ProductForm
        categories={baseCategories}
        action={mockAction}
        initialData={{ ...baseInitialData, productType: 'atacado' }}
      />
    )
    const select = screen.getByRole('combobox', { name: /tipo de público/i }) as HTMLSelectElement
    expect(select.value).toBe('atacado')
  })
})

// ─── relatedProductIds ────────────────────────────────────────────────────────

describe('ProductForm — campo relatedProductIds', () => {
  const allProducts = [
    { id: 'prod-1', name: 'Parafuso M8' },
    { id: 'prod-2', name: 'Porca M8' },
    { id: 'prod-3', name: 'Arruela M8' },
  ]

  it('não exibe lista de relacionados quando allProducts não é fornecido', () => {
    render(<ProductForm categories={baseCategories} action={mockAction} />)
    expect(screen.queryByText('Produtos relacionados')).toBeNull()
  })

  it('exibe lista de produtos quando allProducts é fornecido', () => {
    render(
      <ProductForm
        categories={baseCategories}
        action={mockAction}
        allProducts={allProducts}
      />
    )
    expect(screen.getByText('Produtos relacionados')).toBeTruthy()
  })

  it('não exibe o produto atual como opção em modo edição', () => {
    render(
      <ProductForm
        categories={baseCategories}
        action={mockAction}
        allProducts={allProducts}
        initialData={{ ...baseInitialData, id: 'prod-1' }}
      />
    )
    // prod-1 = "Parafuso M8" (produto atual) não deve aparecer
    const checkboxes = screen.getAllByRole('checkbox')
    // showPrice + prod-2 + prod-3 = 3 checkboxes (prod-1 excluído)
    const labels = screen.queryAllByText('Parafuso M8')
    // Não deve haver o label "Parafuso M8" na lista de relacionados
    // (pode aparecer no campo nome, mas não como checkbox de relacionado)
    const relatedSection = screen.getByText('Porca M8')
    expect(relatedSection).toBeTruthy()
    // Verifica que "Parafuso M8" não está como opção de relacionado
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]')
    // featured (1) + showPrice (1) + Porca M8 (1) + Arruela M8 (1) = 4 (sem Parafuso M8)
    expect(allCheckboxes.length).toBe(4)
  })

  it('permite selecionar produtos relacionados e atualiza contagem', () => {
    render(
      <ProductForm
        categories={baseCategories}
        action={mockAction}
        allProducts={allProducts}
        initialData={{ ...baseInitialData, id: 'outro-id' }}
      />
    )
    const checkboxPorca = screen.getByRole('checkbox', { name: /porca m8/i }) as HTMLInputElement
    const checkboxArruela = screen.getByRole('checkbox', { name: /arruela m8/i }) as HTMLInputElement

    expect(checkboxPorca.checked).toBe(false)
    fireEvent.click(checkboxPorca)
    expect(checkboxPorca.checked).toBe(true)

    fireEvent.click(checkboxArruela)
    expect(checkboxArruela.checked).toBe(true)

    expect(screen.getByText(/2 produto\(s\) selecionado\(s\)/)).toBeTruthy()
  })

  it('inicializa com relatedProductIds já selecionados do initialData', () => {
    render(
      <ProductForm
        categories={baseCategories}
        action={mockAction}
        allProducts={allProducts}
        initialData={{ ...baseInitialData, id: 'outro-id', relatedProductIds: ['prod-2'] }}
      />
    )
    const checkboxPorca = screen.getByRole('checkbox', { name: /porca m8/i }) as HTMLInputElement
    expect(checkboxPorca.checked).toBe(true)
    expect(screen.getByText(/1 produto\(s\) selecionado\(s\)/)).toBeTruthy()
  })
})
