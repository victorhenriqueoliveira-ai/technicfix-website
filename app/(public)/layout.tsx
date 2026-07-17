import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/layout/WhatsAppButton'
import { getCategoriesWithChildren } from '@/lib/data/categories'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategoriesWithChildren().catch(() => [])
  return (
    <>
      <Header categories={categories} />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
