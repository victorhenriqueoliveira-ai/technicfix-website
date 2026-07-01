import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { credentialsAuthorize } from '@/lib/credentials-authorize'
import { authConfig } from './auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      authorize: credentialsAuthorize,
    }),
  ],
})
