import { db } from '@/lib/prisma'
import { SiteConfigForm } from '@/components/admin/config/SiteConfigForm'
import type { SiteConfig } from '@/lib/types'

const defaultConfig: SiteConfig = {
  storeName: 'Technicfix',
  whatsappNumber: '',
  contactEmail: '',
  technocalhasUrl: '',
  technocalhasDescription: '',
}

export default async function ConfiguracoesPage() {
  const siteConfig = await db.siteConfig.findFirst()

  const config: SiteConfig = siteConfig
    ? {
        storeName: siteConfig.storeName,
        whatsappNumber: siteConfig.whatsappNumber,
        contactEmail: siteConfig.contactEmail,
        technocalhasUrl: siteConfig.technocalhasUrl,
        technocalhasDescription: siteConfig.technocalhasDescription,
      }
    : defaultConfig

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Configurações do Site</h1>
      <SiteConfigForm config={config} />
    </div>
  )
}
