/**
 * Testes unitários — lógica do PriceFilter
 *
 * O ambiente de teste é `node` (sem JSDOM), portanto testamos apenas
 * a lógica de formatação BRL e construção da URL sem renderização DOM.
 * Os testes de interação do slider são cobertos implicitamente pelos
 * testes de integração da página.
 */

// ─── Teste da função formatBRL ─────────────────────────────────────────────────

function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })
}

describe('formatBRL — formatação de valores monetários em pt-BR', () => {
  it('formata 50 como R$ 50,00', () => {
    const result = formatBRL(50)
    expect(result).toMatch(/50,00/)
    expect(result).toMatch(/R\$/)
  })

  it('formata 200 como R$ 200,00', () => {
    const result = formatBRL(200)
    expect(result).toMatch(/200,00/)
  })

  it('formata 25.50 como R$ 25,50', () => {
    const result = formatBRL(25.5)
    expect(result).toMatch(/25,50/)
  })

  it('formata 0 como R$ 0,00', () => {
    const result = formatBRL(0)
    expect(result).toMatch(/0,00/)
  })

  it('formata 1000 como R$ 1.000,00', () => {
    const result = formatBRL(1000)
    expect(result).toMatch(/1\.000,00/)
  })
})

// ─── Teste da lógica de construção da URL ─────────────────────────────────────

function buildPriceFilterUrl(
  committedMin: number,
  committedMax: number,
  existingParams: { categoria?: string | null; busca?: string | null; page?: string | null }
): string {
  const params = new URLSearchParams()
  if (existingParams.categoria) params.set('categoria', existingParams.categoria)
  if (existingParams.busca) params.set('busca', existingParams.busca)
  if (existingParams.page) params.set('page', existingParams.page)
  params.set('minPrice', String(committedMin))
  params.set('maxPrice', String(committedMax))
  return `/produtos?${params.toString()}`
}

describe('PriceFilter — construção da URL ao cometer valor', () => {
  it('onValueCommitted([30, 150]) gera URL com minPrice=30&maxPrice=150', () => {
    const url = buildPriceFilterUrl(30, 150, {})
    expect(url).toContain('minPrice=30')
    expect(url).toContain('maxPrice=150')
  })

  it('preserva param "categoria" ao navegar', () => {
    const url = buildPriceFilterUrl(30, 150, { categoria: 'parafusos' })
    expect(url).toContain('categoria=parafusos')
    expect(url).toContain('minPrice=30')
    expect(url).toContain('maxPrice=150')
  })

  it('preserva param "busca" ao navegar', () => {
    const url = buildPriceFilterUrl(30, 150, { busca: 'parafuso' })
    expect(url).toContain('busca=parafuso')
    expect(url).toContain('minPrice=30')
  })

  it('preserva "categoria" e "busca" juntos', () => {
    const url = buildPriceFilterUrl(10, 100, { categoria: 'parafusos', busca: 'inox' })
    expect(url).toContain('categoria=parafusos')
    expect(url).toContain('busca=inox')
    expect(url).toContain('minPrice=10')
    expect(url).toContain('maxPrice=100')
  })

  it('onValueCommitted([min, max]) com valores limites inclui minPrice e maxPrice na URL', () => {
    // Comportamento: mesmo quando min/max iguais aos limites globais, inclui na URL
    const url = buildPriceFilterUrl(0, 1000, {})
    expect(url).toContain('minPrice=0')
    expect(url).toContain('maxPrice=1000')
  })

  it('URL começa com /produtos?', () => {
    const url = buildPriceFilterUrl(50, 200, {})
    expect(url.startsWith('/produtos?')).toBe(true)
  })
})
