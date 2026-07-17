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

const DATA: { category: string; products: string[] }[] = [
  {
    category: 'Parafusos',
    products: [
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
    category: 'Porcas',
    products: [
      'Porca sextavada',
      'Porca travante',
      'Porca borboleta',
      'Porca cega',
      'Porca flangeada',
    ],
  },
  {
    category: 'Arruelas',
    products: [
      'Arruela lisa',
      'Arruela de pressão',
      'Arruela dentada',
      'Arruela de vedação',
    ],
  },
  {
    category: 'Buchas',
    products: [
      'Bucha de nylon',
      'Bucha S',
      'Bucha para drywall',
      'Bucha química',
      'Bucha metálica',
      'Bucha de impacto',
    ],
  },
  {
    category: 'Chumbadores',
    products: [
      'Chumbador parabolt',
      'Chumbador químico',
      'Chumbador de expansão',
      'Chumbador JA',
    ],
  },
  {
    category: 'Barras e Fixação',
    products: [
      'Barra roscada',
      'Haste roscada',
      'Vergalhão roscado',
      'Pino de fixação',
    ],
  },
  {
    category: 'Rebites',
    products: [
      'Rebite de alumínio',
      'Rebite estrutural',
      'Rebite repuxo',
    ],
  },
  {
    category: 'Ferramentas',
    products: [
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
    category: 'Itens metálicos',
    products: [
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
    category: 'EPIs',
    products: [
      'Luvas',
      'Óculos de proteção',
      'Capacete',
      'Protetor auricular',
    ],
  },
]

async function main() {
  // 1. Remove subcategorias criadas anteriormente (categories com parentId)
  const deleted = await prisma.category.deleteMany({
    where: { parentId: { not: null } },
  })
  console.log(`Subcategorias removidas: ${deleted.count}\n`)

  let totalProducts = 0

  for (const entry of DATA) {
    const cat = await prisma.category.findUnique({
      where: { slug: slugify(entry.category) },
    })

    if (!cat) {
      console.warn(`⚠ Categoria não encontrada: ${entry.category}`)
      continue
    }

    console.log(`📦 ${entry.category}`)

    for (const productName of entry.products) {
      const slug = slugify(productName)

      await prisma.product.upsert({
        where: { slug },
        update: {
          name: productName,
          categoryId: cat.id,
          status: 'ativo',
        },
        create: {
          name: productName,
          slug,
          description: productName,
          categoryId: cat.id,
          status: 'ativo',
          images: [],
          stock: 0,
          showPrice: false,
        },
      })

      console.log(`  └─ ${productName}`)
      totalProducts++
    }
  }

  console.log(`\nConcluído: ${totalProducts} produtos criados/atualizados`)
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
