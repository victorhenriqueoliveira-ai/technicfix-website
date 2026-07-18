/**
 * Testes unitários para verificar a existência do wrapper overflow-x-auto
 * na página de listagem de produtos do admin (task_08).
 *
 * Como a página é Server Component assíncrono com dependência de DB,
 * os testes verificam a estrutura do código-fonte diretamente.
 */

import * as fs from 'fs'
import * as path from 'path'

const PAGE_PATH = path.resolve(
  __dirname,
  '../../../app/(admin)/admin/produtos/page.tsx'
)

describe('overflow-x-auto na tabela de produtos admin (task_08)', () => {
  let sourceCode: string

  beforeAll(() => {
    sourceCode = fs.readFileSync(PAGE_PATH, 'utf-8')
  })

  it('o arquivo page.tsx existe', () => {
    expect(fs.existsSync(PAGE_PATH)).toBe(true)
  })

  it('contém div com classe overflow-x-auto', () => {
    expect(sourceCode).toMatch(/className=["'][^"']*overflow-x-auto[^"']*["']/)
  })

  it('o overflow-x-auto aparece antes do elemento table', () => {
    const overflowIndex = sourceCode.indexOf('overflow-x-auto')
    const tableIndex = sourceCode.indexOf('<table')
    expect(overflowIndex).toBeGreaterThan(-1)
    expect(tableIndex).toBeGreaterThan(-1)
    expect(overflowIndex).toBeLessThan(tableIndex)
  })

  it('o elemento table é filho (indentação posterior) do div overflow-x-auto', () => {
    // Verifica que overflow-x-auto e <table aparecem no mesmo bloco de código
    const lines = sourceCode.split('\n')
    const overflowLine = lines.findIndex((l) => l.includes('overflow-x-auto'))
    const tableLine = lines.findIndex((l) => l.includes('<table'))
    // table deve vir depois do div overflow-x-auto
    expect(overflowLine).toBeGreaterThan(-1)
    expect(tableLine).toBeGreaterThan(overflowLine)
  })

  it('possui fechamento </div> após fechamento </table>', () => {
    // Verifica que existe um </div> de fechamento após o </table>
    const afterTable = sourceCode.slice(sourceCode.lastIndexOf('</table>'))
    expect(afterTable).toMatch(/<\/div>/)
  })

  it('a tabela contém as 7 colunas: Nome, Categoria, SKU, Estoque, Status, Destaque, Ações', () => {
    expect(sourceCode).toContain('Nome')
    expect(sourceCode).toContain('Categoria')
    expect(sourceCode).toContain('SKU')
    expect(sourceCode).toContain('Estoque')
    expect(sourceCode).toContain('Status')
    expect(sourceCode).toContain('Destaque')
    expect(sourceCode).toContain('Ações')
  })
})
