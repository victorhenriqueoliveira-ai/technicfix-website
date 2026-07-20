# TechSpec — Correções, Estabilização e Aperfeiçoamentos do Technicfix

## Executive Summary

Esta especificação cobre 12 features organizadas em três grupos sequenciais (Confiabilidade → Qualidade de código → Features novas), conforme ADR-001. A abordagem técnica prioriza zero novas dependências de terceiros: o filtro de preço usa o `@base-ui/react` já instalado, o carrossel usa CSS scroll snap nativo, e a validação de env vars usa Zod (já instalado) via `instrumentation.ts` oficial do Next.js 15.

O principal trade-off é o carrossel CSS-only (ADR-004): o componente permanece Server Component sem JS adicional no cliente, mas desktop users precisam de scroll horizontal com trackpad/shift+scroll em vez de botões prev/next. Dado que o tráfego é majoritariamente mobile, este trade-off é aceitável.

---

## System Architecture

### Component Overview

**Novos arquivos:**

| Arquivo | Tipo | Responsabilidade |
|---|---|---|
| `lib/env.ts` | Módulo server | Schema Zod + validação + exportação do objeto `env` tipado |
| `app/instrumentation.ts` | Next.js hook | Importa `lib/env.ts` no boot, antes de qualquer rota |
| `components/catalog/PriceFilter.tsx` | Client Component | Slider de faixa de preço com @base-ui/react, atualiza URL ao soltar handle |
| `components/admin/DashboardLeadsCharts.tsx` | Client Component | 3 gráficos de leads com seletor de período (Recharts) |
| `docs/adr/001-nextauth-beta.md` | Documentação | ADR sobre risco do NextAuth v5 beta e critérios de upgrade |

**Arquivos modificados:**

| Arquivo | Mudança |
|---|---|
| `lib/types.ts` | Adicionar `ProductWithCategory` e tipos de leads para dashboard |
| `actions/leads.ts` | Substituir `.catch()` por retry 3x com backoff exponencial |
| `app/sitemap.ts` | Corrigir `lastModified` para usar `updatedAt` real; verificar filtro de status |
| `app/(public)/produtos/page.tsx` | Adicionar searchParams `minPrice`/`maxPrice`; renderizar `PriceFilter`; canonical quando `categoria` ativo |
| `app/(public)/categorias/[slug]/page.tsx` | Converter de `redirect()` para Server Component com header + grid de produtos |
| `app/(admin)/admin/page.tsx` | Adicionar queries de leads (volume, tipo, funil); passar props ao `DashboardLeadsCharts` |
| `components/catalog/RelatedProducts.tsx` | Converter grid para flex + CSS scroll snap |
| `components/layout/Header.tsx` | Remover bloco comentado do CategoryNav (linhas 78–83) |
| `components/home/BenefitsBar.tsx` | Remover item "Frete" comentado (linhas 4–8) |
| `components/home/Hero.tsx` | Substituir `style={{ height: '650px' }}` por `className="h-[650px]"` |
| `app/(admin)/admin/produtos/page.tsx` | Envolver `<table>` em `<div className="overflow-x-auto">` |
| `app/(admin)/admin/categorias/page.tsx` | Envolver `<table>` em `<div className="overflow-x-auto">` |

**Fluxo de dados — F1 (env vars):**
```
next start
  └→ instrumentation.ts::register()
       └→ import lib/env.ts
            └→ z.safeParse(process.env)
                 ├─ sucesso → export env (objeto tipado)
                 └─ falha → throw Error (servidor não aceita tráfego)
```

**Fluxo de dados — F2 (retry Resend):**
```
submitLead() Server Action
  └→ db.lead.create() — persiste o lead
  └→ sendEmailWithRetry(payload) — void, assíncrono (não awaited)
       └→ tentativa 1 → falha → aguarda 1s
       └→ tentativa 2 → falha → aguarda 2s
       └→ tentativa 3 → falha → console.error estruturado
```

**Fluxo de dados — F10 (filtro de preço):**
```
Usuário arrasta slider
  └→ PriceFilter (Client) → estado local [min, max]
       └→ onValueCommitted → router.push(`/produtos?...&minPrice=X&maxPrice=Y`)
            └→ produtos/page.tsx (Server) → Prisma WHERE price BETWEEN X AND Y
```

