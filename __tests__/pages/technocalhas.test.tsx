/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock do db (lib/prisma)
const mockFindFirst = jest.fn()
jest.mock('@/lib/prisma', () => ({
  db: {
    siteConfig: {
      findFirst: () => mockFindFirst(),
    },
  },
}))

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
  MockLink.displayName = 'MockLink'
  return MockLink
})

// Importar a page como função async e resolver manualmente
async function renderTechnocalhasPage(config: { technocalhasDescription?: string; technocalhasUrl?: string } | null) {
  mockFindFirst.mockResolvedValue(config)

  // Importar a page dinamicamente a cada teste para pegar o mock atualizado
  jest.resetModules()

  // Re-aplicar mocks após resetModules
  jest.mock('@/lib/prisma', () => ({
    db: {
      siteConfig: {
        findFirst: () => mockFindFirst(),
      },
    },
  }))
  jest.mock('next/link', () => {
    const MockLink = ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
      <a href={href} {...props}>
        {children}
      </a>
    )
    MockLink.displayName = 'MockLink'
    return MockLink
  })

  const { default: TechnocalhasPage } = await import('@/app/(public)/technocalhas/page')
  const element = await TechnocalhasPage()
  render(element as React.ReactElement)
}

describe('TechnocalhasPage', () => {
  beforeEach(() => {
    mockFindFirst.mockReset()
  })

  it('renderiza o título Technocalhas', async () => {
    mockFindFirst.mockResolvedValue({
      technocalhasDescription: 'Descrição customizada da Technocalhas',
      technocalhasUrl: 'https://technocalhas.com.br',
    })

    const { default: TechnocalhasPage } = await import('@/app/(public)/technocalhas/page')
    const element = await TechnocalhasPage()
    render(element as React.ReactElement)

    expect(screen.getByRole('heading', { name: /Technocalhas/i })).toBeInTheDocument()
  })

  it('renderiza a descrição retornada pelo SiteConfig', async () => {
    jest.resetModules()
    jest.mock('@/lib/prisma', () => ({
      db: {
        siteConfig: {
          findFirst: () => mockFindFirst(),
        },
      },
    }))
    jest.mock('next/link', () => {
      const MockLink = ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
        <a href={href} {...props}>{children}</a>
      )
      MockLink.displayName = 'MockLink'
      return MockLink
    })

    mockFindFirst.mockResolvedValue({
      technocalhasDescription: 'Empresa especializada em calhas industriais',
      technocalhasUrl: 'https://technocalhas.com.br',
    })

    const { default: TechnocalhasPage } = await import('@/app/(public)/technocalhas/page')
    const element = await TechnocalhasPage()
    render(element as React.ReactElement)

    expect(screen.getByTestId('technocalhas-description')).toHaveTextContent(
      'Empresa especializada em calhas industriais'
    )
  })

  it('renderiza texto de fallback quando technocalhasDescription está vazio', async () => {
    jest.resetModules()
    jest.mock('@/lib/prisma', () => ({
      db: {
        siteConfig: {
          findFirst: () => mockFindFirst(),
        },
      },
    }))
    jest.mock('next/link', () => {
      const MockLink = ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
        <a href={href} {...props}>{children}</a>
      )
      MockLink.displayName = 'MockLink'
      return MockLink
    })

    mockFindFirst.mockResolvedValue(null)

    const { default: TechnocalhasPage } = await import('@/app/(public)/technocalhas/page')
    const element = await TechnocalhasPage()
    render(element as React.ReactElement)

    expect(screen.getByTestId('technocalhas-description')).toHaveTextContent(
      'Empresa especializada em calhas e perfis metálicos.'
    )
  })

  it('usa /contato como URL do CTA quando technocalhasUrl está vazio', async () => {
    jest.resetModules()
    jest.mock('@/lib/prisma', () => ({
      db: {
        siteConfig: {
          findFirst: () => mockFindFirst(),
        },
      },
    }))
    jest.mock('next/link', () => {
      const MockLink = ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
        <a href={href} {...props}>{children}</a>
      )
      MockLink.displayName = 'MockLink'
      return MockLink
    })

    mockFindFirst.mockResolvedValue({ technocalhasDescription: '', technocalhasUrl: '' })

    const { default: TechnocalhasPage } = await import('@/app/(public)/technocalhas/page')
    const element = await TechnocalhasPage()
    render(element as React.ReactElement)

    const cta = screen.getByTestId('technocalhas-cta')
    expect(cta).toHaveAttribute('href', '/contato')
  })

  it('renderiza o logo placeholder TC', async () => {
    jest.resetModules()
    jest.mock('@/lib/prisma', () => ({
      db: {
        siteConfig: {
          findFirst: () => mockFindFirst(),
        },
      },
    }))
    jest.mock('next/link', () => {
      const MockLink = ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
        <a href={href} {...props}>{children}</a>
      )
      MockLink.displayName = 'MockLink'
      return MockLink
    })

    mockFindFirst.mockResolvedValue(null)

    const { default: TechnocalhasPage } = await import('@/app/(public)/technocalhas/page')
    const element = await TechnocalhasPage()
    render(element as React.ReactElement)

    const logo = screen.getByTestId('technocalhas-logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveTextContent('TC')
  })
})
