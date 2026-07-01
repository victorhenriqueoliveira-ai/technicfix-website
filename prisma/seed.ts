import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@technicfix.com.br'
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'admin123'

  const passwordHash = await bcrypt.hash(password, 12)

  // Upsert idempotente do AdminUser
  const adminUser = await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
    },
  })

  console.log(`AdminUser criado/atualizado: ${adminUser.email}`)

  // Upsert idempotente do SiteConfig singleton
  const siteConfig = await prisma.siteConfig.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      storeName: 'Technicfix',
      whatsappNumber: '',
      contactEmail: '',
      technocalhasUrl: '',
      technocalhasDescription: '',
    },
  })

  console.log(`SiteConfig criado/atualizado: ${siteConfig.id}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
