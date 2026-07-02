# TechSpec — Catálogo WhatsApp + Controle de Estoque + Admin Enriquecido

## Executive Summary

A implementação expande o catálogo público existente (Next.js 16 App Router, Prisma 7, PostgreSQL/Neon) adicionando CTAs de WhatsApp na página de produto, formulário de lead inline substituindo os modais atuais, seção de produtos relacionados, e um módulo completo de vendas no admin com controle de estoque e dashboard com gráficos Recharts.

O principal trade-off técnico é entre completude e risco de regressão: substituir `ProductCTAs` (componente testado) por uma nova seção unificada de CTA oferece UX mais limpa, mas exige reescrever o fluxo de lead capture — mitigado mantendo a Server Action `submitLead` existente sem alteração e adicionando testes para o novo componente.

---

## System Architecture

### Component Overview

```
[ProductPage (Server Component)]
  ├── lê: db.product.findFirst + db.siteConfig.findUnique
  ├── [ProductGallery] — sem alteração
  ├── [ProductCTAs v2] (Client Component)
  │   ├── seletor perfil (varejista/atacadista)
  │   ├── botões WhatsApp (link wa.me)
  │   └── [LeadFormInline] (Client Component)
  │       └── chama: submitLead() (Server Action existente)
  └── [RelatedProducts (Server Component)]
      └── [ProductCard] × N — sem alteração

[AdminDashboard (Server Component)]
  ├── lê: db.product.count, db.category.count, db.lead.count, db.sale.aggregate
  ├── [MetricCard] × 4 — sem alteração (+ 1 novo card)
  └── [DashboardCharts] (Client Component — Recharts)
      ├── <SalesLineChart data={salesByDay} />
      └── <TopProductsList data={topProducts} />

[AdminVendasPage (Server Component)]
  ├── lê: db.sale.findMany (com filtros)
  └── [SalesList] + [RegisterSaleDrawer] (Client Components)
      └── chama: registerSale() (nova Server Action)

[AdminProdutosPage] — sem alteração estrutural
  └── tabela: célula stock recebe classe condicional (stock ≤ 5 → badge vermelho)
```

**Fluxo de dados — registro de venda:**
```
RegisterSaleDrawer → registerSale(productId, quantity, buyerType, notes)
  → db.$transaction([
      db.sale.create(...),
      db.product.update({ stock: { decrement: quantity } })
    ])
  → revalidatePath('/admin/vendas')
  → revalidatePath('/admin/produtos')
```

**Fluxo de dados — CTA WhatsApp:**
```
ProductPage (Server)
  → busca whatsappNumber de SiteConfig
  → passa como prop para ProductCTAs
ProductCTAs (Client)
  → monta URL: https://wa.me/55{number}?text={encodeURIComponent(msg)}
  → abre em nova aba ao clicar
```

---

## Implementation Design

### Core Interfaces

```typescript
// Nova model Sale — types gerados pelo Prisma
interface Sale {
  id: string
  productId: string
  quantity: number
  buyerType: 'varejo' | 'atacado' | 'geral'
  notes: string | null
  createdAt: Date
}

// Server Action — registerSale
async function registerSale(input: {
  productId: string
  quantity: number
  buyerType: LeadType
  notes?: string
}): Promise<{ success: boolean; error?: string; newStock?: number }>

// Props do componente ProductCTAs v2
interface ProductCTAsProps {
  productId: string
  productName: string
  productType: 'varejo' | 'atacado' | 'ambos'
  whatsappNumber: string   // vem de SiteConfig via ProductPage
  showPrice: boolean       // false = "Sob consulta"
  stock: number            // 0 = indisponível
}

// Dados para o gráfico do dashboard
interface SalesByDay {
  date: string   // 'YYYY-MM-DD'
  total: number  // soma de quantity
}

interface TopProduct {
  productId: string
  productName: string
  totalSold: number
}
```

### Data Models

**Alterações no schema Prisma (`prisma/schema.prisma`):**

