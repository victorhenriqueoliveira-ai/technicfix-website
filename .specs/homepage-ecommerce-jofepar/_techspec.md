# TechSpec: Homepage E-commerce Estilo Jofepar — TechnicFix

## Executive Summary

Este TechSpec cobre a reformulação completa da homepage e do header da TechnicFix para o padrão e-commerce estilo Jofepar: header em 3 camadas com mega-dropdown de categorias, banner full-width, barra de benefícios e seções de produto agrupadas por categoria.

As mudanças envolvem seis frentes paralelas: (1) schema Prisma com hierarquia de categorias, (2) reescrita do `Header.tsx` com novo `HeaderSearchBar`, (3) novo `Hero.tsx` full-width, (4) novo componente `BenefitsBar`, (5) novo componente `CategoryProductSection` + refatoração do `page.tsx`, e (6) atualização do admin para suportar parentId.

**Principal trade-off:** `app/(public)/layout.tsx` se torna `async` para passar categorias como props ao Header — isso elimina fetch client-side no nav mas adiciona uma query no caminho crítico de cada request. Mitigação: cache Prisma ou `unstable_cache` no fetch de categorias.

---

## System Architecture

### Component Overview

```
app/(public)/layout.tsx (async Server Component)
  ├── getCategoriesWithChildren() → CategorySummary[]
  ├── Header (categories: CategorySummary[])          ← REESCRITO
  │     ├── TopBar (Server-safe, parte do Header)
  │     ├── MainBar: logo + HeaderSearchBar + CTA WA
  │     │     └── HeaderSearchBar ('use client')      ← NOVO
  │     └── CategoryNav ('use client')                ← NOVO
  │           └── MegaDropdown por categoria-pai
  ├── <main>{children}</main>
  ├── Footer (inalterado)
  └── WhatsAppButton (inalterado)

app/(public)/page.tsx (async Server Component)        ← REFATORADO
  ├── getBanners()
  ├── getCategoriesWithProducts()                     ← NOVO FETCH
  └── getSiteConfig()
  │
  ├── Hero (banners)                                  ← REESCRITO
  ├── BenefitsBar                                     ← NOVO
  └── CategoryProductSection[] (por categoria-pai)   ← NOVO
        └── HomepageProductCard (por produto)         ← NOVO

lib/
  ├── data/categories.ts (getCategoriesWithChildren, getCategoriesWithProducts) ← NOVO
  └── types.ts (CategorySummary com children)         ← MODIFICADO

prisma/schema.prisma (parentId em Category)           ← MODIFICADO
actions/categories.ts (parentId opcional)             ← MODIFICADO
app/admin/categorias/ (UI pai/filho)                  ← MODIFICADO
```

**Fluxo de dados:**
1. `layout.tsx` busca `getCategoriesWithChildren()` → passa `categories` ao `Header`.
2. `page.tsx` busca `getCategoriesWithProducts()` → monta lista de seções de produto.
3. Ambas as queries usam Prisma direto no servidor — zero fetch client-side para dados de catálogo.
4. `HeaderSearchBar` e `CategoryNav` são Client Components apenas para interatividade (router.push, hover state).

---

## Implementation Design

### Core Interfaces

```typescript
// lib/types.ts — adições

export interface CategorySummary {
  id: string
  name: string
  slug: string
  imageUrl: string | null
  children: CategorySummary[]   // vazio para folhas; populado para raiz
}

export interface CategoryWithProducts {
  id: string
  name: string
  slug: string
  products: ProductSummary[]   // até 8 produtos por categoria
}

// Header props — novo contrato
interface HeaderProps {
  categories: CategorySummary[]
}

// CategoryProductSection props
interface CategoryProductSectionProps {
  category: CategoryWithProducts
  whatsappNumber: string
}

// HomepageProductCard props
interface HomepageProductCardProps {
  product: ProductSummary
  whatsappNumber: string
}
```

### Data Models

**Alteração em `prisma/schema.prisma`:**

