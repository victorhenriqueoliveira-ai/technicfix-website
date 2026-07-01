import { redirect } from 'next/navigation'

interface CategoriasPageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoriasPage({ params }: CategoriasPageProps) {
  const { slug } = await params
  redirect(`/produtos?categoria=${slug}`)
}
