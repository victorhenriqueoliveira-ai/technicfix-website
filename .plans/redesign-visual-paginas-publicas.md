# Plan: Redesign Visual — Páginas Públicas TechnicFix

**Status:** Planning
**Current Phase:** Fase 0 — Design Tokens
**Last Updated:** 2026-07-01
**Resume Point:** Comece pela **Task 01** (Contexto: definir paleta TechnicFix como tokens CSS em globals.css)

---

## 🛡️ Invariants
*Regras de ouro que não podem ser quebradas durante a implementação.*

1. Nunca tocar em `app/(admin)/` nem em `components/admin/` — área administrativa fora do escopo.
2. Nunca alterar rotas, APIs (`app/api/`) ou lógica de backend.
3. `WhatsAppButton` já existe em `components/layout/WhatsAppButton.tsx` — melhorar, não duplicar.
4. Todas as funcionalidades existentes (formulário de contato, catálogo, filtros, galeria de produto) devem continuar operando após cada fase.
5. Centralizar cores na `globals.css` via CSS custom properties — nunca hardcodar valores de cor fora dos tokens.
6. O nome da marca é sempre **TechnicFix** — nunca "TechnoFix" ou "Technicfix" (minúsculo no F).

---

## 🗺️ Repository Map & Discovery

| Área | Caminho | Observação |
| :--- | :--- | :--- |
| Tokens de design | `app/globals.css` | CSS custom props shadcn/tailwind — aqui entram as novas vars de marca |
| Layout shell público | `app/(public)/layout.tsx` | Wraper com Header + Footer |
| Header | `components/layout/Header.tsx` | Branco + orange-500 hardcoded — migrar para tokens navy/amber |
| Footer | `components/layout/Footer.tsx` | gray-800 hardcoded — migrar para navy escuro |
| WhatsApp btn | `components/layout/WhatsAppButton.tsx` | Já existe — verificar e enriquecer |
| Hero | `components/home/Hero.tsx` | orange-600 hardcoded — migrar para navy + amber |
| Seções home | `components/home/` | CategoryGrid, FeaturedProducts, TestimonialsSection, TechnocalhasSection, LeadGeneralForm |
| Catálogo | `components/catalog/` | ProductCard, CategoryFilter, SearchBar, ProductCTAs, ProductGallery |
| UI compartilhada | `components/ui/` | Breadcrumb, ProductImagePlaceholder, button, dialog, sheet |
| Páginas públicas | `app/(public)/` | 7 páginas: `/`, `/produtos`, `/produtos/[slug]`, `/categorias/[slug]`, `/contato`, `/sobre`, `/technocalhas` |

---

## 🚀 Phase Outline

| Fase | Objetivo | Critério de Conclusão |
| :--- | :--- | :--- |
| **0 — Design Tokens** | Definir paleta TechnicFix como CSS custom properties em `globals.css` e mapear classes Tailwind | `--brand-navy`, `--brand-amber`, `--brand-white` disponíveis e usáveis em qualquer componente |
| **1 — Layout Shell** | Redesenhar Header, Footer e WhatsAppButton com nova identidade | Navbar azul marinho + logo TechnicFix + CTA amber; rodapé navy escuro; botão WA fixo e visível |
| **2 — Homepage** | Reformular Hero, CategoryGrid, FeaturedProducts e demais seções da home | Hero tela cheia navy + slogan em destaque + CTA WhatsApp; seções com identidade coerente |
| **3 — Catálogo** | Redesenhar ProductCard, CategoryFilter, SearchBar e páginas `/produtos` e `/categorias/[slug]` | Cards com detalhe amber, foto proeminente; filtros com tokens de marca; layout responsivo |
| **4 — Páginas restantes** | Aplicar identidade em `/produtos/[slug]`, `/contato`, `/sobre` e `/technocalhas` | Todas as 7 páginas com visual coerente, sem quebras funcionais |

---

## 📋 Master Task List

