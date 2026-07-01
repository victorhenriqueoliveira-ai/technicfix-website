# Contexto — task_03

## Requisitos do PRD

- Painel admin com login seguro por e-mail e senha
- Rotas `/admin/*` protegidas — redirect para `/admin/login` quando não autenticado
- Autenticação não requer OAuth externo no MVP

## Especificação Técnica

### ADR-004: Auth.js v5 com Credentials provider
- `next-auth@beta` já instalado (task_01)
- Provider: Credentials (email + senha com bcryptjs)
- Sessão: JWT em cookie HttpOnly `maxAge: 8 * 60 * 60`
- `AUTH_SECRET` via variável de ambiente

### Arquivos a criar

**`auth.ts` (raiz)**
```typescript
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { db } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await db.adminUser.findUnique({
          where: { email: credentials.email as string },
        })
        if (!user) return null
        const valid = await bcrypt.compare(credentials.password as string, user.passwordHash)
        if (!valid) return null
        return { id: user.id, email: user.email }
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
  pages: { signIn: '/admin/login' },
})
```

**`middleware.ts` (raiz)**
```typescript
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = req.nextUrl.pathname === '/admin/login'

  if (isAdminRoute && !isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }
})

export const config = {
  matcher: ['/admin/:path*'],
}
```

**`app/api/auth/[...nextauth]/route.ts`**
```typescript
import { handlers } from '@/auth'
export const { GET, POST } = handlers
```

**`app/admin/login/page.tsx`** — Server Component com formulário de login (email + senha). Usar Server Action que chama `signIn('credentials', formData)`. Exibir erro quando searchParams contém `error`.

## Estado de dependências

- task_01 (integrada): next-auth@beta instalado, bcryptjs instalado, estrutura de pastas criada
- task_02 (integrada): `lib/prisma.ts` disponível com `db` exportado, modelo `AdminUser` no schema

## Importante para o worker

- Criar `auth.ts`, `middleware.ts`, `app/api/auth/[...nextauth]/route.ts`, `app/admin/login/page.tsx`
- NÃO criar outras páginas do admin (task_09)
- Criar testes unitários: credentials provider retorna null para senha errada, retorna user para credenciais válidas (mock do db)
- `bcryptjs` já está instalado — não rodar npm install
- Após implementar, verificar que TypeScript compila sem erros
