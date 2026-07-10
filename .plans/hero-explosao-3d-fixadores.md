# Plan: Hero Explosão 3D — Parafusos e Fixadores

**Status:** In-Progress
**Current Phase:** Fase 5 — Testes ✅
**Last Updated:** 2026-07-10
**Resume Point:** Task 09 — Revisão final e abertura de PR

---

## 🛡️ Invariants
*Regras de ouro que não podem ser quebradas durante a implementação.*

1. A interface `BannerData` (exportada de `components/home/Hero.tsx`) **não pode mudar** — `app/(public)/page.tsx` e testes dependem dela.
2. O CTA de WhatsApp (`whatsappHref`) deve permanecer funcional e visível em todos os viewports.
3. Toda camada decorativa animada deve ter `aria-hidden="true"` — nenhum elemento animado pode receber foco ou bloquear clique.
4. A animação deve ser desabilitada por completo quando `prefers-reduced-motion: reduce` estiver ativo.
5. Zero dependências novas de animação (sem Framer Motion, GSAP, etc.) — apenas CSS `@keyframes` ou Web Animations API.
6. Os testes existentes em `__tests__/components/home/Hero.test.tsx` devem continuar passando (adaptar os que testam texto do fallback, nunca remover cobertura de comportamento).

---

## 🗺️ Repository Map & Discovery

| Área | Caminho | Comando de Análise / Observação |
| :--- | :--- | :--- |
| Componente Hero | `components/home/Hero.tsx` | Arquivo a ser reescrito; exporta `Hero` e `BannerData` |
| Testes Hero | `__tests__/components/home/Hero.test.tsx` | 9 testes existentes; textos de fallback desalinhados com código atual |
| Página pública | `app/(public)/page.tsx` | Consome `<Hero banners={banners} />` — não alterar |
| Estilos globais | `app/globals.css` | Tokens `--color-brand-navy`, `--color-brand-amber` definidos aqui |
| Ícones/UI | `components/ui/` | Sem pasta `icons/` — SVGs serão inline no Hero ou num novo `components/icons/` |
| Admin banners | `app/(admin)` (não explorado) | BannerData vem do Prisma `db.banner` — não tocar no schema |

```bash
# Verificar testes atuais antes de alterar
npx jest __tests__/components/home/Hero.test.tsx --no-coverage

# Checar se há outras importações de Hero fora da página pública
grep -r "from.*Hero" components/ app/ --include="*.tsx" --include="*.ts"
```

---

## 🚀 Phase Outline

| Fase | Objetivo | Critério de Conclusão (Definition of Done) |
| :--- | :--- | :--- |
| **0 — Setup** | Criar branch, rodar testes base | Branch `feat/hero-explosao-3d` criada; `npx jest Hero` verde |
| **1 — SVG Assets** | Criar SVGs inline dos 5 fixadores | Componentes `BoltSvg`, `NutSvg`, `AnchorSvg`, `BushingSvg`, `WasherSvg` renderizáveis isoladamente |
| **2 — Keyframes CSS** | Definir animações de explosão e remontagem | `@keyframes explode` e `@keyframes assemble` funcionando num protótipo mínimo |
| **3 — Hero Rewrite** | Reescrever `Hero.tsx` com a nova cena | Hero renderiza a cena 3D com texto, CTAs e badge; `BannerData` compatível |
| **4 — A11y & Responsivo** | `prefers-reduced-motion` + mobile | Animação desabilitada com media query; peças reduzidas em `< 640px` |
| **5 — Testes** | Atualizar e expandir `Hero.test.tsx` | Todos os testes passam; cobertura de motion, fallback e CTAs |

---

## 📋 Master Task List

| # | Task | Status | Cx | Deps | Validação (Como testar?) |
| :-- | :--- | :---: | :---: | :---: | :--- |
| 01 | Criar branch `feat/hero-explosao-3d` e rodar testes baseline | [x] | XS | — | Branch criada; 6/9 testes verdes (3 falhas pré-existentes documentadas) |
| 02 | Criar SVGs inline: `BoltSvg`, `NutSvg`, `AnchorSvg`, `BushingSvg`, `WasherSvg` | [x] | M | 01 | Criados em `components/home/HeroDecor.tsx` |
| 03 | Definir `@keyframes explode-piece` no CSS | [x] | M | 02 | Adicionado ao final de `app/globals.css` com `prefers-reduced-motion` |
| 04 | Reescrever `Hero.tsx`: substituir `IndustrialDecor` pela cena de peças animadas | [x] | L | 03 | `ExplodingScene` importada de `HeroDecor.tsx`; `BannerData` preservada |
| 05 | Adicionar iluminação focal (radial gradient âmbar central) e faixa amber na base | [x] | S | 04 | Radial gradient em `ExplodingScene`; faixa amber mantida |
| 06 | Implementar `prefers-reduced-motion: reduce` desabilitando `@keyframes` | [x] | S | 04 | Media query `prefers-reduced-motion` em `globals.css` |
| 07 | Ajustar tamanhos das peças SVG para mobile (`< 640px`) | [x] | S | 04 | Classes `sm:` aplicadas nas peças; tamanhos reduzidos em mobile |
| 08 | Atualizar `Hero.test.tsx`: alinhar textos de fallback e adicionar testes de acessibilidade | [x] | M | 04 | 11/11 testes verdes; aria-hidden e WhatsApp CTA cobertos |
| 09 | Revisão final, commit e abertura de PR para `main` | [ ] | S | 08 | PR criado com título descritivo; CI passando |

