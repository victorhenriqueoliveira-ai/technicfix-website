/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

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

import SobrePage from '@/app/(public)/sobre/page'

describe('SobrePage', () => {
  it('renderiza o título da página', () => {
    render(<SobrePage />)
    expect(screen.getByRole('heading', { name: /Sobre a Technicfix/i })).toBeInTheDocument()
  })

  it('exibe a seção de história', () => {
    render(<SobrePage />)
    expect(screen.getByRole('heading', { name: /Nossa História/i })).toBeInTheDocument()
  })

  it('exibe a seção de missão e valores', () => {
    render(<SobrePage />)
    expect(screen.getByRole('heading', { name: /Missão e Valores/i })).toBeInTheDocument()
  })

  it('exibe a seção de localização', () => {
    render(<SobrePage />)
    expect(screen.getByRole('heading', { name: /Localização/i })).toBeInTheDocument()
  })

  it('exibe breadcrumb com Início > Sobre', () => {
    render(<SobrePage />)
    expect(screen.getByText('Início')).toBeInTheDocument()
    expect(screen.getByText('Sobre')).toBeInTheDocument()
  })

  it('exibe o placeholder de imagem TF', () => {
    render(<SobrePage />)
    expect(screen.getByText('TF')).toBeInTheDocument()
  })
})