```prisma
model Product {
  // campos existentes mantidos
  id               String        @id @default(cuid())
  name             String
  slug             String        @unique
  description      String
  technicalDetails String?
  price            Decimal?
  showPrice        Boolean       @default(true)   // NOVO: false = "Sob consulta"
  productType      ProductType   @default(ambos)  // NOVO: varejo | atacado | ambos
  sku              String?       @unique
  stock            Int           @default(0)
  images           String[]
  featured         Boolean       @default(false)
  status           ProductStatus @default(ativo)
  relatedProductIds String[]     @default([])     // NOVO: IDs de produtos fixados manualmente
  category         Category      @relation(fields: [categoryId], references: [id])
  categoryId       String
  leads            Lead[]
  sales            Sale[]        // NOVO: relação com vendas
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
}

model Sale {                    // NOVO modelo
  id        String   @id @default(cuid())
  product   Product  @relation(fields: [productId], references: [id])
  productId String
  quantity  Int
  buyerType LeadType
  notes     String?
  createdAt DateTime @default(now())
}

enum ProductType {              // NOVO enum
  varejo
  atacado
  ambos
}
```

**Migration necessária:** uma migration Prisma adicionando `Sale`, enum `ProductType`, colunas `showPrice`, `productType` e `relatedProductIds` em `Product`.

### API Endpoints (Server Actions)

**`actions/sales.ts`** — arquivo novo:

| Action | Input | Retorno | Descrição |
|---|---|---|---|
| `registerSale` | `{ productId, quantity, buyerType, notes? }` | `{ success, error?, newStock? }` | Valida estoque, cria Sale e decrementa stock em transação |
| `getSalesSummary` | `{ period: '7d' \| '30d' \| 'month' }` | `SalesByDay[]` | Agrupa vendas por dia para gráfico |
| `getTopProducts` | `{ period, limit: 5 }` | `TopProduct[]` | Top N produtos por quantidade vendida |

**`actions/leads.ts`** — extensão mínima:

Adicionar chamada ao Resend após `db.lead.create()`:

```typescript
// Após db.lead.create(...)
if (process.env.RESEND_API_KEY && config?.contactEmail) {
  await resend.emails.send({
    from: 'Technicfix <noreply@technicfix.com.br>',
    to: config.contactEmail,
    subject: `Novo lead: ${dataToSave.name}`,
    text: `Tipo: ${dataToSave.type}\nNome: ${dataToSave.name}\nEmail: ${dataToSave.email}`,
  }).catch(() => {}) // falha silenciosa — lead já foi salvo
}
```

**`actions/products.ts`** — sem alteração estrutural. O `ProductForm` admin precisará incluir os novos campos `showPrice`, `productType` e `relatedProductIds` no FormData.

---

## Integration Points

### Resend (e-mail de notificação de lead)

- **SDK:** `resend` (instalar via `npm install resend`)
- **Autenticação:** variável de ambiente `RESEND_API_KEY`
- **Chamada:** dentro de `actions/leads.ts`, após persistir o lead
- **Tratamento de erro:** bloco `catch(() => {})` — falha de e-mail não deve impedir o retorno de sucesso ao usuário (lead já foi salvo)
- **Domínio:** verificar domínio `technicfix.com.br` no painel Resend antes do deploy

### Recharts (gráficos do dashboard)

- **Instalação:** `npm install recharts`
- **Uso:** Client Components wrapper em `components/admin/` que recebem dados via props do Server Component do dashboard
- **Verificar compatibilidade:** Recharts 2.x com React 19 antes de instalar (checar releases)

---

## Impact Analysis