| # | Task | Status | Cx | Deps | Validação (Como testar?) |
| :-- | :--- | :---: | :---: | :---: | :--- |
| 01 | Definir tokens de cor TechnicFix em `globals.css` (`--brand-navy`, `--brand-amber`, `--brand-white` e variantes) | [ ] | S | — | `grep -n 'brand-navy' app/globals.css` retorna a variável; build sem erro |
| 02 | Redesenhar `Header` — fundo navy, logo TechnicFix bold, links brancos, CTA "WhatsApp" amber | [ ] | M | 01 | Abrir `/` no browser: navbar azul marinho com logo e botão amber visíveis |
| 03 | Redesenhar `Footer` — fundo navy escuro, slogan, links, link WhatsApp | [ ] | M | 01 | Rolar até o fim de qualquer página: rodapé navy com identidade TechnicFix |
| 04 | Enriquecer `WhatsAppButton` — visível em todas as páginas, ícone WA, cor verde contrastando com navy | [ ] | S | 01 | Botão flutuante presente e clicável em mobile e desktop em todas as páginas públicas |
| 05 | Redesenhar `Hero` — fundo navy/gradiente, título bold, slogan "Fixação que não Falha", CTA WhatsApp amber | [ ] | M | 01 | `/` no browser: hero azul marinho, slogan visível, botão WhatsApp em destaque |
| 06 | Redesenhar `CategoryGrid` e `FeaturedProducts` — cards com detalhe amber, tipografia bold | [ ] | M | 01 | Seções da home com cards na paleta TechnicFix, hover com detalhe amber |
| 07 | Redesenhar seções secundárias da home (`TestimonialsSection`, `TechnocalhasSection`, bloco de diferenciais) | [ ] | M | 06 | Home completa: todas as seções com identidade coerente, sem elementos orange hardcoded |
| 08 | Redesenhar `ProductCard`, `CategoryFilter` e `SearchBar` | [ ] | M | 01 | Cards de produto com foto proeminente e detalhe amber; filtros e busca com tokens da marca |
| 09 | Aplicar identidade em `/produtos` e `/categorias/[slug]` | [ ] | M | 08 | Páginas de listagem com layout responsivo e visual TechnicFix; filtros funcionais |
| 10 | Aplicar identidade em `/produtos/[slug]` (detalhe do produto) | [ ] | M | 08 | Página de produto com galeria, CTAs WhatsApp e breadcrumb com paleta TechnicFix |
| 11 | Aplicar identidade em `/contato` — formulário + CTA WhatsApp como ação primária | [ ] | S | 02 | Página de contato com botão WhatsApp proeminente e formulário funcional |
| 12 | Aplicar identidade em `/sobre` e `/technocalhas` | [ ] | S | 02 | Páginas com tipografia bold, paleta navy/amber, sem elementos orange hardcoded |
| 13 | Auditoria final — varredura por `orange-` hardcoded e verificação de responsividade mobile | [ ] | S | 10,11,12 | `grep -rn 'orange-' components/` e `components/layout/` retornam zero resultados fora do admin |

---

## 📓 Progress Log
*(Adicionar uma entrada a cada iteração ou branch concluído. Nunca remover as anteriores.)*

### Iteração 0 — Setup
- **Branch:** `—`
- **Resumo:** Plano de implementação criado a partir do PRD base em `prompts/redesign-visual-paginas-publicas.md` e exploração do código atual.
- **Arquivos:** `.plans/redesign-visual-paginas-publicas.md`

---

## ⚠️ Deferred / Blocked

| Item | Motivo | Bloqueado por |
| :--- | :--- | :--- |
| Fotos reais de produtos | Cliente vai fornecer — usar placeholder industrial até chegarem | Cliente |
| Número WhatsApp em produção | `NEXT_PUBLIC_WHATSAPP_NUMBER` precisa estar configurado no `.env` | Variável de ambiente |

---

## ✅ Checklists por Fase

