/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WhatsAppButton } from '@/components/layout/WhatsAppButton'

describe('WhatsAppButton', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('não renderiza quando NEXT_PUBLIC_WHATSAPP_NUMBER não está definido', () => {
    delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
    const { container } = render(<WhatsAppButton />)
    expect(container.firstChild).toBeNull()
  })

  it('renderiza link correto quando variável está definida', () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = '11999999999'
    render(<WhatsAppButton />)
    const link = screen.getByRole('link', { name: /whatsapp/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://wa.me/5511999999999')
  })

  it('remove caracteres não numéricos do número ao montar o link', () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = '(11) 9 9999-9999'
    render(<WhatsAppButton />)
    const link = screen.getByRole('link', { name: /whatsapp/i })
    expect(link).toHaveAttribute('href', 'https://wa.me/5511999999999')
  })

  it('renderiza o link com target _blank e rel noopener', () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = '11999999999'
    render(<WhatsAppButton />)
    const link = screen.getByRole('link', { name: /whatsapp/i })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('botão tem classes de posicionamento fixo', () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = '11999999999'
    render(<WhatsAppButton />)
    const link = screen.getByRole('link', { name: /whatsapp/i })
    expect(link.className).toContain('fixed')
    expect(link.className).toContain('bottom-6')
    expect(link.className).toContain('right-6')
  })
})
