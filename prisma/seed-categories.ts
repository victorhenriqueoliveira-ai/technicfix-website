import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const CATEGORIES: { name: string; children: string[] }[] = [
  {
    name: 'Parafusos',
    children: [
      'Parafuso sextavado',
      'Parafuso Allen',
      'Parafuso chipboard',
      'Parafuso autoatarraxante',
      'Parafuso para drywall',
      'Parafuso soberba',
      'Parafuso francês',
      'Parafuso de máquina',
      'Parafuso inox',
      'Parafuso flangeado',
    ],
  },
  {
    name: 'Porcas',
    children: [
      'Porca sextavada',
      'Porca travante',
      'Porca borboleta',
      'Porca cega',
      'Porca flangeada',
    ],
  },
  {
    name: 'Arruelas',
    children: [
      'Arruela lisa',
      'Arruela de pressão',
      'Arruela dentada',
      'Arruela de vedação',
    ],
  },
  {
    name: 'Buchas',
    children: [
      'Bucha de nylon',
      'Bucha S',
      'Bucha para drywall',
      'Bucha química',
      'Bucha metálica',
      'Bucha de impacto',
    ],
  },
  {
    name: 'Chumbadores',
    children: [
      'Chumbador parabolt',
      'Chumbador químico',
      'Chumbador de expansão',
      'Chumbador JA',
    ],
  },
  {
    name: 'Barras e Fixação',
    children: [
      'Barra roscada',
      'Haste roscada',
      'Vergalhão roscado',
      'Pino de fixação',
    ],
  },
  {
    name: 'Rebites',
    children: [
      'Rebite de alumínio',
      'Rebite estrutural',
      'Rebite repuxo',
    ],
  },
  {
    name: 'Ferramentas',
    children: [
      'Furadeira',
      'Parafusadeira',
      'Martelete',
      'Chave de impacto',
      'Chave Allen',
      'Chave combinada',
      'Chave inglesa',
      'Alicate universal',
      'Alicate de pressão',
      'Trena',
      'Estilete',
      'Martelo',
    ],
  },
  {
    name: 'Itens metálicos',
    children: [
      'Correntes',
      'Ganchos',
      'Mosquetões',
      'Olhais',
      'Grampos',
      'Abraçadeiras de nylon',
      'Abraçadeiras metálicas',
    ],
  },
  {
    name: 'EPIs',
    children: [
      'Luvas',
      'Óculos de proteção',
      'Capacete',
      'Protetor auricular',
    ],
  },
]

async function main() {
  console.log('Iniciando seed de categorias...\n')

  let totalParent = 0
  let totalChild = 0

  for (const cat of CATEGORIES) {
    const parentSlug = slugify(cat.name)

    const parent = await prisma.category.upsert({
      where: { slug: parentSlug },
      update: { name: cat.name },
      create: { name: cat.name, slug: parentSlug },
    })

    console.log(`✓ ${cat.name} (${parentSlug})`)
    totalParent++

    for (const childName of cat.children) {
      const childSlug = slugify(childName)

      await prisma.category.upsert({
        where: { slug: childSlug },
        update: { name: childName, parentId: parent.id },
        create: { name: childName, slug: childSlug, parentId: parent.id },
      })

      console.log(`  └─ ${childName} (${childSlug})`)
      totalChild++
    }
  }

  console.log(`\nConcluído: ${totalParent} categorias-pai · ${totalChild} subcategorias`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
