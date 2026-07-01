/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ProductGallery } from '@/components/catalog/ProductGallery'

// Mock next/image
jest.mock('next/image', () => {
  const MockImage = ({
    src,
    alt,
    fill: _fill,
    unoptimized: _unoptimized,
    ...props
  }: {
    src: string
    alt: string
    fill?: boolean
    unoptimized?: boolean
    [key: string]: unknown
  }) => <img src={src} alt={alt} {...props} />
  MockImage.displayName = 'MockImage'
  return MockImage
})

const images = [
  'https://example.com/img1.jpg',
  'https://example.com/img2.jpg',
  'https://example.com/img3.jpg',
]

describe('ProductGallery', () => {
  it('renderiza o placeholder quando images[] está vazio', () => {
    render(<ProductGallery images={[]} productName="Produto Teste" />)
    expect(screen.getByTestId('gallery-placeholder')).toBeInTheDocument()
    expect(screen.getByText('Sem imagem')).toBeInTheDocument()
  })

  it('renderiza a imagem principal com a primeira imagem', () => {
    render(<ProductGallery images={images} productName="Parafuso M8" />)
    const mainImage = screen.getByTestId('gallery-main-image')
    expect(mainImage).toHaveAttribute('src', images[0])
  })

  it('renderiza miniaturas para todas as imagens', () => {
    render(<ProductGallery images={images} productName="Parafuso M8" />)
    expect(screen.getByTestId('gallery-thumb-0')).toBeInTheDocument()
    expect(screen.getByTestId('gallery-thumb-1')).toBeInTheDocument()
    expect(screen.getByTestId('gallery-thumb-2')).toBeInTheDocument()
  })

  it('troca a imagem principal ao clicar em uma miniatura', () => {
    render(<ProductGallery images={images} productName="Parafuso M8" />)

    const thumb1 = screen.getByTestId('gallery-thumb-1')
    fireEvent.click(thumb1)

    const mainImage = screen.getByTestId('gallery-main-image')
    expect(mainImage).toHaveAttribute('src', images[1])
  })

  it('a miniatura ativa tem aria-pressed="true"', () => {
    render(<ProductGallery images={images} productName="Parafuso M8" />)

    // Inicialmente, a primeira miniatura está ativa
    expect(screen.getByTestId('gallery-thumb-0')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('gallery-thumb-1')).toHaveAttribute('aria-pressed', 'false')

    // Clica na segunda miniatura
    fireEvent.click(screen.getByTestId('gallery-thumb-1'))

    expect(screen.getByTestId('gallery-thumb-1')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('gallery-thumb-0')).toHaveAttribute('aria-pressed', 'false')
  })

  it('não renderiza miniaturas quando há apenas uma imagem', () => {
    render(<ProductGallery images={[images[0]]} productName="Produto" />)
    expect(screen.queryByTestId('gallery-thumb-0')).not.toBeInTheDocument()
  })
})