```prisma
model Category {
  id        String     @id @default(cuid())
  name      String
  slug      String     @unique
  imageUrl  String?
  parentId  String?
  parent    Category?  @relation("CategoryChildren", fields: [parentId], references: [id])
  children  Category[] @relation("CategoryChildren")
  products  Product[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}
```

Migração: `npx prisma migrate dev --name add_category_parent`

**Query para o Header (`lib/data/categories.ts`):**

```typescript
export async function getCategoriesWithChildren(): Promise<CategorySummary[]> {
  const rows = await db.category.findMany({
    where: { parentId: null },
    include: { children: { orderBy: { name: 'asc' } } },
    orderBy: { name: 'asc' },
  })
  return rows.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    imageUrl: c.imageUrl ?? null,
    children: c.children.map((ch) => ({
      id: ch.id,
      name: ch.name,
      slug: ch.slug,
      imageUrl: ch.imageUrl ?? null,
      children: [],
    })),
  }))
}
```

**Query para a Homepage (`lib/data/categories.ts`):**

```typescript
export async function getCategoriesWithProducts(limit = 8): Promise<CategoryWithProducts[]> {
  const rows = await db.category.findMany({
    where: {
      parentId: null,
      products: { some: { status: 'ativo' } },
    },
    include: {
      products: {
        where: { status: 'ativo' },
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        take: limit,
        select: {
          id: true, name: true, slug: true,
          price: true, images: true, featured: true,
          badge: true, showPrice: true,
          category: { select: { name: true, slug: true } },
        },
      },
    },
    orderBy: { name: 'asc' },
  })
  return rows.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    products: c.products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price !== null ? Number(p.price) : null,
      images: p.images,
      category: p.category,
      featured: p.featured,
      badge: p.badge ?? null,
    })),
  }))
}
```

---

## Detalhamento por Componente

### `prisma/schema.prisma` + migração

- Adicionar `parentId String?`, relações `parent` e `children` ao model `Category`.
- Rodar `npx prisma migrate dev --name add_category_parent`.
- Atualizar `lib/types.ts`: adicionar `CategorySummary` (com `children`) e `CategoryWithProducts`.

---

### `lib/data/categories.ts` (NOVO)

Módulo com duas funções exportadas:
- `getCategoriesWithChildren()` — usada pelo layout.tsx para o header.
- `getCategoriesWithProducts(limit?: number)` — usada pelo page.tsx para seções da homepage.

Extrair para este módulo (em vez de inline em page.tsx) permite reutilização e testes unitários.

---

### `app/(public)/layout.tsx` (MODIFICADO)

```typescript
import { getCategoriesWithChildren } from '@/lib/data/categories'

export default async function PublicLayout({ children }) {
  const categories = await getCategoriesWithChildren().catch(() => [])
  return (
    <>
      <Header categories={categories} />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
```

- `catch(() => [])` garante que falha no fetch não quebra o layout.
- Header recebe `categories` como prop — deixa de ser self-contained.

---

### `components/layout/Header.tsx` (REESCRITO)

**Estrutura de 3 camadas:**

```
<header className="sticky top-0 z-40 shadow-md">
  {/* Camada 1 — TopBar: visível só no desktop */}
  <div className="hidden md:block bg-brand-navy-dark text-white/70 text-xs py-1.5 px-4">
    Entrega para todo o Brasil · Atendimento via WhatsApp
  </div>

  {/* Camada 2 — MainBar: logo + busca + CTA */}
  <div className="bg-white border-b border-gray-100 py-3 px-4">
    <div className="max-w-7xl mx-auto flex items-center gap-4">
      <Logo />           {/* Link / + SVG gear + "TechnicFix" */}
      <HeaderSearchBar className="flex-1 max-w-xl" />
      <WhatsAppCTA />    {/* Link wa.me com número do env */}
    </div>
  </div>

  {/* Camada 3 — CategoryNav: desktop e mobile */}
  <CategoryNav categories={categories} />
</header>
```