---

## Implementation Design

### Core Interfaces

```typescript
// lib/env.ts
import { z } from 'zod'

const schema = z.object({
  // Server-only
  DATABASE_URL:          z.string().url(),
  RESEND_API_KEY:        z.string().min(1),
  UPLOADTHING_TOKEN:     z.string().min(1),
  AUTH_SECRET:           z.string().min(1),
  R2_ACCOUNT_ID:         z.string().min(1),
  R2_ACCESS_KEY_ID:      z.string().min(1),
  R2_SECRET_ACCESS_KEY:  z.string().min(1),
  R2_BUCKET_NAME:        z.string().min(1),
  // Públicas (prefixo NEXT_PUBLIC_)
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().min(1),
  NEXT_PUBLIC_SITE_URL:        z.string().url(),
})

const parsed = schema.safeParse(process.env)
if (!parsed.success) {
  console.error('[Technicfix] Env inválida:\n', parsed.error.flatten().fieldErrors)
  throw new Error('[Technicfix] Configuração de ambiente incompleta.')
}
export const env = parsed.data
export type Env = z.infer<typeof schema>
```

```typescript
// lib/types.ts — novos tipos adicionados

export interface ProductWithCategory {
  id: string
  name: string
  slug: string
  price: Decimal | number | null
  images: string[]
  featured: boolean
  showPrice: boolean
  category: { name: string; slug: string }
}

export interface LeadsByDay    { date: string; total: number }
export interface LeadsByType   { date: string; varejo: number; atacado: number; geral: number }
export interface LeadFunnel    { status: string; count: number }
```

```typescript
// Retry helper (inline em actions/leads.ts)
async function sendEmailWithRetry(payload: EmailPayload, attempts = 3): Promise<void> {
  for (let i = 0; i < attempts; i++) {
    try {
      await resend.emails.send(payload)
      return
    } catch (err) {
      if (i === attempts - 1) {
        console.error('[leads] Resend falhou após', attempts, 'tentativas:', err)
        return
      }
      await new Promise((r) => setTimeout(r, 1000 * 2 ** i)) // 1s, 2s
    }
  }
}
```

### Data Models

Nenhuma migração de schema Prisma é necessária. Os tipos `LeadsByDay`, `LeadsByType` e `LeadFunnel` são derivados de queries agregadas via `db.lead.groupBy()`.

**Queries de leads para o dashboard (novas em `app/(admin)/admin/page.tsx`):**

```typescript
// Volume diário (últimos N dias)
db.lead.groupBy({
  by: ['createdAt'],
  _count: { id: true },
  where: { createdAt: { gte: startDate } },
  orderBy: { createdAt: 'asc' },
})

// Composição por tipo
db.lead.groupBy({
  by: ['type', 'createdAt'],
  _count: { id: true },
  where: { createdAt: { gte: startDate } },
})

// Funil de conversão
db.lead.groupBy({
  by: ['status'],
  _count: { id: true },
})
```

**Query Prisma — filtro de preço (modificação em `produtos/page.tsx`):**

```typescript
where: {
  status: 'ativo',
  ...(categoria ? { category: { slug: categoria } } : {}),
  ...(busca ? { name: { contains: busca, mode: 'insensitive' } } : {}),
  ...(minPrice !== undefined ? { price: { gte: new Decimal(minPrice) } } : {}),
  ...(maxPrice !== undefined ? { price: { lte: new Decimal(maxPrice) } } : {}),
}
```

Produtos com `price = null` são excluídos automaticamente pelas condições `gte`/`lte` quando o filtro está ativo.

### API Endpoints

Nenhum endpoint de API novo é adicionado. O filtro de preço e a landing page de categoria usam Server Components com `searchParams`; o dashboard de leads recebe dados via props do Server Component pai.

---

## Integration Points

### Resend (email)

- **Propósito**: Notificação de novo lead para o admin.
- **Autenticação**: `env.RESEND_API_KEY` (validado em boot via `lib/env.ts`).
- **Estratégia de retry**: 3 tentativas com backoff exponencial (delays: 1s, 2s). Não retentar se o Resend retornar 2xx (entrega confirmada). Não bloquear a resposta ao usuário.
- **Não há idempotency key**: o Resend não garante deduplicação entre tentativas se a primeira falhou após entrega; risco de email duplicado é baixo e aceito.

