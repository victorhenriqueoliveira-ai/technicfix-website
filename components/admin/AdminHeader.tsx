import { auth, signOut } from '@/auth'

export async function AdminHeader() {
  const session = await auth()
  const userEmail = session?.user?.email ?? 'Admin'

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <span className="text-sm font-medium text-gray-700">Painel Admin</span>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{userEmail}</span>
        <form
          action={async () => {
            'use server'
            await signOut({ redirectTo: '/admin/login' })
          }}
        >
          <button
            type="submit"
            className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Sair
          </button>
        </form>
      </div>
    </header>
  )
}
