/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ProductCTAs } from '@/components/catalog/ProductCTAs'

// Mock do LeadFormInline para isolar testes de ProductCTAs
jest.mock('@/components/catalog/LeadFormInline', () => ({
  LeadFormInline: ({ productId }: { productId?: string }) => (
    <div data-testid="lead-form-inline" data-product-id={productId}>
      Lead Form Mock
    </div>
  ),
}))

const defaultProps = {
  productId: 'prod-123',
  productName: 'Parafuso M8 Inox',
  productType: 'ambos' as const,
  whatsappNumber: '11999998888',
  showPrice: true,
  stock: 10,
}

describe('ProductCTAs', () => {
  describe('seletor de perfil', () => {
    it('exibe seletor quando productType="ambos"', () => {
      render(<ProductCTAs {...defaultProps} productType="ambos" />)
      expect(screen.getByTestId('seletor-perfil')).toBeInTheDocument()
    })

    it('oculta seletor quando productType="varejo"', () => {
      render(<ProductCTAs {...defaultProps} productType="varejo" />)
      expect(screen.queryByTestId('seletor-perfil')).not.toBeInTheDocument()
    })

    it('oculta seletor quando productType="atacado"', () => {
      render(<ProductCTAs {...defaultProps} productType="atacado" />)
      expect(screen.queryByTestId('seletor-perfil')).not.toBeInTheDocument()
    })
  })

  describe('exibição de botões por productType', () => {
    it('exibe apenas botão varejo quando productType="varejo"', () => {
      render(<ProductCTAs {...defaultProps} productType="varejo" />)
      expect(screen.getByTestId('btn-whatsapp-varejo')).toBeInTheDocument()
      expect(screen.queryByTestId('btn-whatsapp-atacado')).not.toBeInTheDocument()
    })

    it('exibe apenas botão atacado quando productType="atacado"', () => {
      render(<ProductCTAs {...defaultProps} productType="atacado" />)
      expect(screen.getByTestId('btn-whatsapp-atacado')).toBeInTheDocument()
      expect(screen.queryByTestId('btn-whatsapp-varejo')).not.toBeInTheDocument()
    })

    it('exibe botão varejo por padrão quando productType="ambos"', () => {
      render(<ProductCTAs {...defaultProps} productType="ambos" />)
      expect(screen.getByTestId('btn-whatsapp-varejo')).toBeInTheDocument()
      expect(screen.queryByTestId('btn-whatsapp-atacado')).not.toBeInTheDocument()
    })

    it('ao clicar em "Sou atacadista" exibe botão atacado', () => {
      render(<ProductCTAs {...defaultProps} productType="ambos" />)
      fireEvent.click(screen.getByTestId('btn-perfil-atacado'))
      expect(screen.getByTestId('btn-whatsapp-atacado')).toBeInTheDocument()
      expect(screen.queryByTestId('btn-whatsapp-varejo')).not.toBeInTheDocument()
    })
  })

  describe('link WhatsApp', () => {
    it('link varejo contém wa.me/55{whatsappNumber} e encodeURIComponent(productName)', () => {
      render(<ProductCTAs {...defaultProps} productType="varejo" />)
      const link = screen.getByTestId('btn-whatsapp-varejo')
      const href = link.getAttribute('href') ?? ''
      expect(href).toContain('wa.me/5511999998888')
      expect(href).toContain(encodeURIComponent('Parafuso M8 Inox'))
    })

    it('link atacado contém wa.me/55{whatsappNumber} e mensagem de orçamento', () => {
      render(<ProductCTAs {...defaultProps} productType="atacado" />)
      const link = screen.getByTestId('btn-whatsapp-atacado')
      const href = link.getAttribute('href') ?? ''
      expect(href).toContain('wa.me/5511999998888')
      expect(href).toContain(encodeURIComponent('Parafuso M8 Inox'))
      expect(href).toContain(encodeURIComponent('orçamento'))
    })

    it('href do botão WhatsApp muda para mensagem de orçamento ao selecionar atacadista', () => {
      render(<ProductCTAs {...defaultProps} productType="ambos" />)

      // Inicialmente varejo
      expect(screen.getByTestId('btn-whatsapp-varejo').getAttribute('href')).toContain('interesse')

      // Ao selecionar atacadista
      fireEvent.click(screen.getByTestId('btn-perfil-atacado'))
      expect(screen.getByTestId('btn-whatsapp-atacado').getAttribute('href')).toContain('or%C3%A7amento')
    })

    it('número não é hardcodado — usa whatsappNumber da prop', () => {
      render(<ProductCTAs {...defaultProps} productType="varejo" whatsappNumber="21988887777" />)
      const link = screen.getByTestId('btn-whatsapp-varejo')
      expect(link.getAttribute('href')).toContain('wa.me/5521988887777')
      expect(link.getAttribute('href')).not.toContain('11999998888')
    })
  })

  describe('stock=0', () => {
    it('exibe badge Indisponível quando stock=0', () => {
      render(<ProductCTAs {...defaultProps} stock={0} />)
      expect(screen.getByTestId('badge-indisponivel')).toBeInTheDocument()
      expect(screen.getByTestId('badge-indisponivel')).toHaveTextContent('Indisponível')
    })

    it('botão varejo não possui href quando stock=0', () => {
      render(<ProductCTAs {...defaultProps} productType="varejo" stock={0} />)
      const link = screen.getByTestId('btn-whatsapp-varejo')
      expect(link.getAttribute('href')).toBeNull()
    })

    it('botão atacado não possui href quando stock=0', () => {
      render(<ProductCTAs {...defaultProps} productType="atacado" stock={0} />)
      const link = screen.getByTestId('btn-whatsapp-atacado')
      expect(link.getAttribute('href')).toBeNull()
    })

    it('LeadFormInline ainda é renderizado com stock=0', () => {
      render(<ProductCTAs {...defaultProps} stock={0} />)
      expect(screen.getByTestId('lead-form-inline')).toBeInTheDocument()
    })

    it('não exibe badge Indisponível com stock>0', () => {
      render(<ProductCTAs {...defaultProps} stock={5} />)
      expect(screen.queryByTestId('badge-indisponivel')).not.toBeInTheDocument()
    })
  })

  describe('integração com LeadFormInline', () => {
    it('renderiza LeadFormInline com productId correto', () => {
      render(<ProductCTAs {...defaultProps} productId="prod-xyz" />)
      expect(screen.getByTestId('lead-form-inline')).toHaveAttribute('data-product-id', 'prod-xyz')
    })
  })
})