### Fase 0 — Design Tokens
- [ ] Adicionar `--brand-navy: oklch(...)` (≈ #0D1B3E) em `:root` no `globals.css`
- [ ] Adicionar `--brand-amber: oklch(...)` (≈ #F5A623) em `:root`
- [ ] Adicionar `--brand-white: #ffffff` e `--brand-navy-dark` (tom mais escuro para footer)
- [ ] Mapear tokens como classes utilitárias Tailwind no `@theme inline` (ex: `--color-brand-navy`, `--color-brand-amber`)
- [ ] Verificar build (`next build`) sem erros de CSS

### Fase 1 — Layout Shell
- [ ] `Header`: trocar `bg-white` → `bg-brand-navy`; links `text-gray-700` → `text-white`; hover → `text-brand-amber`
- [ ] `Header`: logo "TechnicFix" em texto bold branco (ou SVG da marca quando disponível)
- [ ] `Header`: adicionar botão CTA "Fale pelo WhatsApp" em amber à direita no desktop
- [ ] `Header mobile`: fundo navy no sheet, links brancos
- [ ] `Footer`: trocar `bg-gray-800` → `bg-brand-navy-dark`; texto `text-gray-300` → `text-white/70`
- [ ] `Footer`: nome da marca "TechnicFix" + slogan "Fixação que não Falha" em destaque
- [ ] `Footer`: link WhatsApp com ícone verde visível
- [ ] `WhatsAppButton`: verificar posicionamento fixo, adicionar label visível, garantir z-index acima de outros elementos

### Fase 2 — Homepage
- [ ] `Hero`: trocar gradiente `orange-600→orange-800` → `brand-navy→brand-navy-dark`
- [ ] `Hero`: fallback banner com título "TechnicFix — Fixação que não Falha" e CTA "Falar pelo WhatsApp" em amber
- [ ] `Hero`: adicionar elemento gráfico (engrenagem SVG ou textura industrial) como decoração de fundo
- [ ] `CategoryGrid`: cards com borda/detalhe amber no hover, tipografia bold
- [ ] `FeaturedProducts`: heading em navy/amber, cards com foto proeminente
- [ ] Adicionar bloco de diferenciais (ícones industriais: variedade, entrega, atendimento)
- [ ] `TestimonialsSection` e `TechnocalhasSection`: paleta coerente com tokens

### Fase 3 — Catálogo
- [ ] `ProductCard`: borda amber no hover, badge de categoria em amber, CTA visível
- [ ] `ProductCard`: placeholder industrial quando sem foto
- [ ] `SearchBar`: fundo navy suave, borda amber no foco
- [ ] `CategoryFilter`: botão ativo em amber, inativos em navy/10%
- [ ] `/produtos/page.tsx`: heading e layout com tokens de marca
- [ ] `/categorias/[slug]/page.tsx`: breadcrumb navy/amber, heading bold

### Fase 4 — Páginas Restantes
- [ ] `/produtos/[slug]`: galeria com detalhe amber, CTAs WhatsApp e orçamento em destaque
- [ ] `/contato/page.tsx`: título navy, botão WhatsApp como CTA primário acima do formulário
- [ ] `/sobre/page.tsx`: tipografia bold, seções com alternância navy/branco
- [ ] `/technocalhas/page.tsx`: identidade coerente com home

### Auditoria Final
- [ ] `grep -rn 'orange-' components/ app/\(public\)/` — resultado zero fora do admin
- [ ] Testar em viewport mobile (375px) todas as 7 páginas — sem quebras
- [ ] Testar todas as funcionalidades: formulário de contato, filtros de catálogo, galeria, slide do hero
- [ ] Verificar contraste acessível em botões amber sobre navy e texto branco sobre amber

---

## 📝 Notes for Future Agents

- O projeto usa **Tailwind v4 com `@import "tailwindcss"`** (não há `tailwind.config.ts`) — tokens são definidos via `@theme inline` em `globals.css` e referenciados como `var(--color-brand-*)`.
- `WhatsAppButton` já existe em `components/layout/WhatsAppButton.tsx` — não criar um novo componente.
- O hero recebe banners dinâmicos do banco via props; o fallback estático é `FALLBACK_BANNER` dentro do próprio componente — atualizar o fallback junto com o visual.
- `SheetClose` do shadcn usa `render={<span />}` (API desta versão do shadcn) — não alterar essa API ao mexer no mobile menu do Header.
- Branch alvo: `feature/redesign-visual-publico` → PR para `main` ao concluir todas as fases.
