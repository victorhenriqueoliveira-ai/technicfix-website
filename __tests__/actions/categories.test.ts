/**
 * Testes de integração para actions/categories.ts
 * Usa mocks do Prisma e next/cache — não conecta ao banco real
 */

// Mock do next/cache
const mockRevalidatePath = jest.fn()
jest.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}))

// Mocks do db (lib/prisma)
const mockCategoryFindUnique = jest.fn()
const mockCategoryFindFirst = jest.fn()
const mockCategoryCreate = jest.fn()
const mockCategoryUpdate = jest.fn()
const mockCategoryDelete = jest.fn()

jest.mock('@/lib/prisma', () => ({
  db: {
    category: {
      findUnique: (...args: unknown[]) => mockCategoryFindUnique(...args),
      findFirst: (...args: unknown[]) => mockCategoryFindFirst(...args),
      create: (...args: unknown[]) => mockCategoryCreate(...args),
      update: (...args: unknown[]) => mockCategoryUpdate(...args),
      delete: (...args: unknown[]) => mockCategoryDelete(...args),
    },
  },
}))

import { createCategory, updateCategory, deleteCategory } from '@/actions/categories'

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [key, value] of Object.entries(fields)) {
    fd.append(key, value)
  }
  return fd
}

beforeEach(() => {
  jest.clearAllMocks()
})

// ─── createCategory ────────────────────────────────────────────────────────

describe('createCategory', () => {
  it('cria categoria com dados válidos', async () => {
    mockCategoryFindUnique.mockResolvedValue(null) // slug não existe
    mockCategoryCreate.mockResolvedValue({ id: 'cat-1', name: 'Parafusos', slug: 'parafusos' })

    const fd = makeFormData({ name: 'Parafusos', slug: 'parafusos' })
    const result = await createCategory(fd)

    expect(result).toEqual({ success: true, id: 'cat-1' })
    expect(mockCategoryCreate).toHaveBeenCalledWith({
      data: { name: 'Parafusos', slug: 'parafusos', imageUrl: null },
    })
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/categorias')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/produtos')
  })

  it('gera slug automaticamente a partir do nome quando não fornecido', async () => {
    mockCategoryFindUnique.mockResolvedValue(null)
    mockCategoryCreate.mockResolvedValue({ id: 'cat-2', name: 'Porcas', slug: 'porcas' })

    const fd = makeFormData({ name: 'Porcas', slug: '' })
    const result = await createCategory(fd)

    expect(result.success).toBe(true)
    expect(mockCategoryCreate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ slug: 'porcas' }) })
    )
  })

  it('retorna erro para nome com menos de 2 caracteres', async () => {
    const fd = makeFormData({ name: 'P', slug: 'p' })
    const result = await createCategory(fd)

    expect(result.success).toBe(false)
    expect((result as { success: false; error: string }).error).toMatch(/2 caracteres/)
    expect(mockCategoryCreate).not.toHaveBeenCalled()
  })

  it('retorna erro quando slug já existe', async () => {
    mockCategoryFindUnique.mockResolvedValue({ id: 'cat-1', slug: 'parafusos' })

    const fd = makeFormData({ name: 'Parafusos 2', slug: 'parafusos' })
    const result = await createCategory(fd)

    expect(result.success).toBe(false)
    expect((result as { success: false; error: string }).error).toMatch(/parafusos/)
    expect(mockCategoryCreate).not.toHaveBeenCalled()
  })

  it('retorna erro para slug com caracteres inválidos', async () => {
    const fd = makeFormData({ name: 'Teste', slug: 'Slug Inválido!' })
    const result = await createCategory(fd)

    expect(result.success).toBe(false)
    expect(mockCategoryCreate).not.toHaveBeenCalled()
  })
})

// ─── updateCategory ────────────────────────────────────────────────────────

describe('updateCategory', () => {
  it('atualiza nome e slug corretamente', async () => {
    mockCategoryFindFirst.mockResolvedValue(null) // sem conflito de slug
    mockCategoryUpdate.mockResolvedValue({ id: 'cat-1', name: 'Novo Nome', slug: 'novo-nome' })

    const fd = makeFormData({ name: 'Novo Nome', slug: 'novo-nome' })
    const result = await updateCategory('cat-1', fd)

    expect(result).toEqual({ success: true, id: 'cat-1' })
    expect(mockCategoryUpdate).toHaveBeenCalledWith({
      where: { id: 'cat-1' },
      data: { name: 'Novo Nome', slug: 'novo-nome', imageUrl: null },
    })
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/categorias')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/produtos')
  })

  it('retorna erro quando slug pertence a outra categoria', async () => {
    mockCategoryFindFirst.mockResolvedValue({ id: 'cat-2', slug: 'parafusos' })

    const fd = makeFormData({ name: 'Outro Nome', slug: 'parafusos' })
    const result = await updateCategory('cat-1', fd)

    expect(result.success).toBe(false)
    expect(mockCategoryUpdate).not.toHaveBeenCalled()
  })

  it('retorna erro de validação para dados inválidos', async () => {
    const fd = makeFormData({ name: 'X', slug: 'x' })
    const result = await updateCategory('cat-1', fd)

    expect(result.success).toBe(false)
    expect(mockCategoryUpdate).not.toHaveBeenCalled()
  })
})

// ─── deleteCategory ────────────────────────────────────────────────────────

describe('deleteCategory', () => {
  it('remove categoria sem produtos associados', async () => {
    mockCategoryFindUnique.mockResolvedValue({
      id: 'cat-1',
      name: 'Parafusos',
      _count: { products: 0 },
    })
    mockCategoryDelete.mockResolvedValue({ id: 'cat-1' })

    const result = await deleteCategory('cat-1')

    expect(result).toEqual({ success: true, id: 'cat-1' })
    expect(mockCategoryDelete).toHaveBeenCalledWith({ where: { id: 'cat-1' } })
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/categorias')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/produtos')
  })

  it('retorna success: false com mensagem descritiva quando categoria possui produtos', async () => {
    mockCategoryFindUnique.mockResolvedValue({
      id: 'cat-1',
      name: 'Parafusos',
      _count: { products: 5 },
    })

    const result = await deleteCategory('cat-1')

    expect(result.success).toBe(false)
    expect((result as { success: false; error: string }).error).toMatch(/5 produto\(s\)/)
    expect(mockCategoryDelete).not.toHaveBeenCalled()
  })

  it('retorna erro quando categoria não existe', async () => {
    mockCategoryFindUnique.mockResolvedValue(null)

    const result = await deleteCategory('nao-existe')

    expect(result.success).toBe(false)
    expect((result as { success: false; error: string }).error).toMatch(/não encontrada/)
    expect(mockCategoryDelete).not.toHaveBeenCalled()
  })
})
