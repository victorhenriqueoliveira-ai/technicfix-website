/**
 * Testes unitários para lib/utils.ts
 * Cobre a função utilitária cn (classnames + tailwind-merge)
 */

import { cn } from '@/lib/utils'

describe('lib/utils.ts — função cn', () => {
  it('retorna string vazia para nenhum argumento', () => {
    expect(cn()).toBe('')
  })

  it('combina classes simples', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('ignora valores falsy', () => {
    expect(cn('foo', false, undefined, null, 'bar')).toBe('foo bar')
  })

  it('mescla classes tailwind conflitantes (tailwind-merge)', () => {
    // tailwind-merge resolve conflitos: a última vence
    const result = cn('p-4', 'p-8')
    expect(result).toBe('p-8')
  })

  it('aceita objetos de condição (clsx)', () => {
    const result = cn({ 'text-red-500': true, 'text-blue-500': false })
    expect(result).toBe('text-red-500')
  })

  it('aceita arrays de classes', () => {
    const result = cn(['flex', 'items-center'], 'gap-4')
    expect(result).toBe('flex items-center gap-4')
  })
})
