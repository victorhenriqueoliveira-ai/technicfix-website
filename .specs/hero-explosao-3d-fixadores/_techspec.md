# TechSpec — Hero Explosão 3D: Parafusos e Fixadores

## Arquitetura Geral

### Arquivo principal
`components/home/Hero.tsx` — reescrita completa. Exporta `Hero` (componente) e `BannerData` (interface). Não alterar exports.

### Teste associado
`__tests__/components/home/Hero.test.tsx` — atualizar na task_08 para alinhar com o novo componente.

### Consumidor
`app/(public)/page.tsx` — usa `<Hero banners={banners} />`. Não alterar.

### CSS global
`app/globals.css` — tokens de cor disponíveis:
- `--color-brand-navy` / `var(--brand-navy)`
- `--color-brand-navy-dark` / `var(--brand-navy-dark)`
- `--color-brand-amber` / `var(--brand-amber)`

---

## Interface BannerData (imutável)

```ts
export interface BannerData {
  id: string
  imageUrl: string
  title: string
  subtitle?: string | null
  ctaText?: string | null
  ctaUrl?: string | null
  order: number
  active: boolean
}
```

Esta interface **não pode ser alterada** — é tipagem compartilhada com o admin.

---

## Estrutura do componente Hero.tsx

```
Hero.tsx
├── BannerData (interface exportada — não alterar)
├── FALLBACK_BANNER (constante)
├── whatsappHref (constante — não alterar)
├── Hero({ banners }) — componente principal
│   ├── <section> aria-label="Banner principal" data-testid="hero-section"
│   ├── fundo: gradiente brand-navy
│   ├── <ExplodingScene> aria-hidden="true" — cena animada
│   ├── radial gradient focal (brand-amber/20)
│   └── conteúdo z-10: badge, h1, subtítulo, CTAs
├── ExplodingScene — cena com as 5 peças SVG
├── BoltSvg — parafuso com rosca
├── NutSvg — porca hexagonal
├── AnchorSvg — âncora de fixação
├── BushingSvg — bucha plástica
├── WasherSvg — arruela
└── WhatsAppIcon — ícone do CTA
```

---

## SVG Components

Cada componente SVG deve:
- Aceitar `className?: string` e `style?: React.CSSProperties`
- Ter `aria-hidden="true"` no elemento `<svg>`
- Ser desenhado com geometria simples mas reconhecível (parafuso = corpo cilíndrico + rosca + cabeça hexagonal; porca = hexágono com furo circular; etc.)
- Tamanho padrão sugerido: `width="60" height="60"` (sobrescrito via className/style)
- Cor: `currentColor` para `fill` ou `stroke`, herdando da Tailwind class pai

### Posicionamento das peças na cena

Usar `position: absolute` com coordenadas em `%` para responsividade:

```
BoltSvg    → topo-centro        (top: 10%, left: 48%)
NutSvg     → direita-alta       (top: 20%, right: 15%)
AnchorSvg  → direita-baixa      (bottom: 25%, right: 12%)
BushingSvg → esquerda-baixa     (bottom: 20%, left: 10%)
WasherSvg  → esquerda-alta      (top: 25%, left: 15%)
```

---

## Animação CSS

### Estratégia
`@keyframes` CSS puras com classes Tailwind customizadas ou `<style>` tag no componente (preferir globals.css para reutilização).

### Ciclo de animação (total ~6s)
- **0% → 33%**: peças explodem do centro para fora (fase "explode")
- **33% → 50%**: peças em posição explodida (pausa)
- **50% → 83%**: peças gravitam de volta ao centro (fase "assemble")
- **83% → 100%**: peças na posição final (pausa antes do próximo ciclo)

### Keyframes por peça

Cada peça tem sua própria `animation-delay` para criar movimento assíncrono natural:

