import type { NextAuthConfig } from 'next-auth'
import { NextResponse } from 'next/server'

export const authConfig: NextAuthConfig = {
  providers: [],
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
  pages: { signIn: '/admin/login' },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user
      const { pathname } = request.nextUrl
      const isAdminRoute = pathname.startsWith('/admin')
      const isLoginPage = pathname === '/admin/login'

      if (isAdminRoute && !isLoginPage && !isLoggedIn) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
      if (isLoginPage && isLoggedIn) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      return true
    },
  },
}
