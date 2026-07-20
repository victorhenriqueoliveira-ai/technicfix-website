# TechSpec: Redesign Visual Prime da Homepage

## Executive Summary

Redesign visual da homepage da TechnicFix concentrado em seis componentes em `components/home/`, dois campos nullable no schema Prisma e ajustes de tokens CSS em `globals.css`. Nenhuma nova biblioteca é introduzida. A `TestimonialsSection` é removida da homepage (ADR-002). O campo `badge` do produto e os pill badges configuráveis da hero exigem toques mínimos e cirúrgicos em `app/(public)/page.tsx` — devidamente acordados e documentados (ADR-003).

**Principal trade-off:** Adicionar `heroBadge1/2` ao `SiteConfig` via BD cria badges editáveis sem deploy, mas introduz dois campos que o painel admin precisará expor em uma sprint futura para que o valor seja efetivamente editável pelo operador.

---

## System Architecture

### Component Overview

```
app/(public)/page.tsx          ← orchestrator (fetch + composição)
  ├── Hero                     ← MODIFICADO: overlay gradiente, pills dinâmicos, CTA amber
  ├── DiferenciaisSection      ← MODIFICADO: fundo off-white, ícones maiores
  ├── CategoryGrid             ← MODIFICADO: hover elevação, label uppercase
  ├── FeaturedProducts         ← MODIFICADO: badge dinâmico, card com sombra
  ├── TechnocalhasSection      ← sem alteração
  ├── TestimonialsSection      ← REMOVIDO da homepage (ADR-002)
  └── LeadGeneralForm          ← MODIFICADO: dark band navy + CTA amber

lib/types.ts                   ← MODIFICADO: ProductSummary.badge, SiteConfig novos campos
prisma/schema.prisma           ← MODIFICADO: Product.badge, SiteConfig.heroBadge1/2
app/globals.css                ← MODIFICADO: tokens refinados + token --brand-off-white
```

**Fluxo de dados:**
1. `page.tsx` faz `Promise.all` de banners, categorias, produtos (com badge), siteConfig (com heroBadges).
2. Props fluem para cada componente filho — sem fetch no lado do cliente, sem contexto global novo.
3. CSS tokens centralizados em `:root` controlam toda a aparência da marca.

---

## Implementation Design

### Core Interfaces

```typescript
// lib/types.ts — atualizações

export interface ProductSummary {
  id: string
  name: string
  slug: string
  price: number | null
  images: string[]
  category: { name: string; slug: string }
  featured: boolean
  badge: string | null          // NOVO: "Mais Vendido" | "Profissional" | "Lançamento" | null
}

export interface SiteConfig {
  storeName: string
  whatsappNumber: string
  contactEmail: string
  technocalhasUrl: string
  technocalhasDescription: string
  heroBadge1: string | null     // NOVO: ex.: "Frete Grátis"
  heroBadge2: string | null     // NOVO: ex.: "Qualidade Premium"
}

// Hero — props atualizadas
interface HeroProps {
  banners: BannerData[]
  heroBadge1?: string | null    // NOVO
  heroBadge2?: string | null    // NOVO
}
```

### Data Models

**Alterações no `prisma/schema.prisma`:**

```prisma
model Product {
  // campos existentes inalterados...
  badge   String?   // NOVO — texto livre, nullable. Ex.: "Mais Vendido", "Profissional"
}

model SiteConfig {
  // campos existentes inalterados...
  heroBadge1  String?   // NOVO — pill badge 1 da hero. Ex.: "Frete Grátis"
  heroBadge2  String?   // NOVO — pill badge 2 da hero. Ex.: "Qualidade Premium"
}
```

Migração: `npx prisma migrate dev --name add_badge_fields`

---

## Impact Analysis

