// Script para buscar imagens do Wikimedia Commons e subir no UploadThing
// Baixa cada imagem localmente com delay para evitar rate-limit, depois sobe no bucket.

import 'dotenv/config'
import { UTApi, UTFile } from 'uploadthing/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN })

// Converte URL de thumbnail Wikimedia em URL direta (sem /thumb/ e sem prefixo de tamanho)
function toDirectUrl(url) {
  // Padrão: /wikipedia/commons/thumb/X/XY/File.ext/NNNpx-File.ext
  // Destino: /wikipedia/commons/X/XY/File.ext
  const thumbMatch = url.match(
    /^(https?:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/)thumb\/([a-f0-9]\/[a-f0-9]{2}\/[^/]+)\/.+$/
  )
  if (thumbMatch) return thumbMatch[1] + thumbMatch[2]
  return url
}

// Mapeamento slug → URL de imagem (Wikimedia Commons, domínio público / CC)
// URLs convertidas para diretas (sem /thumb/)
const IMAGES = {
  // Arruelas
  'arruela-lisa':
    'https://upload.wikimedia.org/wikipedia/commons/6/6b/Plain_washer1.jpg',
  'arruela-de-pressao':
    'https://upload.wikimedia.org/wikipedia/commons/d/de/Grower01.jpg',
  'arruela-dentada':
    'https://upload.wikimedia.org/wikipedia/commons/1/19/Federringep.jpg',
  'arruela-de-vedacao':
    'https://upload.wikimedia.org/wikipedia/commons/7/74/%22sealing%22_washers_%28100757402%29.jpg',

  // Barras e Fixação
  'barra-roscada':
    'https://upload.wikimedia.org/wikipedia/commons/f/f6/ISO_metric_thread_M20.JPG',
  'haste-roscada':
    'https://upload.wikimedia.org/wikipedia/commons/9/9b/Stud_bolt_1.jpg',
  'vergalhao-roscado':
    'https://upload.wikimedia.org/wikipedia/commons/f/f6/ISO_metric_thread_M20.JPG',
  'pino-de-fixacao':
    'https://upload.wikimedia.org/wikipedia/commons/3/35/Types_Of_Anchors.png',

  // Buchas
  'bucha-s':
    'https://upload.wikimedia.org/wikipedia/commons/4/4f/Wall_plugs_plastic_%28cropped%29.jpg',
  'bucha-de-impacto':
    'https://upload.wikimedia.org/wikipedia/commons/4/4f/Wall_plugs_plastic_%28cropped%29.jpg',
  'bucha-de-nylon':
    'https://upload.wikimedia.org/wikipedia/commons/4/4f/Wall_plugs_plastic_%28cropped%29.jpg',
  'bucha-metalica':
    'https://upload.wikimedia.org/wikipedia/commons/3/35/Types_Of_Anchors.png',
  'bucha-para-drywall':
    'https://upload.wikimedia.org/wikipedia/commons/4/4f/Wall_plugs_plastic_%28cropped%29.jpg',
  'bucha-quimica':
    'https://upload.wikimedia.org/wikipedia/commons/f/fa/Varilla_roscada_y_anclaje_qu%C3%ADmico.jpg',

  // Chumbadores
  'chumbador-ja':
    'https://upload.wikimedia.org/wikipedia/commons/c/cd/Expansion_bolt_cutaway.jpg',
  'chumbador-de-expansao':
    'https://upload.wikimedia.org/wikipedia/commons/c/cd/Expansion_bolt_cutaway.jpg',
  'chumbador-parabolt':
    'https://upload.wikimedia.org/wikipedia/commons/3/35/Types_Of_Anchors.png',
  'chumbador-quimico':
    'https://upload.wikimedia.org/wikipedia/commons/f/fa/Varilla_roscada_y_anclaje_qu%C3%ADmico.jpg',

  // Ferramentas
  'furadeira':
    'https://upload.wikimedia.org/wikipedia/commons/6/60/Bosch_GBH5-40_LargeDrill.jpg',
  'parafusadeira':
    'https://upload.wikimedia.org/wikipedia/commons/3/33/CordlessDrill.jpg',

  // Parafusos
  'parafuso-allen':
    'https://upload.wikimedia.org/wikipedia/commons/5/54/Hex_bolts.jpg',
  'parafuso-autoatarraxante':
    'https://upload.wikimedia.org/wikipedia/commons/5/5a/Vis-auto-taraudeuse.jpeg',
  'parafuso-chipboard':
    'https://upload.wikimedia.org/wikipedia/commons/c/cc/Schroef.jpg',
  'parafuso-de-maquina':
    'https://upload.wikimedia.org/wikipedia/commons/4/47/Bolt-with-nut.jpg',
  'parafuso-flangeado':
    'https://upload.wikimedia.org/wikipedia/commons/9/91/Serrated_hex_flange_nut.jpg',
  'parafuso-frances':
    'https://upload.wikimedia.org/wikipedia/commons/8/88/Din_603_6.8.jpg',
  'parafuso-inox':
    'https://upload.wikimedia.org/wikipedia/commons/9/97/18-04-13-Schrauben-Schl%C3%BCssel_RRK3415_inox_bolt.jpg',
  'parafuso-para-drywall':
    'https://upload.wikimedia.org/wikipedia/commons/0/07/SelfDrillingScrewsx4.png',
  'parafuso-sextavado':
    'https://upload.wikimedia.org/wikipedia/commons/4/47/Bolt-with-nut.jpg',
  'parafuso-soberba':
    'https://upload.wikimedia.org/wikipedia/commons/c/cc/Schroef.jpg',
  'parafusos-teste':
    'https://upload.wikimedia.org/wikipedia/commons/8/8a/1_Kilo_Schrauben.jpg',

  // Porcas
  'porca-borboleta':
    'https://upload.wikimedia.org/wikipedia/commons/e/e8/Wingnut-hardware.jpg',
  'porca-cega':
    'https://upload.wikimedia.org/wikipedia/commons/5/55/Domed_cap_nut.jpg',
  'porca-flangeada':
    'https://upload.wikimedia.org/wikipedia/commons/9/91/Serrated_hex_flange_nut.jpg',
  'porca-sextavada':
    'https://upload.wikimedia.org/wikipedia/commons/f/ff/Hexagon_nuts.jpg',
  'porca-travante':
    'https://upload.wikimedia.org/wikipedia/commons/1/17/Nut2-hardware.jpg',

  // Rebites
  'rebite-de-aluminio':
    'https://upload.wikimedia.org/wikipedia/commons/6/6d/Blindnieten.JPG',
  'rebite-estrutural':
    'https://upload.wikimedia.org/wikipedia/commons/9/9d/Round_Head_Rivet.JPG',
  'rebite-repuxo':
    'https://upload.wikimedia.org/wikipedia/commons/6/6d/Blindnieten.JPG',
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// Baixa a imagem como buffer com User-Agent real para evitar bloqueio
async function downloadImage(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; TechnicfixSeed/1.0; +https://technicfix.com.br)',
      Accept: 'image/*',
    },
    redirect: 'follow',
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} GET ${url}`)
  }

  const contentType = response.headers.get('content-type') || 'image/jpeg'
  const buffer = Buffer.from(await response.arrayBuffer())
  const filename = decodeURIComponent(url.split('/').pop()).replace(/\?.*$/, '')

  return { buffer, contentType, filename }
}

async function main() {
  console.log('Buscando produtos sem imagem...\n')

  const { rows: products } = await pool.query(
    `SELECT id, name, slug FROM "Product" WHERE array_length(images, 1) IS NULL OR array_length(images, 1) = 0 ORDER BY name`
  )

  console.log(`${products.length} produtos sem imagem encontrados.\n`)

  let successCount = 0
  let skippedCount = 0
  let errorCount = 0

  for (const product of products) {
    const imageUrl = IMAGES[product.slug]

    if (!imageUrl) {
      console.log(`⚠  ${product.name} (${product.slug}) — sem mapeamento, pulando`)
      skippedCount++
      continue
    }

    process.stdout.write(`↓  ${product.name} ... `)

    try {
      // Baixa a imagem localmente
      const { buffer, contentType, filename } = await downloadImage(imageUrl)
      process.stdout.write(`baixada (${(buffer.length / 1024).toFixed(0)} KB) → `)

      // Aguarda 1s para não sobrecarregar a API do Wikimedia
      await sleep(1000)

      // Sobe no UploadThing como arquivo
      const file = new UTFile([buffer], filename, { type: contentType })
      const result = await utapi.uploadFiles(file)

      if (result.error) {
        console.log(`ERRO upload: ${result.error.message}`)
        errorCount++
        continue
      }

      const uploadedUrl = result.data.ufsUrl

      await pool.query(
        `UPDATE "Product" SET images = ARRAY[$1::text], "updatedAt" = NOW() WHERE id = $2`,
        [uploadedUrl, product.id]
      )

      console.log(`OK → ${uploadedUrl}`)
      successCount++

      // Pequena pausa entre produtos
      await sleep(500)
    } catch (err) {
      console.log(`FALHA: ${err.message}`)
      errorCount++
      await sleep(2000) // Espera mais em caso de erro (possível rate-limit)
    }
  }

  console.log(`\n✓ ${successCount} imagens enviadas`)
  if (skippedCount > 0) console.log(`⚠  ${skippedCount} sem mapeamento`)
  if (errorCount > 0) console.log(`✗ ${errorCount} erros`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await pool.end()
  })
