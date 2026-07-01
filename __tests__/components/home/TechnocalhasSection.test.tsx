/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TechnocalhasSection } from '@/components/home/TechnocalhasSection'

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

describe('TechnocalhasSection', () => {
  it('exibe o texto de descrição recebido como prop', () => {
    render(
      <TechnocalhasSection
        siteConfig={{
          technocalhasDescription: 'Especialistas em calhas e coberturas metálicas.',
          technocalhasUrl: 'https://technocalhas.com.br',
        }}
      />
    )
    expect(
      screen.getByText('Especialistas em calhas e coberturas metálicas.')
    ).toBeInTheDocument()
  })

  it('renderiza o logo TC', () => {
    render(
      <TechnocalhasSection
        siteConfig={{
          technocalhasDescription: 'Descrição',
          technocalhasUrl: '/technocalhas',
        }}
      />
    )
    expect(screen.getByTestId('technocalhas-logo')).toHaveTextContent('TC')
  })

  it('renderiza o CTA "Conheça a Technocalhas"', () => {
    render(
      <TechnocalhasSection
        siteConfig={{
          technocalhasDescription: 'Descrição',
          technocalhasUrl: '/technocalhas',
        }}
      />
    )
    expect(screen.getByTestId('technocalhas-cta')).toHaveTextContent(
      'Conheça a Technocalhas'
    )
  })

  it('CTA linka para a URL fornecida', () => {
    render(
      <TechnocalhasSection
        siteConfig={{
          technocalhasDescription: 'Descrição',
          technocalhasUrl: 'https://technocalhas.com.br',
        }}
      />
    )
    expect(screen.getByTestId('technocalhas-cta')).toHaveAttribute(
      'href',
      'https://technocalhas.com.br'
    )
  })

  it('usa /technocalhas como href fallback quando URL está vazia', () => {
    render(
      <TechnocalhasSection
        siteConfig={{
          technocalhasDescription: 'Descrição',
          technocalhasUrl: '',
        }}
      />
    )
    expect(screen.getByTestId('technocalhas-cta')).toHaveAttribute('href', '/technocalhas')
  })

  it('não renderiza o elemento de descrição quando vazio', () => {
    render(
      <TechnocalhasSection
        siteConfig={{
          technocalhasDescription: '',
          technocalhasUrl: '/technocalhas',
        }}
      />
    )
    expect(screen.queryByTestId('technocalhas-description')).not.toBeInTheDocument()
  })

  it('renderiza o título Technocalhas', () => {
    render(
      <TechnocalhasSection
        siteConfig={{
          technocalhasDescription: 'Descrição',
          technocalhasUrl: '/technocalhas',
        }}
      />
    )
    expect(screen.getByText('Technocalhas')).toBeInTheDocument()
  })
})