| Componente | Tipo de Impacto | Descrição e Risco | Ação Necessária |
|---|---|---|---|
| `prisma/schema.prisma` | Modificado | +2 campos nullable em SiteConfig, +1 em Product | Rodar migrate dev |
| `lib/types.ts` | Modificado | `ProductSummary.badge` e novos campos em `SiteConfig` | Atualizar interfaces |
| `app/(public)/page.tsx` | Modificado (mínimo) | +`badge` no select de produtos; remover TestimonialsSection; passar heroBadges ao Hero | 3 edições cirúrgicas |
| `components/home/Hero.tsx` | Modificado | Novo overlay gradiente; pills dinâmicos; CTA premium | Redesign visual |
| `components/home/CategoryGrid.tsx` | Modificado | Hover elevation (shadow+scale); label uppercase/tracking | Redesign visual |
| `components/home/FeaturedProducts.tsx` | Modificado | Badge pill condicional; sombra em camadas; preço em amber | Redesign visual |
| `components/home/DiferenciaisSection.tsx` | Modificado | Fundo off-white; ícones h-10 w-10; hover com translate | Redesign visual |
| `components/home/LeadGeneralForm.tsx` | Modificado | Fundo `bg-brand-navy-dark`; labels e texto branco; CTA amber | Redesign visual |
| `components/home/TestimonialsSection.tsx` | Removido da homepage | Import e JSX removidos de page.tsx; arquivo mantido no repo | Remover de page.tsx |
| `app/globals.css` | Modificado | Saturação de `--brand-amber` elevada; novo token `--brand-off-white` | Ajuste de tokens |

---

## Implementation Design — Detalhamento por Componente

### `app/globals.css`

Ajustes no bloco `:root`:

```css
:root {
  /* Amber com maior saturação e chroma para impacto visual */
  --brand-amber: oklch(0.78 0.20 72);        /* era oklch(0.75 0.17 75) */
  --brand-amber-dark: oklch(0.67 0.19 68);   /* era oklch(0.65 0.17 68) */

  /* Novo token utilitário para seções alternadas */
  --brand-off-white: oklch(0.97 0.005 255);  /* quase branco com leve warm-cool */
}
```

Registrar no bloco `@theme inline`:
```css
--color-brand-off-white: var(--brand-off-white);
```

---

### `components/home/Hero.tsx`

**Mudanças visuais:**
- Substituir overlay `bg-black/60` por gradiente direcional:
  `bg-gradient-to-r from-brand-navy/90 via-brand-navy/60 to-transparent`
- Renderizar 0–2 pills dinâmicas acima do headline quando `heroBadge1`/`heroBadge2` não forem nulos:
  ```tsx
  {(heroBadge1 || heroBadge2) && (
    <div className="flex flex-wrap gap-2 justify-center mb-5">
      {[heroBadge1, heroBadge2].filter(Boolean).map((text) => (
        <span key={text} className="inline-flex items-center gap-1.5 rounded-full bg-brand-amber/15 border border-brand-amber/50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-amber">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-amber" />
          {text}
        </span>
      ))}
    </div>
  )}
  ```
- CTA WhatsApp: adicionar `hover:shadow-xl hover:shadow-brand-amber/40` e remover `hover:scale-105` (mantém só a sombra expandida — mais premium que scale).
- Pill existente "TechnicFix — Parafusos e Fixadores" mantida como eyebrow label acima do headline.

---

### `components/home/CategoryGrid.tsx`

**Mudanças visuais:**
- Card wrapper: adicionar `hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-navy/15` à transição.
- Label do nome da categoria: trocar de `text-sm font-bold` para `text-xs font-bold uppercase tracking-wider`.
- Fundo do placeholder sem imagem: `bg-brand-navy/5` → `bg-brand-navy-light/20` para mais contraste sutil.
- Borda inferior no hover (`border-t-2 border-transparent group-hover:border-brand-amber`) já existe — manter.

---

### `components/home/FeaturedProducts.tsx`

**Mudanças visuais no `ProductCard`:**
- Wrapper card: substituir `shadow-sm` por `shadow-md` como base; no hover `hover:shadow-xl hover:shadow-brand-navy/10 hover:-translate-y-1`.
- Badge dinâmico: renderizado sobre a imagem (absolute top-3 left-3) quando `product.badge` não for nulo:
  ```tsx
  {product.badge && (
    <span className="absolute top-3 left-3 z-10 rounded-full bg-brand-amber px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-brand-navy shadow-sm">
      {product.badge}
    </span>
  )}
  ```
- Preço: `text-base font-extrabold text-brand-navy` → `text-lg font-extrabold text-brand-amber` para destaque em amber.
- Botão "Ver todos": adicionar `hover:bg-brand-navy hover:text-white` (já existe) + `shadow-sm hover:shadow-md transition-shadow`.

