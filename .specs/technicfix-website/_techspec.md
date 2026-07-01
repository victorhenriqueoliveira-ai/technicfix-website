# TechSpec — Technicfix Website

**Versão:** 1.0  
**Data:** 2026-07-01  
**Status:** Rascunho  
**PRD de referência:** `.specs/technicfix-website/_prd.md`

---

## Executive Summary

O Technicfix Website é uma aplicação Next.js 15 (App Router) com TypeScript, Tailwind CSS e shadcn/ui, organizada em duas zonas distintas: **storefront público** (catálogo, leads, páginas institucionais) e **painel admin privado** (gestão de produtos, categorias, banners, leads). A persistência é feita via Prisma ORM com PostgreSQL (Neon). Imagens são armazenadas no Cloudflare R2 e servidas via CDN. Autenticação do admin usa Auth.js v5 com Credentials provider (e-mail + senha).

O principal trade-off da abordagem é usar **Server Actions como camada de mutação** em vez de uma API REST separada — isso elimina a necessidade de um backend standalone, reduz boilerplate e mantém type-safety end-to-end via Prisma + TypeScript, mas significa que toda lógica de mutação reside no servidor Next.js (sem consumo externo da API no MVP). A estrutura de dados foi projetada para suportar e-commerce (SKU, estoque, preço) sem implementar checkout no MVP.

---

