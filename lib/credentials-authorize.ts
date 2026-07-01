import { db } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import type { User } from 'next-auth'

/**
 * Lógica de autorização do Credentials provider do Auth.js v5.
 * Valida e-mail e senha contra o AdminUser no banco de dados.
 *
 * @returns Objeto User em caso de sucesso, ou null em caso de falha.
 */
export async function credentialsAuthorize(
  credentials: Partial<Record<string, unknown>>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _request?: Request
): Promise<User | null> {
  const email = credentials?.email
  const password = credentials?.password

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return null
  }

  const user = await db.adminUser.findUnique({
    where: { email },
  })

  if (!user) return null

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) return null

  return { id: user.id, email: user.email }
}