```css
/* Vetor de explosão para cada peça (trajetórias radiais) */
/* BoltSvg: explode para cima */
@keyframes explode-bolt {
  0%, 83% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
  33%, 50% { transform: translate(0px, -120px) rotate(-15deg) scale(0.8); opacity: 0.7; }
}

/* NutSvg: explode para direita-cima */
@keyframes explode-nut {
  0%, 83% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
  33%, 50% { transform: translate(100px, -80px) rotate(20deg) scale(0.8); opacity: 0.7; }
}

/* AnchorSvg: explode para direita-baixo */
@keyframes explode-anchor {
  0%, 83% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
  33%, 50% { transform: translate(90px, 100px) rotate(10deg) scale(0.8); opacity: 0.7; }
}

/* BushingSvg: explode para esquerda-baixo */
@keyframes explode-bushing {
  0%, 83% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
  33%, 50% { transform: translate(-95px, 90px) rotate(-20deg) scale(0.8); opacity: 0.7; }
}

/* WasherSvg: explode para esquerda-cima */
@keyframes explode-washer {
  0%, 83% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
  33%, 50% { transform: translate(-100px, -85px) rotate(25deg) scale(0.8); opacity: 0.7; }
}
```

**Delays:**
- BoltSvg: `animation-delay: 0s`
- NutSvg: `animation-delay: 0.15s`
- AnchorSvg: `animation-delay: 0.3s`
- BushingSvg: `animation-delay: 0.45s`
- WasherSvg: `animation-delay: 0.6s`

**Animation shorthand:** `animation: explode-bolt 6s ease-in-out infinite`

### prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  [class*="explode-"] {
    animation: none !important;
    transform: translate(0, 0) !important;
  }
}
```

---

## Estrutura do JSX (Hero principal)

```tsx
<section aria-label="Banner principal" data-testid="hero-section" className="relative w-full overflow-hidden">
  <div className="relative min-h-[480px] md:min-h-[580px] flex items-center justify-center">

    {/* Fundo navy */}
    <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-navy to-brand-navy-dark" />

    {/* Overlay escuro */}
    <div className="absolute inset-0 bg-black/50" />

    {/* Iluminação focal âmbar */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-brand-amber)/20_0%,_transparent_70%)]" aria-hidden="true" />

    {/* Cena animada */}
    <ExplodingScene aria-hidden="true" />

    {/* Conteúdo */}
    <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
      {/* badge */}
      {/* h1 data-testid="hero-title" */}
      {/* p data-testid="hero-subtitle" */}
      {/* CTAs: WhatsApp + Ver Produtos / banner.ctaText */}
    </div>

    {/* Faixa amber na base */}
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-amber" />
  </div>
</section>
```

---

## data-testid obrigatórios (manter)

| testid | Elemento |
|--------|----------|
| `hero-section` | `<section>` raiz |
| `hero-title` | `<h1>` com o título do banner |
| `hero-subtitle` | `<p>` com subtítulo (quando presente) |
| `hero-cta` | Link secundário (CTA do banner ou "Ver Produtos") |

---

## Testes (Hero.test.tsx)

O arquivo atual tem 9 testes. Problema identificado: textos esperados no fallback diferem do componente real. Na task_08, alinhar e adicionar:

- Manter todos os testes de comportamento existentes (renderização de título, subtítulo, CTA, aria-label)
- Corrigir textos de fallback para coincidir com o novo `FALLBACK_BANNER`
- Adicionar: teste que confirma `aria-hidden="true"` na cena animada
- Adicionar: teste que confirma CTA de WhatsApp renderiza com `href` contendo `wa.me`
- **Não testar** CSS animations (não testável via jsdom)

---

## Mobile (< 640px)

```css
@media (max-width: 639px) {
  .exploding-scene svg {
    width: 32px !important;
    height: 32px !important;
  }
}
```

Ou via Tailwind: adicionar classes `sm:w-16 w-8` nos SVGs.

---

## Notas críticas

1. **pointer-events: none** em todos os SVGs da `ExplodingScene` para nunca bloquear CTAs.
2. O `ExplodingScene` envolve todos os SVGs numa `<div>` com `position: absolute; inset: 0; aria-hidden="true"`.
3. O fallback sem imagem usa o mesmo background navy (sem `<img>`). A lógica de imagem (`hasImage`) pode ser mantida ou removida dependendo do design final.
4. Remover os `IndustrialDecor` (gears SVGs) e a lógica de indicadores de slide — não haverá mais carousel.
5. O `WhatsAppIcon` pode ser mantido inline no arquivo ou movido para `components/icons/`.