- Header.tsx é Server Component wrapper (não precisa de 'use client').
- `CategoryNav` e `HeaderSearchBar` são Client Components separados.
- Número WhatsApp: `process.env.NEXT_PUBLIC_WHATSAPP_NUMBER` (mantém padrão atual).

---

### `components/layout/HeaderSearchBar.tsx` (NOVO)

Client Component (`'use client'`). Input com ícone de lupa. Ao pressionar Enter ou clicar na lupa, chama `router.push('/produtos?busca=' + encodeURIComponent(value))`. Sem debounce — redireciona apenas ao submit. Limpa o input após redirect.

```typescript
'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search } from 'lucide-react'

export function HeaderSearchBar({ className }: { className?: string }) {
  const router = useRouter()
  const [value, setValue] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (value.trim()) router.push(`/produtos?busca=${encodeURIComponent(value.trim())}`)
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative">
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Buscar produtos..."
          className="w-full rounded-lg border border-gray-200 py-2 pl-4 pr-10 text-sm focus:border-brand-amber focus:outline-none"
        />
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-amber">
          <Search size={18} />
        </button>
      </div>
    </form>
  )
}
```

---

### `components/layout/CategoryNav.tsx` (NOVO)

Client Component (`'use client'`). Recebe `categories: CategorySummary[]`.

**Desktop:** `<nav>` horizontal com um item por categoria-pai. Cada item: ícone (next/image se `imageUrl`, senão círculo amber com inicial) + nome. Ao hover (`onMouseEnter`/`onMouseLeave` com estado `hoveredId: string | null`), abre painel absoluto com lista de subcategorias. Links de subcategoria: `/produtos?categoria=<slug>`.

**Mobile:** não renderizado (hidden). O menu mobile continua no Sheet do Header — CategoryNav injeta as categorias no Sheet como acordeão (`<details><summary>` ou Disclosure pattern).

Classe do wrapper: `bg-brand-navy`. Itens: `text-white text-sm font-medium px-3 py-2 hover:bg-white/10`.

Dropdown: `absolute top-full left-0 bg-white shadow-xl rounded-b-lg z-50 min-w-[180px] py-2`. Links das subcategorias: `block px-4 py-1.5 text-sm text-brand-navy hover:bg-gray-50 hover:text-brand-amber`.

---

### `components/home/Hero.tsx` (REESCRITO)

Remove `ExplodingScene` (HeroDecor). Remove overlay navy pesado. Remove heroBadge1/heroBadge2 (não usados nesta versão Jofepar).

**Nova estrutura:**

```
<section className="relative w-full overflow-hidden" style={{ height: '420px' }}>
  {/* Imagem do banner atual — ocupa 100% sem overlay */}
  <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />

  {/* Setas de navegação */}
  <button onClick={prev} className="absolute left-4 top-1/2 ..."><ChevronLeft /></button>
  <button onClick={next} className="absolute right-4 top-1/2 ..."><ChevronRight /></button>

  {/* Dots */}
  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
    {items.map((_, i) => <button key={i} onClick={() => setCurrent(i)} ... />)}
  </div>
</section>
```

Quando `banner.imageUrl` é vazio (FALLBACK_BANNER): fundo `bg-brand-amber` com texto centralizado "Fixação que não Falha".

Mantém: lógica de `current`, `useEffect` de autorotação (5s, pause no hover), array `items` com fallback.

---

### `components/home/BenefitsBar.tsx` (NOVO)

Server Component (sem hooks). 4 colunas fixas. Ícones Lucide outline: `Truck`, `MessageCircle`, `ShieldCheck`, `Package`.

```
<section className="bg-white border-b border-gray-100 py-6">
  <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
    {BENEFITS.map(b => (
      <div key={b.title} className="flex flex-col items-center text-center gap-2">
        <b.Icon className="w-8 h-8 text-brand-navy stroke-[1.5]" />
        <span className="text-sm font-bold text-brand-navy uppercase tracking-wide">{b.title}</span>
        <span className="text-xs text-gray-500">{b.description}</span>
      </div>
    ))}
  </div>
</section>
```

