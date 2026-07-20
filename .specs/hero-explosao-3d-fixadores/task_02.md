---
status: pending
title: "Criar SVGs inline dos 5 fixadores: BoltSvg, NutSvg, AnchorSvg, BushingSvg, WasherSvg"
type: feature
complexity: medium
dependencies: [task_01]
---

# Task 02: SVG Assets — Componentes dos Fixadores

## Overview

Criar os 5 componentes SVG inline que representam os produtos da TechnicFix. Eles serão usados na cena animada da task_04. Cada SVG deve ser reconhecível, desenhado com geometria simples e aceitar `className` + `style` para posicionamento absoluto.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- SVGs devem ter `aria-hidden="true"` diretamente no elemento `<svg>`
- Usar `currentColor` para fill/stroke (cor vem do className pai)
- Aceitar `className?: string` e `style?: React.CSSProperties` como props
- Não adicionar dependências externas — SVG inline puro
</critical>

<requirements>
- DEVE criar 5 componentes: `BoltSvg`, `NutSvg`, `AnchorSvg`, `BushingSvg`, `WasherSvg`
- DEVE cada um ter `aria-hidden="true"` no `<svg>`
- DEVE cada um aceitar `className` e `style` como props opcionais
- DEVE usar `currentColor` para as cores (fill ou stroke)
- DEVE ter tamanho padrão 60x60 (sobrescrito externamente)
- PODE ser criado inline em `components/home/Hero.tsx` ou em `components/icons/` separado — escolher baseado no tamanho resultante do arquivo
</requirements>

## Subtasks

- [ ] 2.1 Criar `BoltSvg` — parafuso com cabeça hexagonal, corpo cilíndrico e rosca na ponta
- [ ] 2.2 Criar `NutSvg` — porca hexagonal com furo circular no centro
- [ ] 2.3 Criar `AnchorSvg` — âncora plástica de fixação (formato de pino com aletas)
- [ ] 2.4 Criar `BushingSvg` — bucha/espaçador cilíndrico (vista lateral)
- [ ] 2.5 Criar `WasherSvg` — arruela (círculo com furo no centro, vista de cima)
- [ ] 2.6 Confirmar que cada SVG renderiza visualmente com `text-brand-amber` e `text-white` aplicados ao pai

## Implementation Details

Cada componente segue este padrão mínimo:

```tsx
interface SvgProps {
  className?: string
  style?: React.CSSProperties
}

function BoltSvg({ className, style }: SvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 60"
      width="60"
      height="60"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      style={style}
    >
      {/* paths do parafuso */}
    </svg>
  )
}
```

Para o `BoltSvg`, sugestão de geometria:
- Cabeça: hexágono regular centrado no topo (pontos a 0°, 60°, 120°, 180°, 240°, 300°)
- Corpo: retângulo estreito centralizado
- Rosca: linhas diagonais repetidas na parte inferior do corpo

Para o `NutSvg`:
- Hexágono externo
- Círculo interno (furo) — usar `fillRule="evenodd"` para criar o furo

Para o `WasherSvg`:
- Círculo grande externo
- Círculo menor interno (`fillRule="evenodd"`)

Para `AnchorSvg` e `BushingSvg`, geometria livre desde que seja reconhecível no segmento de fixação.

### Relevant Files

- `components/home/Hero.tsx` — onde os SVGs serão adicionados (inline) ou importados
- `components/icons/` — criar pasta apenas se o Hero.tsx ultrapassar ~300 linhas com os SVGs inline

## Deliverables

- 5 componentes SVG funcionais
- Cada um renderiza sem erros com `className` e `style` opcionais
- Sem testes unitários para SVGs decorativos (aria-hidden — não testamos conteúdo decorativo)

## Tests

- Verificação visual: renderizar cada SVG em `text-brand-amber` e confirmar que a cor é aplicada
- `npx tsc --noEmit` sem erros após criar os componentes

## Success Criteria

- 5 SVGs criados, cada um com `aria-hidden="true"` e `currentColor`
- TypeScript sem erros
- Visualmente reconhecíveis como peças de fixação