**Legenda Cx:** XS < 30min · S < 1h · M 1–3h · L 3–6h

---

## 📓 Progress Log
*(Adicionar uma entrada a cada iteração ou branch concluído. Nunca remover as anteriores.)*

### Iteração 0 — Setup
- **Branch:** `—`
- **Resumo:** Plano de implementação criado e validado. Codebase mapeado: Hero.tsx usa carousel estático com `IndustrialDecor` (gears SVG); testes existentes com textos de fallback desalinhados com o código atual (a corrigir na Task 08).
- **Arquivos:** `.plans/hero-explosao-3d-fixadores.md`

---

## ⚠️ Deferred / Blocked

| Item | Motivo | Bloqueado por |
| :--- | :--- | :--- |
| Framer Motion | Usar apenas se CSS puro não for suficiente para suavidade — requer aprovação do responsável | Decisão do usuário |
| Ícones em `components/icons/` | Criar pasta separada ou manter inline no Hero — decidir na Task 02 | Task 02 |

---

## ✅ Checklists por Fase

### Fase 0 — Setup
- [ ] Executar `git checkout -b feat/hero-explosao-3d` a partir de `main`
- [ ] Rodar `npx jest __tests__/components/home/Hero.test.tsx` e documentar quais testes passam/falham no estado atual
- [ ] Confirmar que `npx run dev` sobe sem erros na branch nova

### Fase 1 — SVG Assets
- [ ] Criar `BoltSvg` (parafuso com rosca) como componente React inline
- [ ] Criar `NutSvg` (porca hexagonal) como componente React inline
- [ ] Criar `AnchorSvg` (âncora de fixação) como componente React inline
- [ ] Criar `BushingSvg` (bucha plástica) como componente React inline
- [ ] Criar `WasherSvg` (arruela) como componente React inline
- [ ] Cada SVG aceita `className` e `style` como props para posicionamento absoluto
- [ ] Decidir: SVGs inline no `Hero.tsx` ou em `components/icons/` separado

### Fase 2 — Keyframes CSS
- [ ] Definir `@keyframes explode-piece` com `transform: translate(x, y) rotate(deg) scale()`
- [ ] Definir `@keyframes assemble-piece` como inverso, com `ease-in` na chegada
- [ ] Cada peça recebe um `animation-delay` distinto para trajetórias individuais
- [ ] Ciclo total: ~2s explosão → ~2s pausa → ~2s remontagem → loop infinito
- [ ] Validar que as trajetórias são radialmente simétricas (peças em 8 direções)

### Fase 3 — Hero Rewrite
- [ ] Remover `IndustrialDecor` e o componente `WhatsAppIcon` (mover ícone para inline ou reaproveitar)
- [ ] Criar componente `ExplodingScene` com as 5 peças posicionadas absolutamente
- [ ] Adicionar radial gradient `brand-amber/20` ao centro da cena (camada separada, `aria-hidden`)
- [ ] Garantir que `z-index` do texto/CTAs seja superior ao da cena animada
- [ ] Preservar `data-testid="hero-section"`, `data-testid="hero-title"`, `data-testid="hero-subtitle"`, `data-testid="hero-cta"`
- [ ] Manter lógica de `BannerData` com fallback intacta
- [ ] Remover carousel (indicadores de slide) — nova hero não tem slides múltiplos visíveis

### Fase 4 — A11y & Responsivo
- [ ] Envolver toda `ExplodingScene` em `aria-hidden="true"`
- [ ] Adicionar `@media (prefers-reduced-motion: reduce)` que define `animation: none` para todas as peças
- [ ] Em `< 640px`: reduzir `width`/`height` dos SVGs para 50% ou esconder peças que sobreponham texto
- [ ] Testar com teclado: foco deve pular a cena animada diretamente para o CTA

### Fase 5 — Testes
- [ ] Corrigir textos de fallback no `Hero.test.tsx` para alinhar com o componente novo
- [ ] Adicionar teste: `aria-hidden` presente na cena animada
- [ ] Adicionar teste: CTA de WhatsApp renderiza com href correto
- [ ] Rodar `npx jest --coverage` e confirmar ≥ cobertura anterior

---

## 📝 Notes for Future Agents

- **Desalinhamento de testes pré-existente:** `Hero.test.tsx` espera `"Technicfix — Parafusos e Materiais de Obra"` e `"Qualidade e durabilidade para seus projetos"` no fallback, mas o componente atual exibe textos diferentes. Isso **já estava errado** antes desta feature — corrigir na Task 08 alinhando os testes ao novo componente.
- **`pointer-events`:** As peças SVG animadas devem ter `pointer-events: none` para nunca bloquear cliques nos CTAs sobrepostos.
- **Trajetórias radiais:** Para 5 peças, usar ângulos ~0°, 72°, 144°, 216°, 288° como vetores de explosão. Calcular `translateX/Y` com `cos(θ) * distância` e `sin(θ) * distância`.
- **Loop suave:** Para evitar salto visual no início do loop, o estado inicial dos keyframes deve coincidir com o estado final do ciclo montado (peças na posição central).
- **Sem `components/icons/`:** A pasta não existe ainda. Criar apenas se os SVGs tornarem o `Hero.tsx` maior que ~300 linhas; caso contrário, manter inline para simplicidade.