| Componente | Tipo de Impacto | Descrição e Risco | Ação Necessária |
|---|---|---|---|
| `prisma/schema.prisma` | modificado | Novos campos em Product, nova model Sale, novo enum ProductType | Migration + regenerar Prisma client |
| `app/(public)/produtos/[slug]/page.tsx` | modificado | Adicionar query SiteConfig, passar novas props para ProductCTAs, adicionar RelatedProducts | Risco baixo — Server Component |
| `components/catalog/ProductCTAs.tsx` | modificado (reescrita) | Substituir modais por seletor + WhatsApp CTAs + LeadFormInline | Risco médio — componente testado; atualizar testes |
| `components/catalog/LeadFormInline.tsx` | novo | Formulário inline sem modal; chama submitLead existente | Sem risco de regressão |
| `components/catalog/RelatedProducts.tsx` | novo | Server Component; busca produtos por categoria + overrides | Sem risco de regressão |
| `actions/leads.ts` | modificado (extensão) | Adicionar envio Resend após db.lead.create | Risco baixo — falha silenciosa |
| `actions/sales.ts` | novo | registerSale, getSalesSummary, getTopProducts | Sem risco de regressão |
| `actions/products.ts` | modificado (extensão) | Suporte a novos campos showPrice, productType, relatedProductIds | Risco baixo |
| `components/admin/products/ProductForm.tsx` | modificado | Adicionar campos showPrice (toggle), productType (select), relatedProductIds (multi-select) | Risco baixo |
| `app/(admin)/admin/page.tsx` | modificado | Adicionar query de vendas, novo MetricCard, DashboardCharts | Risco baixo |
| `components/admin/DashboardCharts.tsx` | novo | Client Component Recharts com SalesLineChart e TopProductsList | Sem risco de regressão |
| `app/(admin)/admin/vendas/page.tsx` | novo | Server Component com listagem de vendas + filtro de período | Sem risco de regressão |
| `components/admin/SalesList.tsx` | novo | Tabela de vendas com filtro de período | Sem risco de regressão |
| `components/admin/RegisterSaleDrawer.tsx` | novo | Drawer com busca de produto, quantity, buyerType | Sem risco de regressão |
| `components/admin/AdminSidebar.tsx` | modificado | Adicionar item "Vendas" com ícone ShoppingCart no navLinks | Risco mínimo |
| `app/(admin)/admin/produtos/page.tsx` | modificado | Célula de estoque com estilo condicional (stock ≤ 5) | Risco mínimo |

---

## Testing Approach

### Unit Tests

- `registerSale`: testar validação de estoque insuficiente (deve retornar `{ success: false }`), transação com estoque suficiente (deve decrementar e criar Sale).
- `ProductCTAs v2`: testar que seleção de perfil altera href do botão WhatsApp; testar que stock=0 desabilita botões WhatsApp.
- `LeadFormInline`: testar submissão com campos obrigatórios; testar expansão de campos atacado ao selecionar tipo.

### Integration Tests

- `submitLead` estendida: mock do Resend SDK; verificar que lead é criado mesmo quando Resend falha.
- `registerSale` em transação: verificar que `Sale` é criada e `Product.stock` decrementado atomicamente; verificar que nenhum dos dois ocorre se validação falha.

---

## Development Sequencing

### Build Order

1. **Migration Prisma** — adicionar `showPrice`, `productType`, `relatedProductIds` em Product; criar model `Sale` e enum `ProductType`. Sem dependências.

2. **`actions/sales.ts`** — `registerSale`, `getSalesSummary`, `getTopProducts`. Depende do passo 1 (Prisma client regenerado).

3. **`actions/leads.ts` (extensão Resend)** — instalar `resend`; adicionar envio pós-criação. Depende do passo 1 (query de SiteConfig para contactEmail).

4. **`actions/products.ts` (extensão campos novos)** — suporte a `showPrice`, `productType`, `relatedProductIds` no create/update. Depende do passo 1.

5. **`ProductForm.tsx` (admin — campos novos)** — adicionar toggle showPrice, select productType, campo relatedProductIds. Depende do passo 4.

6. **`ProductCTAs.tsx` (reescrita)** + **`LeadFormInline.tsx` (novo)** — novo CTA unificado com seletor de perfil, botões WhatsApp e formulário inline. Depende do passo 1 (tipos Prisma) e passo 4 (productType disponível).

7. **`RelatedProducts.tsx` (novo)** — Server Component; busca automática por categoria + override por `relatedProductIds`. Depende do passo 1.

