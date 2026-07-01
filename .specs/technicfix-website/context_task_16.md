# Contexto — task_16

## Requisitos do PRD

- Configurar `next/image` para aceitar URLs do Cloudflare R2 (remotePatterns no next.config.ts)
- Remover prop `unoptimized` das imagens que agora têm domínio configurado
- Validar URLs de imagem antes de passar para next/image (evitar erros de URL inválida)

## Especificação Técnica

### `next.config.ts` — remotePatterns

```typescript
import type { NextConfig } from 'next'

const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL ?? ''
const r2Hostname = R2_PUBLIC_URL ? new URL(R2_PUBLIC_URL).hostname : ''

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...(r2Hostname ? [{
        protocol: 'https' as const,
        hostname: r2Hostname,
        port: '',
        pathname: '/**',
      }] : []),
      // fallback para desenvolvimento local / placeholder genérico
      {
        protocol: 'https',
        hostname: '**.r2.dev',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
```

### Utilitário `lib/utils/image.ts`

```typescript
export function isValidUrl(url: string | null | undefined): boolean {
  if (!url) return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function getProductImageSrc(images: string[], index = 0): string | null {
  return images[index] && isValidUrl(images[index]) ? images[index] : null
}
```

### Atualizar componentes para usar `isValidUrl`

- `components/catalog/ProductCard.tsx`: usar `getProductImageSrc` — se null, renderizar `<div className="bg-gray-200">` placeholder
- `components/catalog/ProductGallery.tsx`: idem
- `components/home/CategoryGrid.tsx`: idem para `category.imageUrl`
- `components/home/Hero.tsx`: idem para `banner.imageUrl`

Em componentes onde imagem é de URL R2 (domínio configurado), remover prop `unoptimized`.
Em imagens de outros domínios desconhecidos ou URLs inválidas: mostrar placeholder.

### Verificar se `next/image` está com `unoptimized` desnecessário

Após configurar remotePatterns, remover `unoptimized` de imagens que usam URLs R2. Manter `unoptimized` apenas onde explicitamente necessário (ex: GIFs).

## Estado de dependências

- task_11 (integrada): upload R2 implementado, URLs R2 salvas nos produtos
- task_12 (integrada): banners com imageUrl de R2
- task_05, task_06 (integradas): componentes com imagens existem

## Importante para o worker

- Modificar next.config.ts, lib/utils/image.ts (criar), e os 4 componentes listados
- NÃO reescrever os componentes — apenas adicionar validação de URL e remover unoptimized onde cabe
- Criar testes unitários: isValidUrl com URLs válidas/inválidas/null, getProductImageSrc com array vazio
- NÃO executar npm install
