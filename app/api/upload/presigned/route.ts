import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getPresignedUploadUrl } from '@/actions/products'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

export async function POST(request: NextRequest) {
  // Verificação de sessão
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  let body: { filename: string; contentType: string; sizeBytes?: number }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Corpo da requisição inválido' }, { status: 400 })
  }

  const { filename, contentType, sizeBytes } = body

  if (!filename || !contentType) {
    return NextResponse.json({ error: 'filename e contentType são obrigatórios' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json(
      { error: 'Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.' },
      { status: 400 }
    )
  }

  if (sizeBytes !== undefined && sizeBytes > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: 'Arquivo muito grande. Tamanho máximo: 5MB.' },
      { status: 400 }
    )
  }

  const result = await getPresignedUploadUrl(filename, contentType, sizeBytes)

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  return NextResponse.json(result)
}