**Atualizar `ProductCard` props** para receber `badge: string | null` via `ProductSummary`.

---

### `components/home/DiferenciaisSection.tsx`

**Mudanças visuais:**
- Seção: mudar de `bg-brand-navy` para `bg-brand-off-white` — cria ritmo alternado com a seção anterior (FeaturedProducts em `bg-gray-50`) e posterior (LeadGeneralForm em `bg-brand-navy-dark`).
- Eyebrow label e título: mudar de `text-brand-amber` / `text-white` para `text-brand-amber` / `text-brand-navy` (fundo claro agora).
- Card: `bg-brand-navy-light border-white/10` → `bg-white border-brand-navy/8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all`.
- Ícone container: `h-16 w-16` (era `h-16 w-16`) — manter tamanho, mas aumentar o SVG interno: `h-8 w-8` → `h-10 w-10`.
- Título e descrição: `text-white` / `text-white/60` → `text-brand-navy` / `text-brand-navy/60`.

---

### `components/home/LeadGeneralForm.tsx`

**Mudanças visuais:**
- Seção wrapper: `bg-white` → `bg-brand-navy-dark`.
- Headline e subtexto: `text-gray-800` / `text-gray-600` → `text-white` / `text-white/70`.
- Labels dos inputs: `text-gray-700` → `text-white/80`.
- Inputs: `border-gray-300 text-gray-900` → `border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:border-brand-amber focus:ring-brand-amber/20`.
- Botão de submissão: já é amber — manter, adicionar `shadow-lg shadow-brand-amber/20 hover:shadow-xl`.
- Estado de sucesso: `bg-green-50 border-green-200` → `bg-white/10 border-white/20` com texto branco (para harmonizar com fundo navy).
- Estado de erro: `bg-red-50 border-red-200 text-red-600` → `bg-red-900/30 border-red-400/40 text-red-300`.

---

### `app/(public)/page.tsx` — Edições Mínimas

**1. Remover TestimonialsSection:**
```tsx
// Remover:
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
// Remover do JSX:
<TestimonialsSection />
```

**2. Adicionar badge ao fetch de produtos:**
```typescript
// Em ProductRow type: adicionar badge?: string | null
// Em getFeaturedProducts, no mapeamento products:
badge: p.badge ?? null,
```
O Prisma retornará `badge` automaticamente após a migração — nenhum include manual necessário para campos escalares.

**3. Passar heroBadges para Hero:**
```tsx
// config já contém heroBadge1/2 após migração
<Hero
  banners={banners}
  heroBadge1={config.heroBadge1 ?? null}
  heroBadge2={config.heroBadge2 ?? null}
/>
```
O valor default do `config` (quando `siteConfig` é null) precisa incluir `heroBadge1: null, heroBadge2: null`.

---

## Testing Approach

### Visual / Manual

Verificar em 375px, 768px, 1440px após cada componente:
- Hero: overlay gradiente visível, pills aparecem quando configurados, fallback sem pills quando nulos.
- CategoryGrid: hover eleva o card sem overflow; label uppercase sem truncamento.
- FeaturedProducts: badge aparece em produtos com campo preenchido; ausente nos demais; preço em amber legível.
- DiferenciaisSection: fundo off-white contrasta corretamente com seções adjacentes.
- LeadGeneralForm: inputs legíveis sobre fundo navy; form submission funciona (testar happy path + erro).

### Regressão

- `TechnocalhasSection` (não tocada): renderiza normalmente.
- `Hero` sem banners: fallback banner ainda funciona.
- `Hero` sem heroBadges (campos null): nenhum pill é renderizado, sem erro visual.
- Produtos sem `badge`: nenhum elemento badge renderizado, sem espaço em branco extra.
- Migração backward-compat: registros existentes de `Product` e `SiteConfig` não são afetados (campos nullable).

### Build

```bash
npx prisma migrate dev --name add_badge_fields
npx tsc --noEmit          # zero erros de tipo
```

---

## Development Sequencing

### Build Order