## System Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Vercel Edge Network                   │
│  ┌──────────────────────┐  ┌───────────────────────┐   │
│  │   Storefront (/)     │  │   Admin (/admin/*)    │   │
│  │  Server Components   │  │  Server Components    │   │
│  │  + Server Actions    │  │  + Server Actions     │   │
│  └──────────┬───────────┘  └──────────┬────────────┘   │
│             │                          │                  │
│  ┌──────────▼──────────────────────────▼────────────┐   │
│  │              Prisma ORM Layer                     │   │
│  └──────────────────────┬────────────────────────────┘  │
│                         │                                │
│  ┌──────────────────────▼────────────────────────────┐  │
│  │         PostgreSQL — Neon Serverless               │  │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Cloudflare R2 (Object Storage — imagens)         │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Auth.js v5 (middleware + session JWT cookie)     │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Storefront público:** Server Components renderizam páginas com dados do banco. Formulários de lead usam Server Actions para salvar sem API separada. Sem estado global de cliente no MVP (sem Redux, sem Zustand).

**Admin privado:** Protegido por middleware Auth.js. Server Components carregam dados. Server Actions processam CRUD. Upload de imagens usa presigned URL do R2.

**Middleware (`middleware.ts`):** Intercepta todas as requisições para `/admin/*` e redireciona para `/admin/login` se sessão ausente.

---

## Implementation Design

### Core Interfaces

```typescript
// lib/types.ts — tipos centrais compartilhados entre storefront e admin

export type LeadType = 'varejo' | 'atacado' | 'geral'
export type LeadStatus = 'novo' | 'em_atendimento' | 'convertido' | 'perdido'
export type ProductStatus = 'ativo' | 'inativo'

export interface ProductSummary {
  id: string
  name: string
  slug: string
  price: number | null
  images: string[]       // URLs do R2
  category: { name: string; slug: string }
  featured: boolean
}

export interface LeadPayload {
  type: LeadType
  name: string
  email: string
  phone: string
  productId?: string
  // campos atacado
  companyName?: string
  cnpj?: string
  estimatedVolume?: string
  desiredDeadline?: string
  message?: string
}

export interface SiteConfig {
  storeName: string
  whatsappNumber: string
  contactEmail: string
  technocalhasUrl: string
  technocalhasDescription: string
}
```

### Data Models

#### Schema Prisma

```prisma
model Category {
  id        String    @id @default(cuid())
  name      String
  slug      String    @unique
  imageUrl  String?
  products  Product[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Product {
  id               String        @id @default(cuid())
  name             String
  slug             String        @unique
  description      String
  technicalDetails String?
  price            Decimal?
  sku              String?       @unique
  stock            Int           @default(0)   // preparado para e-commerce
  images           String[]      // array de URLs R2
  featured         Boolean       @default(false)
  status           ProductStatus @default(ativo)
  category         Category      @relation(fields: [categoryId], references: [id])
  categoryId       String
  leads            Lead[]
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
}

model Lead {
  id              String     @id @default(cuid())
  type            LeadType
  status          LeadStatus @default(novo)
  name            String
  email           String
  phone           String
  companyName     String?
  cnpj            String?
  estimatedVolume String?
  desiredDeadline String?
  message         String?
  notes           String?    // anotações internas do admin
  product         Product?   @relation(fields: [productId], references: [id])
  productId       String?
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
}

model Banner {
  id          String   @id @default(cuid())
  imageUrl    String
  title       String
  subtitle    String?
  ctaText     String?
  ctaUrl      String?
  order       Int      @default(0)
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model SiteConfig {
  id                      String @id @default("singleton")
  storeName               String @default("Technicfix")
  whatsappNumber          String @default("")
  contactEmail            String @default("")
  technocalhasUrl         String @default("")
  technocalhasDescription String @default("")
  updatedAt               DateTime @updatedAt
}

model AdminUser {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}

enum ProductStatus { ativo inativo }
enum LeadType     { varejo atacado geral }
enum LeadStatus   { novo em_atendimento convertido perdido }
```

### API Endpoints

O MVP usa **Server Actions** para todas as mutações. As únicas rotas HTTP explícitas são:

| Método | Caminho | Descrição |
|--------|---------|-----------|
| `POST` | `/api/upload/presigned` | Gera presigned PUT URL para upload de imagem no R2 (protegida por sessão admin) |
| `GET`  | `/api/sitemap.xml` | Sitemap dinâmico com produtos e categorias |
| `GET`  | `/robots.txt` | Robots via `app/robots.ts` |

**Server Actions (arquivo → função):**

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `actions/leads.ts` | `submitLead(payload)` | Valida e salva lead no banco |
| `actions/products.ts` | `createProduct`, `updateProduct`, `deleteProduct` | CRUD de produtos (admin) |
| `actions/categories.ts` | `createCategory`, `updateCategory`, `deleteCategory` | CRUD de categorias (admin) |
| `actions/banners.ts` | `createBanner`, `updateBanner`, `deleteBanner`, `reorderBanners` | CRUD e reordenação de banners |
| `actions/leads-admin.ts` | `updateLeadStatus`, `updateLeadNotes` | Atualização de leads pelo admin |
| `actions/config.ts` | `updateSiteConfig` | Atualiza configurações do site |

---

## Estrutura de Rotas (App Router)

```
app/
├── (public)/                          # grupo — layout público (header + footer)
│   ├── page.tsx                       # Homepage
│   ├── produtos/
│   │   ├── page.tsx                   # Catálogo com filtros
│   │   └── [slug]/page.tsx            # Detalhe do produto
│   ├── categorias/[slug]/page.tsx     # Catálogo filtrado por categoria
│   ├── sobre/page.tsx
│   ├── contato/page.tsx
│   └── technocalhas/page.tsx
├── admin/
│   ├── login/page.tsx                 # Tela de login (pública)
│   ├── layout.tsx                     # Layout admin (sidebar + verificação de sessão)
│   ├── page.tsx                       # Dashboard
│   ├── produtos/
│   │   ├── page.tsx                   # Listagem
│   │   ├── novo/page.tsx
│   │   └── [id]/editar/page.tsx
│   ├── categorias/page.tsx
│   ├── banners/page.tsx
│   ├── leads/
│   │   ├── page.tsx                   # Listagem
│   │   └── [id]/page.tsx              # Detalhe
│   └── configuracoes/page.tsx
├── api/
│   └── upload/presigned/route.ts
├── sitemap.ts
├── robots.ts
└── layout.tsx                         # Root layout (fontes, providers)
```

---

## Integration Points

### Cloudflare R2

- **Propósito:** armazenamento de imagens de produtos e banners
- **Auth:** Access Key ID + Secret Access Key via variáveis de ambiente; S3-compatible SDK
- **Fluxo de upload:**
  1. Admin seleciona imagem no browser
  2. Server Action `/api/upload/presigned` gera presigned PUT URL (validade: 60s)
  3. Browser envia imagem diretamente ao R2 via PUT (sem passar pelo Vercel)
  4. URL pública do objeto é salva no banco (campo `images[]` ou `imageUrl`)
- **Domínio público:** configurado no `next.config.ts` em `images.remotePatterns`

### Auth.js v5

- **Propósito:** autenticação do painel admin
- **Provider:** Credentials (e-mail + senha, hash bcryptjs)
- **Sessão:** JWT em cookie HttpOnly `__Secure-authjs.session-token`
- **Middleware:** protege `/admin/*` exceto `/admin/login`

---

## Impact Analysis

| Componente | Tipo de Impacto | Descrição e Risco | Ação Necessária |
|-----------|----------------|-------------------|-----------------|
| Banco de dados (Neon) | Novo | Schema completo criado do zero | `prisma migrate dev` + seed inicial |
| Vercel | Novo | Configurar variáveis de ambiente e domínio | Setup no dashboard Vercel |
| Cloudflare R2 | Novo | Criação de bucket e chaves de API | Configuração manual no Cloudflare |
| next/image | Novo | Adicionar domínio R2 ao `remotePatterns` | `next.config.ts` |
| middleware.ts | Novo | Proteção de rotas admin — risco baixo | Implementar e testar cobertura de rotas |

---

## Testing Approach

### Unit Tests

- Validação dos schemas Zod de `LeadPayload` (campos obrigatórios, formato CNPJ)
- Funções utilitárias: `slugify`, formatação de preço
- Ferramenta: Vitest

### Integration Tests

- Server Actions de lead: `submitLead` cria registro no banco com tipo correto
- Auth: login com credenciais válidas retorna sessão; inválidas retornam erro
- Upload: geração de presigned URL retorna URL com formato correto
- Ferramenta: Vitest + Prisma com banco de teste (schema separado)

---

## Development Sequencing

### Build Order

1. **Setup do projeto** — `create-next-app`, Tailwind, shadcn/ui, Prisma, variáveis de ambiente; sem dependências
2. **Schema do banco + seed** — definir `schema.prisma`, rodar `prisma migrate dev`, seed do AdminUser; depende do passo 1
3. **Auth.js + middleware** — configurar `auth.ts`, `middleware.ts`, página de login `/admin/login`; depende dos passos 1 e 2
4. **Layout público (header/footer)** — componentes de navegação, botão WhatsApp flutuante, layout responsivo; depende do passo 1
5. **Homepage** — seções: Hero (banners estáticos), Categorias, Produtos em Destaque, Technocalhas, Depoimentos, Formulário de Lead Geral; depende dos passos 2 e 4
6. **Catálogo e detalhe de produto** — listagem paginada, filtros, busca, página de detalhe com CTAs de lead; depende dos passos 2 e 4
7. **Server Action de lead + formulários** — `submitLead`, modais de lead varejo e atacado com pré-população do produto; depende dos passos 2 e 6
8. **Páginas institucionais** — Sobre, Contato (com formulário geral), Technocalhas; depende do passo 4
9. **Layout e sidebar admin** — estrutura do painel, proteção de rotas via sessão; depende do passo 3
10. **Admin — Categorias** — CRUD completo; depende dos passos 2 e 9
11. **Admin — Produtos** — CRUD com upload de imagem (presigned URL R2); depende dos passos 2, 9 e 10
12. **Admin — Banners** — CRUD com reordenação; depende dos passos 2 e 9
13. **Admin — Leads** — listagem, filtros, detalhe, atualização de status e notas; depende dos passos 2, 7 e 9
14. **Admin — Configurações** — formulário de `SiteConfig` (WhatsApp, links Technocalhas); depende dos passos 2 e 9
15. **SEO** — `generateMetadata` por página, `sitemap.ts`, `robots.ts`; depende dos passos 5, 6 e 8
16. **Integração R2 nas páginas públicas** — confirmar que URLs de imagens do R2 renderizam via `next/image`; depende dos passos 11 e 12

### Technical Dependencies

- Conta Neon criada e string de conexão disponível antes do passo 2
- Conta Cloudflare R2 configurada (bucket + chaves) antes do passo 11
- `AUTH_SECRET` gerado (`npx auth secret`) antes do passo 3

---

## Monitoring and Observability

- **Vercel Analytics:** habilitar para LCP, FID e métricas de Web Vitals por rota
- **Logs de Server Action:** logar tipo de lead e status de sucesso/erro em `actions/leads.ts` (sem PII nos logs)
- **Alerta de banco:** Neon dashboard para uso de storage — alertar manualmente se próximo de 400MB

---

## Technical Considerations

### Key Decisions

**Server Actions como camada de mutação (sem API REST separada)**
- Decisão: toda mutação via `'use server'` functions chamadas diretamente dos componentes
- Justificativa: elimina boilerplate de fetch + tipos de request/response; type-safety end-to-end via TypeScript + Prisma
- Trade-offs: sem consumo externo da API no MVP; dificulta testes de integração via HTTP puro
- Alternativas rejeitadas: API Routes em `/api/*` adicionariam uma camada extra sem benefício para o MVP

**shadcn/ui como sistema de componentes**
- Decisão: componentes shadcn/ui instalados localmente (código próprio, sem dependência de pacote)
- Justificativa: componentes acessíveis (Radix primitives), estilizáveis via Tailwind, sem runtime CSS-in-JS
- Trade-offs: cada componente precisa ser instalado explicitamente; sem tema global automático
- Alternativas rejeitadas: Chakra UI mais pesado; Tailwind puro aumentaria tempo de desenvolvimento do admin

### Known Risks

| Risco | Probabilidade | Mitigação |
|-------|--------------|-----------|
| Prisma cold start em funções serverless | Média | Usar Neon Serverless Driver + connection pooling |
| Imagens grandes impactando LCP | Alta | `next/image` com `sizes`, lazy loading e upload limitado a 5MB |
| CNPJ não validado no frontend | Baixa | Validação de formato com máscara + validação de dígitos verificadores via Zod |
| Reordenação de banners por drag-and-drop complexa | Baixa | Usar `@dnd-kit/sortable` — biblioteca leve e acessível |

---

## Architecture Decision Records

| ADR | Título | Resumo |
|-----|--------|--------|
| [ADR-001](adrs/adr-001.md) | Abordagem de Produto: Catálogo Central | Homepage com catálogo imediato; diferenciação varejo/atacado por CTAs dentro do produto |
| [ADR-002](adrs/adr-002.md) | Banco de Dados: PostgreSQL + Prisma | Neon Serverless Postgres com Prisma ORM para portabilidade de provider |
| [ADR-003](adrs/adr-003.md) | Storage de Imagens: Cloudflare R2 | Object storage S3-compatível sem custo de egress, 10GB free |
| [ADR-004](adrs/adr-004.md) | Autenticação Admin: Auth.js v5 | Credentials provider (e-mail + senha) com JWT em cookie HttpOnly |
