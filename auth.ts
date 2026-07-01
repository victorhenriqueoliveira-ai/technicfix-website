import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { credentialsAuthorize } from '@/lib/credentials-authorize'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      authorize: credentialsAuthorize,
    }),
  ],
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
  pages: { signIn: '/admin/login' },
})