1. **`prisma/schema.prisma`** — adicionar `badge` em `Product` e `heroBadge1/2` em `SiteConfig`. Sem dependências.
2. **Migração Prisma** — `npx prisma migrate dev --name add_badge_fields`. Depende do passo 1.
3. **`lib/types.ts`** — adicionar `badge: string | null` a `ProductSummary`; adicionar `heroBadge1/2` a `SiteConfig`. Depende do passo 1.
4. **`app/globals.css`** — ajustar tokens `--brand-amber`, `--brand-amber-dark`; adicionar `--brand-off-white`. Sem dependências (paralelo com 1–3).
5. **`app/(public)/page.tsx`** — remover TestimonialsSection; incluir `badge` no mapeamento de produto; passar heroBadges ao Hero. Depende dos passos 2 e 3.
6. **`components/home/Hero.tsx`** — gradiente, pills dinâmicos, CTA refinado. Depende do passo 5 (interface de props atualizada).
7. **`components/home/FeaturedProducts.tsx`** — badge visual, sombra em camadas, preço amber. Depende do passo 3 (tipo `ProductSummary` com `badge`).
8. **`components/home/CategoryGrid.tsx`** — hover elevation, label uppercase. Sem dependências de dados (apenas visual). Paralelo com passo 7.
9. **`components/home/DiferenciaisSection.tsx`** — fundo off-white, ícones maiores. Depende do passo 4 (token `--brand-off-white`).
10. **`components/home/LeadGeneralForm.tsx`** — dark band, inputs, CTA. Sem dependências de dados. Paralelo com passos 8–9.

### Technical Dependencies

- PostgreSQL disponível localmente para rodar a migração Prisma.
- `prisma generate` após a migração (automático no `migrate dev`).

---

## Monitoring and Observability

- Rastrear eventos de clique no CTA WhatsApp da hero (GTM ou `data-testid="hero-whatsapp"`) como KPI principal de conversão.
- Inspecionar no console do navegador após deploy: zero erros de hidratação React (inputs controlados/não-controlados no `LeadGeneralForm` com novo fundo).
- Verificar no painel admin que `heroBadge1/2` e `badge` dos produtos aparecem nos formulários de edição (se o admin ainda não expõe esses campos, o valor fica null até uma sprint futura).

---

## Technical Considerations

### Key Decisions

**Token global vs. scoped:** Os tokens `--brand-amber` e `--brand-off-white` são ajustados no `:root` global. O amber mais saturado afeta toda a aplicação (header, botões, links), o que é desejável — a identidade toda fica mais vibrante. Não foi necessário criar tokens homepage-scoped.

**Overlay da hero:** Gradiente direcional (`from-brand-navy/90 via-brand-navy/60 to-transparent`) em vez de `bg-black/60` — preserva parte da imagem do banner visível à direita, criando profundidade sem apagar o conteúdo visual do banner.

**Scale no hover removido dos CTAs:** `hover:scale-105` foi substituído por `hover:shadow-xl` para CTAs principais — scale em botões pode parecer agressivo; sombra expandida comunica elevação de forma mais sutil e premium.

### Known Risks

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Admin não expõe `heroBadge1/2` → pills ficam nulos até nova sprint | Alta (curto prazo) | Comportamento seguro: zero pills = zero erro visual; adicionar ao admin é sprint futura |
| `--brand-amber` mais saturado em oklch pode parecer diferente em monitores com gamut limitado | Baixa | Testar em monitor sRGB; oklch(0.78 0.20 72) ainda está dentro do sRGB gamut |
| `LeadGeneralForm` com fundo navy: inputs podem ter contraste insuficiente em alto contraste do SO | Baixa | `focus:border-brand-amber` e `focus:ring` mantêm indicador de foco visível; validar com acessibilidade do browser |

---

## Architecture Decision Records

- [ADR-001: Abordagem Premium Polish — Evolução Refinada](adrs/adr-001.md) — Escolha da abordagem de evolução refinada com campo badge dinâmico no Product.
- [ADR-002: Remoção da TestimonialsSection](adrs/adr-002.md) — Seção removida da homepage a pedido do usuário durante o TechSpec.
- [ADR-003: Propagação do Campo Badge via page.tsx (Restrição Relaxada)](adrs/adr-003.md) — Toques mínimos e acordados em page.tsx para propagar badge e heroBadges.
- [ADR-004: Pill Badges da Hero Configurados via SiteConfig](adrs/adr-004.md) — Badges editáveis pelo admin via BD em vez de hardcoded.
