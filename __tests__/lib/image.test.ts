/**
 * Testes unitários para lib/utils/image.ts
 */

import { isValidUrl, getProductImageSrc } from '@/lib/utils/image'

describe('isValidUrl', () => {
  it('retorna true para URL HTTP válida', () => {
    expect(isValidUrl('http://example.com/imagem.jpg')).toBe(true)
  })

  it('retorna true para URL HTTPS válida', () => {
    expect(isValidUrl('https://pub-123.r2.dev/produto.jpg')).toBe(true)
  })

  it('retorna false para string que não é URL', () => {
    expect(isValidUrl('nao-e-uma-url')).toBe(false)
  })

  it('retorna false para string vazia', () => {
    expect(isValidUrl('')).toBe(false)
  })

  it('retorna false para null', () => {
    expect(isValidUrl(null)).toBe(false)
  })

  it('retorna false para undefined', () => {
    expect(isValidUrl(undefined)).toBe(false)
  })

  it('retorna false para path relativo', () => {
    expect(isValidUrl('/imagens/produto.jpg')).toBe(false)
  })
})

describe('getProductImageSrc', () => {
  it('retorna a URL do índice 0 quando válida', () => {
    const images = ['https://r2.dev/foto.jpg', 'https://r2.dev/foto2.jpg']
    expect(getProductImageSrc(images)).toBe('https://r2.dev/foto.jpg')
  })

  it('retorna a URL do índice especificado quando válida', () => {
    const images = ['https://r2.dev/foto.jpg', 'https://r2.dev/foto2.jpg']
    expect(getProductImageSrc(images, 1)).toBe('https://r2.dev/foto2.jpg')
  })

  it('retorna null para array vazio', () => {
    expect(getProductImageSrc([])).toBeNull()
  })

  it('retorna null quando a URL no índice é inválida', () => {
    expect(getProductImageSrc(['nao-e-url'])).toBeNull()
  })

  it('retorna null quando índice está fora do array', () => {
    expect(getProductImageSrc(['https://r2.dev/foto.jpg'], 5)).toBeNull()
  })

  it('retorna null quando a URL é string vazia', () => {
    expect(getProductImageSrc([''])).toBeNull()
  })
})