---

### `components/home/CategoryProductSection.tsx` (NOVO)

Server Component. Recebe `category: CategoryWithProducts` e `whatsappNumber: string`.

Não renderiza nada se `category.products.length === 0`.

```
<section className="py-10">
  <div className="max-w-7xl mx-auto px-4">
    {/* Título estilo Jofepar */}
    <div className="flex items-center gap-3 mb-6">
      <div className="w-1 h-6 bg-brand-amber" />
      <h2 className="text-xl font-black uppercase tracking-wide text-brand-navy">
        {category.name}
      </h2>
      <div className="flex-1 h-px bg-gray-200 ml-2" />
    </div>

    {/* Grid de produtos */}
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {category.products.map(p => (
        <HomepageProductCard key={p.id} product={p} whatsappNumber={whatsappNumber} />
      ))}
    </div>

    {/* Ver todos */}
    <div className="mt-6 text-right">
      <Link href={`/produtos?categoria=${category.slug}`}
        className="text-sm font-medium text-brand-amber hover:underline">
        Ver todos em {category.name} →
      </Link>
    </div>
  </div>
</section>
```

---

### `components/home/HomepageProductCard.tsx` (NOVO)

Server Component (sem interatividade além de links).

```
<div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col">
  {/* Imagem 1:1 */}
  <div className="relative aspect-square bg-gray-50">
    {product.badge && (
      <span className="absolute top-2 left-2 z-10 bg-brand-amber text-brand-navy text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
        {product.badge}
      </span>
    )}
    <img src={product.images[0] ?? ''} alt={product.name}
      className="w-full h-full object-contain p-2" loading="lazy" />
  </div>

  {/* Info */}
  <div className="p-3 flex flex-col gap-2 flex-1">
    <p className="text-sm font-medium text-brand-navy line-clamp-2">{product.name}</p>
    {product.showPrice && product.price !== null && (
      <p className="text-base font-extrabold text-brand-amber">
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
      </p>
    )}

    {/* CTAs */}
    <div className="mt-auto flex flex-col gap-1.5">
      <a href={`https://wa.me/55${whatsappNumber}?text=...${encodeURIComponent(product.name)}`}
        target="_blank" rel="noopener"
        className="flex items-center justify-center gap-2 w-full rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 transition-colors">
        <WhatsAppIcon className="w-4 h-4" /> Falar pelo WhatsApp
      </a>
      <Link href={`/produtos/${product.slug}`}
        className="text-center text-xs text-brand-navy/60 hover:text-brand-amber hover:underline py-1">
        Ver detalhes
      </Link>
    </div>
  </div>
</div>
```

`showPrice` do `ProductSummary` precisa ser adicionado a `lib/types.ts` (campo existe no schema mas não no tipo atual).

---

### `app/(public)/page.tsx` (REFATORADO)

```typescript
import { getCategoriesWithProducts } from '@/lib/data/categories'
import { Hero } from '@/components/home/Hero'
import { BenefitsBar } from '@/components/home/BenefitsBar'
import { CategoryProductSection } from '@/components/home/CategoryProductSection'

export default async function HomePage() {
  const [banners, categoriesWithProducts, config] = await Promise.all([
    getBanners(),
    getCategoriesWithProducts(8),
    getSiteConfig(),
  ])

  const whatsappNumber = config?.whatsappNumber?.replace(/\D/g, '') ?? ''

  return (
    <>
      <Hero banners={banners} />
      <BenefitsBar />
      {categoriesWithProducts.map((cat) => (
        <CategoryProductSection key={cat.id} category={cat} whatsappNumber={whatsappNumber} />
      ))}
    </>
  )
}
```

Remove: `DiferenciaisSection`, `CategoryGrid`, `FeaturedProducts`, `TechnocalhasSection`, `LeadGeneralForm`.

---

### `actions/categories.ts` (MODIFICADO)

Adicionar `parentId` opcional ao schema Zod:

```typescript
const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  imageUrl: z.string().url().optional().or(z.literal('')),
  parentId: z.string().cuid().optional().nullable(),
})
```

Em `deleteCategory`: verificar `children.length > 0` antes de deletar — retornar erro se tiver filhos.

---

### `app/admin/categorias/` (MODIFICADO)

Adicionar ao formulário de criação/edição de categoria um campo `<select>` para "Categoria-pai (opcional)". Opções: lista de categorias sem parentId (raiz). Valor vazio = categoria raiz. Sem redesign de UI — adicionar o campo ao formulário existente.

---

### `lib/types.ts` (MODIFICADO)

```typescript
export interface CategorySummary {
  id: string
  name: string
  slug: string
  imageUrl: string | null
  children: CategorySummary[]
}

