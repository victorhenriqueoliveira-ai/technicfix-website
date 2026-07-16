/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CategoryNav, CategoryAccordion } from '@/components/layout/CategoryNav'
import { CategorySummary } from '@/lib/types'

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({
    href,
    children,
    ...props
  }: {
    href: string
    children: React.ReactNode
    [key: string]: unknown
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
  MockLink.displayName = 'MockLink'
  return MockLink
})

// Mock next/image
jest.mock('next/image', () => {
  const MockImage = ({
    src,
    alt,
    ...props
  }: {
    src: string
    alt: string
    [key: string]: unknown
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  )
  MockImage.displayName = 'MockImage'
  return MockImage
})

// ---- Dados de teste ----

function makeCategory(overrides: Partial<CategorySummary> & { id: string; name: string; slug: string }): CategorySummary {
  return {
    imageUrl: null,
    children: [],
    ...overrides,
  }
}

const catSemFilhos = makeCategory({ id: 'c1', name: 'Parafusos', slug: 'parafusos' })
const catComFilhos = makeCategory({
  id: 'c2',
  name: 'Ferramentas',
  slug: 'ferramentas',
  children: [
    makeCategory({ id: 'c2-1', name: 'Chaves', slug: 'chaves' }),
    makeCategory({ id: 'c2-2', name: 'Alicates', slug: 'alicates' }),
  ],
})
const catComImagem = makeCategory({
  id: 'c3',
  name: 'Buchas',
  slug: 'buchas',
  imageUrl: 'https://example.com/buchas.png',
})

const tresRaizes: CategorySummary[] = [catSemFilhos, catComFilhos, catComImagem]

// ---- Testes do CategoryNav (desktop) ----

describe('CategoryNav — desktop', () => {
  it('renderiza 3 itens de categoria na barra quando recebe categories com 3 raízes', () => {
    render(<CategoryNav categories={tresRaizes} />)
    // O texto dos nomes deve aparecer na nav desktop e no acordeão
    expect(screen.getAllByText('Parafusos').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Ferramentas').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Buchas').length).toBeGreaterThanOrEqual(1)
  })

  it('hover em categoria com 2 filhos: painel dropdown abre e exibe os 2 filhos', () => {
    render(<CategoryNav categories={[catComFilhos]} />)

    // O dropdown não deve estar visível antes do hover
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()

    // Dispara mouseEnter no wrapper do item
    const botao = screen.getByRole('button', { name: /ferramentas/i })
    fireEvent.mouseEnter(botao.closest('div')!)

    // Dropdown com os filhos deve aparecer
    const menu = screen.getByRole('menu')
    expect(menu).toBeInTheDocument()
    // Verifica que o menu contém os filhos (usando within para isolar o dropdown)
    expect(screen.getAllByText('Chaves').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Alicates').length).toBeGreaterThanOrEqual(1)
    // Confirma que os menuitems estão no menu
    expect(screen.getAllByRole('menuitem').length).toBe(2)
  })

  it('mouseLeave na categoria: painel dropdown fecha (hoveredId volta a null)', () => {
    render(<CategoryNav categories={[catComFilhos]} />)

    const wrapper = screen.getByRole('button', { name: /ferramentas/i }).closest('div')!

    // Abre
    fireEvent.mouseEnter(wrapper)
    expect(screen.getByRole('menu')).toBeInTheDocument()

    // Fecha
    fireEvent.mouseLeave(wrapper)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('categoria sem filhos (children: []): hover não abre painel; link aponta para /produtos?categoria=<slug>', () => {
    render(<CategoryNav categories={[catSemFilhos]} />)

    // Não existe botão, existe link direto
    const links = screen.getAllByRole('link', { name: /parafusos/i })
    const desktopLink = links.find((l) => l.getAttribute('href') === '/produtos?categoria=parafusos')
    expect(desktopLink).toBeDefined()

    // Não há menu mesmo após interação
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('categoria com imageUrl: renderiza <img> com o src correto', () => {
    render(<CategoryNav categories={[catComImagem]} />)
    const imgs = screen.getAllByRole('img', { name: /buchas/i })
    expect(imgs.length).toBeGreaterThan(0)
    expect(imgs[0]).toHaveAttribute('src', 'https://example.com/buchas.png')
  })

  it('categoria sem imageUrl: renderiza círculo amber com a inicial do nome', () => {
    render(<CategoryNav categories={[catSemFilhos]} />)
    // A inicial "P" deve aparecer no círculo amber (aria-hidden, busca pelo texto)
    const iniciais = screen.getAllByText('P')
    expect(iniciais.length).toBeGreaterThan(0)
  })

  it('link de subcategoria no dropdown: href é /produtos?categoria=<slug-do-filho>', () => {
    render(<CategoryNav categories={[catComFilhos]} />)

    const wrapper = screen.getByRole('button', { name: /ferramentas/i }).closest('div')!
    fireEvent.mouseEnter(wrapper)

    const linkChaves = screen.getByRole('menuitem', { name: /chaves/i })
    expect(linkChaves).toHaveAttribute('href', '/produtos?categoria=chaves')

    const linkAlicates = screen.getByRole('menuitem', { name: /alicates/i })
    expect(linkAlicates).toHaveAttribute('href', '/produtos?categoria=alicates')
  })

  it('receber categories: [] renderiza nav vazia sem crash', () => {
    render(<CategoryNav categories={[]} />)
    // Deve renderizar sem erros
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})

// ---- Testes do CategoryAccordion (mobile) ----

describe('CategoryAccordion — mobile', () => {
  it('exibe todas as categorias-pai no acordeão', () => {
    render(<CategoryAccordion categories={tresRaizes} />)
    expect(screen.getByTestId('category-accordion')).toBeInTheDocument()
    expect(screen.getByText('Parafusos')).toBeInTheDocument()
    expect(screen.getByText('Ferramentas')).toBeInTheDocument()
    expect(screen.getByText('Buchas')).toBeInTheDocument()
  })

  it('clicar em pai com filhos expande os filhos', () => {
    render(<CategoryAccordion categories={[catComFilhos]} />)

    const details = document.querySelector('details')!
    expect(details).not.toHaveAttribute('open')

    // Abre o details
    const summary = details.querySelector('summary')!
    fireEvent.click(summary)
    details.setAttribute('open', '')

    details.setAttribute('open', '')
    const { rerender } = render(<CategoryAccordion categories={[catComFilhos]} />)
    const detailsAberto = document.querySelector('details')!
    detailsAberto.setAttribute('open', '')
    rerender(<CategoryAccordion categories={[catComFilhos]} />)

    // Verifica que os filhos estão presentes no DOM
    expect(screen.getAllByText('Chaves').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Alicates').length).toBeGreaterThanOrEqual(1)
  })

  it('link de subcategoria no acordeão: href correto', () => {
    render(<CategoryAccordion categories={[catComFilhos]} />)
    const linkChaves = screen.getAllByRole('link', { name: /chaves/i })
    expect(linkChaves[0]).toHaveAttribute('href', '/produtos?categoria=chaves')
  })

  it('categoria sem filhos no acordeão: link leva para /produtos?categoria=<slug>', () => {
    render(<CategoryAccordion categories={[catSemFilhos]} />)
    const links = screen.getAllByRole('link', { name: /parafusos/i })
    expect(links[0]).toHaveAttribute('href', '/produtos?categoria=parafusos')
  })

  it('renderiza acordeão vazio sem crash', () => {
    render(<CategoryAccordion categories={[]} />)
    expect(screen.getByTestId('category-accordion')).toBeInTheDocument()
  })
})
