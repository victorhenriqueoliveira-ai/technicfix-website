// Corrige as 3 imagens que falharam por URL errada

import 'dotenv/config'
import { UTApi, UTFile } from 'uploadthing/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN })

const FIX = [
  {
    slug: 'furadeira',
    name: 'Furadeira',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Bosch_GBH5-40_LargeDrill.jpg',
  },
  {
    slug: 'parafusadeira',
    name: 'Parafusadeira',
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/CordlessDrill.jpg',
  },
  {
    slug: 'parafuso-allen',
    name: 'Parafuso Allen',
    // Socket head cap screw — imagem da categoria Allen screws no Wikimedia
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/27/18-04-13-Schrauben-Schl%C3%BCssel_RRK3415.jpg',
  },
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function downloadImage(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; TechnicfixSeed/1.0; +https://technicfix.com.br)',
      Accept: 'image/*',
    },
    redirect: 'follow',
  })
  if (!response.ok) throw new Error(`HTTP ${response.status} GET ${url}`)
  const contentType = response.headers.get('content-type') || 'image/jpeg'
  const buffer = Buffer.from(await response.arrayBuffer())
  const filename = decodeURIComponent(url.split('/').pop()).replace(/\?.*$/, '')
  return { buffer, contentType, filename }
}

async function main() {
  for (const item of FIX) {
    process.stdout.write(`↓  ${item.name} ... `)
    try {
      const { buffer, contentType, filename } = await downloadImage(item.url)
      process.stdout.write(`${(buffer.length / 1024).toFixed(0)} KB → `)
      await sleep(1000)

      const file = new UTFile([buffer], filename, { type: contentType })
      const result = await utapi.uploadFiles(file)

      if (result.error) {
        console.log(`ERRO: ${result.error.message}`)
        continue
      }

      const uploadedUrl = result.data.ufsUrl

      await pool.query(
        `UPDATE "Product" SET images = ARRAY[$1::text], "updatedAt" = NOW() WHERE slug = $2`,
        [uploadedUrl, item.slug]
      )

      console.log(`OK → ${uploadedUrl}`)
    } catch (err) {
      console.log(`FALHA: ${err.message}`)
    }
    await sleep(1000)
  }
  console.log('\nConcluído.')
}

main()
  .catch(console.error)
  .finally(() => pool.end())
