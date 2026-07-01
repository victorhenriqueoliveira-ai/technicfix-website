/**
 * Testes unitários para app/api/upload/presigned/route.ts
 * Testa verificação de sessão, validação de tipo/tamanho e geração de presigned URL
 */

// Mock de auth
const mockAuth = jest.fn()
jest.mock('@/auth', () => ({
  auth: () => mockAuth(),
}))

// Mock da action getPresignedUploadUrl
const mockGetPresignedUploadUrl = jest.fn()
jest.mock('@/actions/products', () => ({
  getPresignedUploadUrl: (...args: unknown[]) => mockGetPresignedUploadUrl(...args),
}))

import { POST } from '@/app/api/upload/presigned/route'
import { NextRequest } from 'next/server'

function makeRequest(body: object): NextRequest {
  return new NextRequest('http://localhost/api/upload/presigned', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('POST /api/upload/presigned', () => {
  it('retorna 401 quando não há sessão', async () => {
    mockAuth.mockResolvedValue(null)

    const req = makeRequest({ filename: 'foto.jpg', contentType: 'image/jpeg' })
    const res = await POST(req)

    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toMatch(/autorizado/i)
  })

  it('retorna 400 para tipo MIME não permitido (com sessão válida)', async () => {
    mockAuth.mockResolvedValue({ user: { email: 'admin@test.com' } })

    const req = makeRequest({ filename: 'video.mp4', contentType: 'video/mp4' })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/não permitido/i)
  })

  it('retorna 400 para arquivo maior que 5MB (com sessão válida)', async () => {
    mockAuth.mockResolvedValue({ user: { email: 'admin@test.com' } })

    const req = makeRequest({
      filename: 'grande.jpg',
      contentType: 'image/jpeg',
      sizeBytes: 6 * 1024 * 1024,
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/grande/i)
  })

  it('retorna { url, key } para sessão válida e arquivo permitido', async () => {
    mockAuth.mockResolvedValue({ user: { email: 'admin@test.com' } })
    mockGetPresignedUploadUrl.mockResolvedValue({
      url: 'https://r2.example.com/presigned?sig=abc',
      key: 'products/123-foto.jpg',
    })

    const req = makeRequest({
      filename: 'foto.jpg',
      contentType: 'image/jpeg',
      sizeBytes: 1024 * 1024,
    })
    const res = await POST(req)

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({
      url: 'https://r2.example.com/presigned?sig=abc',
      key: 'products/123-foto.jpg',
    })
  })

  it('retorna 400 quando filename não é fornecido', async () => {
    mockAuth.mockResolvedValue({ user: { email: 'admin@test.com' } })

    const req = makeRequest({ contentType: 'image/jpeg' })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('retorna 400 quando contentType não é fornecido', async () => {
    mockAuth.mockResolvedValue({ user: { email: 'admin@test.com' } })

    const req = makeRequest({ filename: 'foto.jpg' })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })
})