8. **`app/(public)/produtos/[slug]/page.tsx` (extensão)** — adicionar query SiteConfig, passar `whatsappNumber`, `showPrice`, `productType`, `stock` para `ProductCTAs`; adicionar `<RelatedProducts>` ao final. Depende dos passos 6 e 7.

9. **`AdminSidebar.tsx`** — adicionar item "Vendas". Sem dependência de código; pode ser feito em qualquer ordem.

10. **`RegisterSaleDrawer.tsx` (novo)** + **`SalesList.tsx` (novo)**. Depende do passo 2.

11. **`app/(admin)/admin/vendas/page.tsx` (novo)**. Depende dos passos 10 e 9.

12. **`DashboardCharts.tsx` (novo)** — instalar `recharts`; componentes Client de gráfico. Depende do passo 2.

13. **`app/(admin)/admin/page.tsx` (extensão dashboard)**. Depende dos passos 2 e 12.

14. **`app/(admin)/admin/produtos/page.tsx` (estilo condicional estoque)**. Sem dependência nova; pode ser feito em qualquer ordem após passo 1.

### Technical Dependencies

- `RESEND_API_KEY` deve estar configurada no ambiente antes do deploy da Fase 1.
- Domínio `technicfix.com.br` verificado no Resend antes do envio de e-mails.
- Verificar compatibilidade de Recharts com React 19 antes de instalar (passo 12).
- Migration Prisma deve ser rodada em produção antes de qualquer deploy de código que use os novos campos.

---

## Monitoring and Observability

- **Erro de envio de e-mail Resend:** logar `console.error('[submitLead] Resend error:', err)` no catch — não expor ao usuário.
- **Estoque negativo bloqueado:** logar tentativas bloqueadas de `registerSale` com `productId` e `quantity` solicitada.
- **Gráfico do dashboard:** se `getSalesSummary` retornar array vazio, o componente exibe estado vazio "Nenhuma venda registrada ainda" — sem erro de runtime.

---

## Technical Considerations

### Known Risks

- **Concorrência em registerSale:** dois registros simultâneos para o mesmo produto podem passar na validação de estoque antes um decrementar. Mitigação: `db.$transaction` com nível de isolamento padrão do PostgreSQL (read committed) é suficiente para o volume esperado; se necessário no futuro, usar `SELECT FOR UPDATE`.
- **Recharts + React 19:** bibliotecas de terceiros podem não suportar React 19 completamente. Verificar `npm install recharts` sem erros de peer dependency antes de avançar no passo 12.
- **Seletor de perfil sem persistência:** o estado varejista/atacadista é apenas local (useState) — não é salvo em cookie ou sessão. Usuário que recarrega a página volta ao padrão. Comportamento aceitável para o MVP.
- **`relatedProductIds` como `String[]`:** array de IDs no Prisma com PostgreSQL usa coluna do tipo text[]. Se um produto referenciado for deletado, o ID órfão ficará no array — a query de RelatedProducts deve filtrar apenas IDs existentes com `where: { id: { in: relatedIds }, status: 'ativo' }`.

---

## Architecture Decision Records

- [ADR-001: Redesign dos CTAs com Admin Integrado](adrs/adr-001.md) — Substituir modais por CTA unificado WhatsApp + form inline; stock alert em Produtos; Vendas como página própria; dashboard com gráficos.
- [ADR-002: Resend como provedor de e-mail](adrs/adr-002.md) — SDK TypeScript nativo para notificações de lead; falha silenciosa para não bloquear o usuário.
- [ADR-003: Recharts como biblioteca de gráficos](adrs/adr-003.md) — Padrão de facto no ecossistema shadcn/Next.js; SVG-based; compatível com Tailwind.
- [ADR-004: Nova model Sale separada](adrs/adr-004.md) — Separação semântica entre lead (interesse) e sale (transação); queries de dashboard diretas.
- [ADR-005: SiteConfig como fonte do número WhatsApp nos CTAs](adrs/adr-005.md) — Admin controla o número pelo painel; `WhatsAppButton` flutuante mantém env var temporariamente.
