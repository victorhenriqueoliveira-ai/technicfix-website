/**
 * Testes unitários para lib/utils/slugify.ts
 */

import { slugify } from '@/lib/utils/slugify'

describe('slugify', () => {
  it('converte texto simples em slug lowercase', () => {
    expect(slugify('Parafusos')).toBe('parafusos')
  })

  it('retorna slug correto para "Parafuso M8 Inox"', () => {
    expect(slugify('Parafuso M8 Inox')).toBe('parafuso-m8-inox')
  })

  it('remove acentos PT-BR — "Fixação & Âncoras"', () => {
    expect(slugify('Fixação & Âncoras')).toBe('fixacao-ancoras')
  })

  it('remove acentos variados', () => {
    expect(slugify('Porcas e Arruelas')).toBe('porcas-e-arruelas')
  })

  it('colapsa múltiplos espaços em um único hífen', () => {
    expect(slugify('Parafuso  M8')).toBe('parafuso-m8')
  })

  it('remove hífens no início e no fim', () => {
    expect(slugify(' -Parafuso- ')).toBe('parafuso')
  })

  it('trata string vazia', () => {
    expect(slugify('')).toBe('')
  })

  it('converte "Ê Ã Ç Ú Ó Í"', () => {
    expect(slugify('Ê Ã Ç Ú Ó Í')).toBe('e-a-c-u-o-i')
  })

  it('preserva hífens existentes', () => {
    expect(slugify('Parafuso-auto')).toBe('parafuso-auto')
  })
})
