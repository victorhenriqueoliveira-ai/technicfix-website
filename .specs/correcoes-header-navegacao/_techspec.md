# TechSpec — Correções e Melhorias de Navegação no Header

## Executive Summary

Esta spec cobre quatro mudanças independentes que compartilham o mesmo deploy: (1) correção de import do Slider em `PriceFilter.tsx`; (2) fechamento automático do Sheet mobile ao submeter busca; (3) integração do `CategoryNav` existente ao Header com fetch server-side; (4) novo `ProductsDropdown` Client Component para o item "Produtos".

O principal trade-off arquitetural é a extração de `MobileMenu.tsx` como Client Component — o Header permanece Server Component e delega toda interatividade mobile para esse novo componente. Isso preserva o fetch server-side de categorias e produtos (zero latência visível) ao custo de uma prop adicional na assinatura do `Header`.

---

## System Architecture

### Component Overview

```
app/(public)/layout.tsx                  (Server Component — inalterado)
└── Header                               (Server Component — modificado)
    ├── [fetch] getCategoriesForNav()    (nova helper — db query)
    ├── [fetch] getProductsForNav()      (nova helper — db query, máx 30)
    ├── TopBar                           (JSX inline — inalterado)
    ├── MainBar                          (JSX inline — inalterado)
    │   ├── HeaderSearchBar              (Client Component — prop onSearch adicionada)
    │   └── CategoryNav                  (Client Component — integrado na Camada 3)
    ├── ProductsDropdown                 (Client Component — NOVO, desktop only)
    └── MobileMenu                       (Client Component — NOVO)
        ├── Sheet + SheetTrigger/Content (controlled via useState<boolean>)
        ├── HeaderSearchBar              (com onSearch → fecha Sheet)
        ├── CategoryAccordion            (variant="light", categorias)
        └── [accordion Produtos]         (inline no MobileMenu, lista de links)
```

**Fluxo de dados:**
1. `Header` (Server) faz `Promise.all([getCategoriesForNav(), getProductsForNav()])` no render.
2. Passa `categories: CategorySummary[]` e `products: ProductNavItem[]` como props para `MobileMenu` e para `CategoryNav`/`ProductsDropdown`.
3. `MobileMenu` controla `open: boolean` via `useState`; expõe `closeMenu()` para `HeaderSearchBar`.
4. `HeaderSearchBar` chama `onSearch?.()` antes de `router.push(...)`.

---

## Implementation Design

### Core Interfaces

```typescript
// lib/types.ts — EXISTENTE, sem alteração
interface CategorySummary {
  id: string
  name: string
  slug: string
  imageUrl: string | null
  children: CategorySummary[]
}

// lib/types.ts — NOVO
interface ProductNavItem {
  name: string
  slug: string
}

// components/layout/MobileMenu.tsx — props
interface MobileMenuProps {
  categories: CategorySummary[]
  products: ProductNavItem[]
}

// components/layout/ProductsDropdown.tsx — props
interface ProductsDropdownProps {
  products: ProductNavItem[]
}

// components/layout/HeaderSearchBar.tsx — props (onSearch adicionada)
interface HeaderSearchBarProps {
  className?: string
  onSearch?: () => void   // chamado antes de router.push, para fechar Sheet
}
```

### Data Models

**getCategoriesForNav()** — nova helper em `lib/nav-data.ts`:

```typescript
export async function getCategoriesForNav(): Promise<CategorySummary[]> {
  return db.category.findMany({
    where: { parentId: null },
    select: {
      id: true, name: true, slug: true, imageUrl: true,
      children: {
        select: {
          id: true, name: true, slug: true, imageUrl: true,
          children: { select: { id: true, name: true, slug: true, imageUrl: true } },
        },
        orderBy: { name: 'asc' },
      },
    },
    orderBy: { name: 'asc' },
  })
}
```

**getProductsForNav()** — nova helper em `lib/nav-data.ts`:

```typescript
export async function getProductsForNav(): Promise<ProductNavItem[]> {
  return db.product.findMany({
    where: { status: 'ativo' },
    select: { name: true, slug: true },
    orderBy: { name: 'asc' },
    take: 30,
  })
}
```

---

## Impact Analysis

| Componente | Tipo de Impacto | Descrição e Risco | Ação Necessária |
|---|---|---|---|
| `components/catalog/PriceFilter.tsx` | modificado | Import `* as Slider` → `{ Slider }` — corrige `Slider.Root = undefined` | Alterar 1 linha de import; verificar se sub-componentes usados existem na nova forma |
| `components/layout/Header.tsx` | modificado | Adiciona fetch server-side + passa props para MobileMenu, CategoryNav e ProductsDropdown; insere Camada 3 (CategoryNav desktop) | Adicionar helpers, Promise.all, props; inserir JSX de Camada 3 |
| `components/layout/HeaderSearchBar.tsx` | modificado | Adiciona prop opcional `onSearch?: () => void`; chama antes de cada `router.push` | Alterar interface e 3 pontos de navegação; retrocompatível (prop opcional) |
| `components/layout/MobileMenu.tsx` | novo | Client Component — Sheet controlled, CategoryAccordion, accordion de Produtos, HeaderSearchBar com onSearch | Criar arquivo do zero |
| `components/layout/ProductsDropdown.tsx` | novo | Client Component — dropdown desktop com hover state, lista de ProductNavItem | Criar arquivo do zero |
| `lib/types.ts` | modificado | Adiciona `ProductNavItem` | Inserir interface |
| `lib/nav-data.ts` | novo | Helpers `getCategoriesForNav` e `getProductsForNav` | Criar arquivo do zero |
| Todos os componentes com import de UI libs | auditoria | Varrer `import * as X from 'lib'` onde `X` é namespace vs named export | Grep + fix pontual |

