import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

interface CategoriasPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoriasPageProps): Promise<Metadata> {
  const { slug } = await params
  const name = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
  return {
    title: name,
    description: `Produtos da categoria ${name} na TechnicFix.`,
  }
}

export default async function CategoriasPage({ params }: CategoriasPageProps) {
  const { slug } = await params
  redirect(`/produtos?categoria=${slug}`)
}