export interface CategoryWithProducts {
  id: string
  name: string
  slug: string
  products: ProductSummary[]
}

// ProductSummary — adicionar showPrice
export interface ProductSummary {
  id: string
  name: string
  slug: string
  price: number | null
  images: string[]
  category: { name: string; slug: string }
  featured: boolean
  badge: string | null
  showPrice: boolean   // NOVO — já existe no schema, faltava no tipo
}
```

---

## Impact Analysis

| Componente | Tipo de Impacto | Descrição e Risco | Ação Necessária |
|---|---|---|---|
| `prisma/schema.prisma` | Modificado | +parentId nullable em Category | Migração + gerar Prisma client |
| `lib/types.ts` | Modificado | +CategorySummary, +CategoryWithProducts, +showPrice em ProductSummary | Atualizar tipo e corrigir usos |
| `lib/data/categories.ts` | Novo | Funções de fetch extraídas | Criar arquivo |
| `app/(public)/layout.tsx` | Modificado | Vira async, passa categories ao Header | Risco: falha no fetch bloqueia layout (mitigar com catch) |
| `components/layout/Header.tsx` | Reescrito | 3 camadas, recebe categories prop | Risco: regressão em todas as páginas públicas |
| `components/layout/HeaderSearchBar.tsx` | Novo | Busca com redirect para /produtos | Criar componente |
| `components/layout/CategoryNav.tsx` | Novo | Nav horizontal + mega-dropdown + mobile acordeão | Criar componente |
| `components/home/Hero.tsx` | Reescrito | Full-width sem overlay, sem ExplodingScene | Remove HeroDecor dependency |
| `components/home/BenefitsBar.tsx` | Novo | 4 benefícios fixos | Criar componente |
| `components/home/CategoryProductSection.tsx` | Novo | Seção de produto por categoria | Criar componente |
| `components/home/HomepageProductCard.tsx` | Novo | Card com WhatsApp + Ver detalhes | Criar componente |
| `app/(public)/page.tsx` | Refatorado | Nova estrutura de seções | Remove DiferenciaisSection, CategoryGrid, FeaturedProducts, TechnocalhasSection, LeadGeneralForm |
| `actions/categories.ts` | Modificado | +parentId no schema Zod, +validação na deleção | Baixo risco |
| `app/admin/categorias/` | Modificado | +select de categoria-pai no formulário | Baixo risco |
| `components/home/DiferenciaisSection.tsx` | Removido da homepage | Arquivo mantido, não importado em page.tsx | Remover import |
| `components/home/CategoryGrid.tsx` | Removido da homepage | Arquivo mantido | Remover import |
| `components/home/FeaturedProducts.tsx` | Removido da homepage | Arquivo mantido | Remover import |
| `components/home/TechnocalhasSection.tsx` | Removido da homepage | Arquivo mantido | Remover import |
| `components/home/LeadGeneralForm.tsx` | Removido da homepage | Arquivo mantido | Remover import |

---

## Testing Approach

### Unit Tests

- `getCategoriesWithChildren()`: mock Prisma, verificar que retorna apenas raízes com children populados.
- `getCategoriesWithProducts()`: mock Prisma, verificar que exclui categorias sem produtos e limita a 8 por categoria.
- `HeaderSearchBar`: renderizar, digitar texto, submeter form → verificar chamada a `router.push` com URL correta.
- `CategoryNav` desktop: renderizar com categorias mock → verificar que hover em pai abre dropdown com filhos.
- `CategoryNav` mobile: verificar que Sheet abre e exibe acordeão de categorias.
- `HomepageProductCard`: com `showPrice=false` → preço não renderizado; com `badge` → badge visível.
- `CategoryProductSection`: com `products=[]` → não renderiza nada.

### Integration Tests

- Homepage com BD mockado retornando 2 categorias com 4 produtos cada → verificar 2 seções renderizadas.
- Header com categorias vazias → nav renderiza sem erro.
- `npx tsc --noEmit` passa sem erros após todas as mudanças.

---

## Development Sequencing

### Build Order

1. **Schema + migração + types** — sem dependências. Alterar `prisma/schema.prisma`, rodar migração, atualizar `lib/types.ts`.
2. **`lib/data/categories.ts`** — depende do passo 1 (Prisma client gerado com parentId).
3. **`components/layout/HeaderSearchBar.tsx`** — sem dependências de outros passos (componente isolado).
4. **`components/layout/CategoryNav.tsx`** — depende do passo 1 (usa `CategorySummary`).
5. **`components/layout/Header.tsx` (reescrita) + `app/(public)/layout.tsx`** — depende dos passos 2, 3, 4.
6. **`components/home/HomepageProductCard.tsx`** — depende do passo 1 (`ProductSummary` com `showPrice`).
7. **`components/home/BenefitsBar.tsx`** — sem dependências (componente estático).
8. **`components/home/Hero.tsx` (reescrita)** — sem dependências externas.
9. **`components/home/CategoryProductSection.tsx`** — depende dos passos 1 e 6.
10. **`app/(public)/page.tsx` (refatoração)** — depende dos passos 2, 7, 8, 9.
11. **`actions/categories.ts` + admin** — depende do passo 1; pode ser paralelo aos passos 6–9.

### Technical Dependencies

- Prisma client regenerado (`npx prisma generate`) após migração — bloqueia passos 2 em diante.
- `NEXT_PUBLIC_WHATSAPP_NUMBER` deve estar configurado no `.env` — necessário para WhatsApp links.

---

## Monitoring and Observability

- Verificar no console do servidor: `getCategoriesWithChildren` e `getCategoriesWithProducts` não devem lançar exceções em produção.
- Monitorar tempo de resposta da homepage — query com include aninhado deve completar em < 100ms no Neon.
- Após deploy: verificar que `/` renderiza seções de produto sem erros 500.

---

## Technical Considerations

### Known Risks

- **Regressão no Header:** o Header é usado em todas as páginas públicas. Mudança de self-contained para prop-driven pode quebrar se `layout.tsx` não passar `categories`. Mitigar com prop default `categories = []`.
- **ProductSummary.showPrice não existia no tipo:** usos existentes de `ProductSummary` que não esperam `showPrice` precisam ser verificados — adicionar o campo não quebra nada, apenas enriquece.
- **Categorias sem filhos no BD ao lançar:** o mega-dropdown ficará vazio por categoria. Fallback: mostrar link `/produtos?categoria=<slug>` mesmo sem filhos (sem painel de subcategorias).
- **Hero sem imagem no BD:** FALLBACK_BANNER com fundo amber — sem quebra visual.

---

## Architecture Decision Records

- [ADR-001: Substituição Completa do Header e Homepage](adrs/adr-001.md) — Abordagem Jofepar pura (reescrita total) em vez de evolução incremental.
- [ADR-002: Hierarquia de Categorias via parentId Auto-referencial](adrs/adr-002.md) — Campo parentId nullable no model Category para estrutura pai/filho.
- [ADR-003: layout.tsx Async para Prover Dados ao Header](adrs/adr-003.md) — layout.tsx vira async Server Component para passar categorias ao Header sem fetch client-side.