---

## Impact Analysis

| Componente | Tipo de Impacto | Descrição e Risco | Ação Necessária |
|---|---|---|---|
| `lib/env.ts` | Novo | Valida todas as env vars no boot; risco baixo | Criar arquivo |
| `app/instrumentation.ts` | Novo | Hook de boot do Next.js; risco baixo | Criar arquivo |
| `actions/leads.ts` | Modificado | Adiciona retry; o lead continua sendo salvo independentemente | Substituir `.catch()` por `sendEmailWithRetry()` |
| `actions/products.ts` | Modificado | Substituir `process.env.R2_*!` por `env.R2_*` | Importar e usar `env` de `lib/env.ts` |
| `components/layout/Header.tsx` | Modificado | Remove linhas 78–83 comentadas; risco zero | Deletar bloco comentado |
| `components/home/BenefitsBar.tsx` | Modificado | Remove linhas 4–8 comentadas; risco zero | Deletar bloco comentado |
| `components/home/Hero.tsx` | Modificado | Inline style → Tailwind; risco zero | Trocar `style=` por `className=` |
| `app/(admin)/admin/produtos/page.tsx` | Modificado | Wrapper overflow-x-auto; risco zero | Envolver tabela |
| `app/(admin)/admin/categorias/page.tsx` | Modificado | Wrapper overflow-x-auto; risco zero | Envolver tabela |
| `lib/types.ts` | Modificado | Adiciona `ProductWithCategory` e tipos de leads | Adicionar tipos; sem breaking change |
| `app/(public)/produtos/page.tsx` | Modificado | Novos searchParams + canonical; risco baixo | Estender query e metadata |
| `components/catalog/PriceFilter.tsx` | Novo | Client Component com @base-ui/react Slider | Criar componente |
| `app/(public)/categorias/[slug]/page.tsx` | Modificado | Substitui `redirect()` por Server Component completo; risco médio | Reescrever página |
| `components/catalog/RelatedProducts.tsx` | Modificado | Grid → flex scroll snap; risco baixo | Alterar classes do container |
| `app/sitemap.ts` | Modificado | Corrigir `lastModified` para `updatedAt`; risco baixo | Atualizar campo no map |
| `app/(admin)/admin/page.tsx` | Modificado | Adiciona 3 queries + renderiza novo componente | Estender página |
| `components/admin/DashboardLeadsCharts.tsx` | Novo | Client Component com Recharts e seletor de período | Criar componente |
| `docs/adr/001-nextauth-beta.md` | Novo | Documentação de risco; risco zero | Criar arquivo Markdown |

---

## Testing Approach

### Unit Tests

- **`lib/env.ts`**: testar que `safeParse` falha com mensagem descritiva quando cada variável obrigatória está ausente; testar que retorna objeto tipado quando todas presentes.
- **Retry helper**: testar com mock do Resend que (a) não retenta em sucesso, (b) retenta exatamente 3x em falha, (c) aguarda os delays corretos (mock de `setTimeout`).
- **`PriceFilter`**: testar que `onValueCommitted` chama `router.push` com os params corretos.

### Integration Tests

- **`produtos/page.tsx` com filtro de preço**: testar que `minPrice=50&maxPrice=200` filtra corretamente os produtos retornados pela query Prisma.
- **`categorias/[slug]/page.tsx`**: testar que a página renderiza nome da categoria e lista de produtos sem redirect.
- **`sitemap.ts`**: verificar que apenas produtos `status=ativo` aparecem e que `lastModified` é igual ao `updatedAt` do banco.

---

## Development Sequencing

### Build Order