---

## Testing Approach

### Unit Tests

- `PriceFilter`: renderiza sem erro após correção do import; slider exibe `R$ min — R$ max` correto.
- `ProductsDropdown`: com `products=[]` renderiza apenas "Ver todos os produtos"; com 30 itens renderiza 30 links + "Ver todos"; dropdown abre ao `onMouseEnter` e fecha ao `onMouseLeave`.
- `MobileMenu`: Sheet abre ao clicar no hamburguer; ao chamar `onSearch` via `HeaderSearchBar`, Sheet fecha; `CategoryAccordion` renderiza com `variant="light"`.
- `HeaderSearchBar`: chama `onSearch` prop antes de navegar (mock de `router.push`).
- `getCategoriesForNav`: retorna apenas categorias com `parentId: null`, com filhos ordenados A–Z.
- `getProductsForNav`: retorna no máximo 30 produtos com `status='ativo'`, ordenados A–Z.

### Integration Tests

- GET `/produtos` não retorna erro de runtime (PriceFilter renderiza).
- GET `/` (qualquer página com Header): CategoryNav aparece na Camada 3 desktop com dados reais.
- GET `/` mobile: Sheet abre, CategoryAccordion e accordion de Produtos estão presentes.
- Após busca no mobile: Sheet fecha antes de navegar.

---

## Development Sequencing

### Build Order

1. **`lib/nav-data.ts`** — sem dependências; exporta `getCategoriesForNav` e `getProductsForNav`.
2. **`lib/types.ts`** — adicionar `ProductNavItem`; depende do passo 1 (tipagem das helpers).
3. **`components/catalog/PriceFilter.tsx`** — corrigir import do Slider; sem dependências de outros passos; pode ser feito em paralelo com passo 1.
4. **`components/layout/HeaderSearchBar.tsx`** — adicionar `onSearch?: () => void`; sem dependências; pode ser feito em paralelo com passos 1-3.
5. **`components/layout/ProductsDropdown.tsx`** — depende do passo 2 (`ProductNavItem`).
6. **`components/layout/MobileMenu.tsx`** — depende dos passos 2 (`CategorySummary`, `ProductNavItem`), 4 (`HeaderSearchBar` com `onSearch`); usa `CategoryAccordion` do `CategoryNav` existente.
7. **`components/layout/Header.tsx`** — depende dos passos 1, 5 e 6; integra tudo.
8. **Varredura de outros imports** — verificar projeto por `import * as` de libs UI; corrigir pontualmente.
9. **Testes** — após passos 1–8 concluídos.

### Technical Dependencies

- `@base-ui/react` versão `^1.6.0` instalada — confirmar que `Slider` é named export do subpath `@base-ui/react/Slider`.
- `CategorySummary` já definida em `lib/types.ts` — sem mudança de schema.
- `CategoryAccordion` já aceita `variant='light'` — sem mudança no componente.
- `Sheet` em `components/ui/sheet.tsx` já passa `...props` para `SheetPrimitive.Root` — controlled mode com `open`/`onOpenChange` funciona sem modificar `sheet.tsx`.

---

## Technical Considerations

### Key Decisions

**Header permanece Server Component:**
- Decisão: fetch de categorias e produtos em `Header` via `Promise.all`; dados passados como props.
- Justificativa: Header aparece em 100% das páginas públicas — fetch client-side introduziria loading states visíveis.
- Trade-off: Header passa a ter props explícitas (breaking change interno); PublicLayout não é alterado.
- Alternativa rejeitada: converter Header para Client Component (perda de SSR).

**MobileMenu como Client Component isolado (ADR-002):**
- Controla `open: boolean` com `useState`; `onSearch` fecha o Sheet via `setOpen(false)`.
- Alternativa rejeitada: Context global para fechar Sheet (over-engineering para um caso simples).

**ProductsDropdown com React state (ADR-003):**
- Consistência com CategoryNav (`onMouseEnter`/`onMouseLeave` + `useState`).
- Alternativa rejeitada: CSS puro com `group-hover` (falha em touch devices).

### Known Risks

- **Latência do Header:** `Promise.all([getCategoriesForNav(), getProductsForNav()])` adiciona 2 queries ao render de cada página pública. Ambas as queries são `select` leves (name + slug) com `take: 30` em produtos — baixo risco, mas monitorar em staging.
- **CategoryNav visual no novo contexto:** CategoryNav foi criado como componente standalone com sua própria barra `bg-brand-navy`. Integrado como Camada 3 no Header, pode haver conflito com `shadow-md` do `<header>`. Testar visualmente em desktop antes de finalizar.
- **Accordion de Produtos mobile:** O `CategoryAccordion` usa `<details>/<summary>` nativos — o accordion de Produtos no `MobileMenu` deve seguir o mesmo padrão para consistência visual, implementado inline.

---

## Architecture Decision Records

- [ADR-001: Integrar CategoryNav existente ao Header em vez de criar NavBar do zero](adrs/adr-001.md) — Reusa `CategoryNav.tsx` já funcional; cria `ProductsDropdown` análogo.
- [ADR-002: Extrair MobileMenu como Client Component para controle do Sheet](adrs/adr-002.md) — Header mantém SSR; interatividade mobile isolada em `MobileMenu.tsx`.
- [ADR-003: ProductsDropdown com React state hover, consistente com CategoryNav](adrs/adr-003.md) — Padrão `useState` + `onMouseEnter/Leave` idêntico ao CategoryNav existente.