1. **`lib/env.ts`** — sem dependências; bloqueia todos os outros itens que acessam env vars.
2. **`app/instrumentation.ts`** — depende do passo 1.
3. **Migrar `process.env.*` → `env.*`** em todos os arquivos existentes (`actions/products.ts`, `actions/leads.ts`, `components/layout/Header.tsx`, `components/layout/Footer.tsx`, `app/sitemap.ts`, etc.) — depende do passo 1.
4. **`docs/adr/001-nextauth-beta.md`** — sem dependências; pode ser feito em paralelo com 1–3.
5. **Retry em `actions/leads.ts`** — depende do passo 3 (já usa `env.RESEND_API_KEY`).
6. **Remover dead code** em `Header.tsx` e `BenefitsBar.tsx` — sem dependências; paralelo com 4–5.
7. **`ProductWithCategory` em `lib/types.ts`** — sem dependências; paralelo com 4–6.
8. **Inline style Hero.tsx** — sem dependências; paralelo com 4–7.
9. **Scroll horizontal tabelas admin** — sem dependências; paralelo com 4–8.
10. **`RelatedProducts.tsx` → carrossel CSS** — depende do passo 7 (usa `ProductSummary` de `lib/types.ts`).
11. **`PriceFilter.tsx` + extensão de `produtos/page.tsx`** — depende do passo 7 (`ProductWithCategory` em types).
12. **`categorias/[slug]/page.tsx`** — depende do passo 11 (reutiliza lógica de query de produtos com filtros).
13. **`app/sitemap.ts`** — sem dependências; pode ser feito a partir do passo 3.
14. **`DashboardLeadsCharts.tsx` + extensão de `admin/page.tsx`** — sem dependências após passo 1.

### Technical Dependencies

- **Next.js 15 com `instrumentationHook` habilitado**: verificar que `next.config.ts` não desabilita o hook (`instrumentationHook: false`). Padrão é habilitado.
- **Zod v4 já instalado**: `lib/env.ts` usa Zod diretamente sem nova instalação.
- **`@base-ui/react@^1.6.0` já instalado**: `PriceFilter` usa `@base-ui/react/Slider` sem nova instalação.
- **Recharts já instalado**: `DashboardLeadsCharts` usa Recharts sem nova instalação.

---

## Monitoring and Observability

- **Env vars**: `console.error` estruturado com `parsed.error.flatten().fieldErrors` antes de lançar o erro de boot.
- **Retry do Resend**: log estruturado após cada tentativa falha: `{ event: 'resend_retry', attempt: N, leadId, error }`. Log final após esgotar tentativas: `{ event: 'resend_exhausted', leadId }`.
- **Sitemap**: nenhum log necessário (geração é passiva e verificável via `/sitemap.xml`).

---

## Technical Considerations

### Known Risks

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Resend retorna 2xx mas não entrega (falha silenciosa do lado deles) | Baixa | Verificar dashboard do Resend periodicamente; retry não ajuda neste caso |
| `@base-ui/react` Slider sem suporte a dois handles simultâneos em versão ^1.6 | Baixa | Verificar API de range mode antes de implementar; fallback para dois inputs numéricos |
| CSS scroll snap com comportamento inconsistente em Safari iOS < 16 | Baixa | Testar em dispositivo real; `scroll-snap-type: x mandatory` tem suporte ≥ iOS 13 |
| `instrumentation.ts` não executar em modo Edge Runtime | Baixa | Garantir `NEXT_RUNTIME === 'nodejs'` na condição dentro de `register()` |
| Landing page de categoria duplicar conteúdo com `/produtos?categoria=` sem canonical | Alta (se não implementado) | Canonical em `/produtos?categoria=[slug]` é parte obrigatória da implementação de F12 (ADR-005) |

---

## Architecture Decision Records

- [ADR-001: Estrutura de entrega como PRD único com prioridade interna](adrs/adr-001.md) — PRD único com três grupos sequenciais em vez de múltiplos documentos.
- [ADR-002: Validação de env vars via instrumentation.ts + lib/env.ts](adrs/adr-002.md) — Hook de boot do Next.js 15 garante validação antes de aceitar tráfego.
- [ADR-003: Componente Slider de preço via @base-ui/react](adrs/adr-003.md) — Reutiliza dependência já instalada; sem nova lib de UI.
- [ADR-004: Carrossel de produtos relacionados via CSS scroll snap](adrs/adr-004.md) — RelatedProducts permanece Server Component; zero JS adicional no cliente.
- [ADR-005: /categorias/[slug] como URL canônica de categoria](adrs/adr-005.md) — Landing page acumula autoridade SEO; /produtos?categoria= recebe canonical reverso.
