---
status: pending
title: "Implementar prefers-reduced-motion: desabilitar animação para acessibilidade"
type: a11y
complexity: small
dependencies: [task_04]
---

# Task 06: Acessibilidade — prefers-reduced-motion

## Overview

Garantir que usuários com `prefers-reduced-motion: reduce` configurado no sistema operacional vejam a hero no estado estático final (peças na posição central, sem animação). Isso é um requisito de acessibilidade, não opcional.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- A media query `prefers-reduced-motion: reduce` DEVE desabilitar todas as animações explode-*
- O estado estático deve mostrar as peças na posição "montada" (centro), não na posição "explodida"
- Usar `animation: none !important` para garantir que nenhuma especificidade CSS sobrescreva
</critical>

<requirements>
- DEVE confirmar que `@media (prefers-reduced-motion: reduce)` em `app/globals.css` neutraliza todas as animações `explode-*`
- DEVE testar com DevTools → Emular `prefers-reduced-motion: reduce`
- DEVE garantir que as peças ficam visíveis (não invisíveis) no estado reduzido
- NÃO DEVE ocultar a cena estática — as peças devem aparecer na posição final (centro)
</requirements>

## Subtasks

- [ ] 6.1 Confirmar que a regra `@media (prefers-reduced-motion: reduce)` está em `app/globals.css` (adicionada na task_03)
- [ ] 6.2 Testar no browser: DevTools → More tools → Rendering → Emulate prefers-reduced-motion → reduce
- [ ] 6.3 Confirmar que as peças aparecem estáticas na posição central
- [ ] 6.4 Confirmar que o badge, título, subtítulo e CTAs continuam visíveis no estado reduzido

## Implementation Details

A regra já deve estar em `app/globals.css` da task_03. Esta task é de verificação e, se necessário, correção.

Se a regra não cobrir todos os elementos animados, expandir:

```css
@media (prefers-reduced-motion: reduce) {
  .animate-explode-bolt,
  .animate-explode-nut,
  .animate-explode-anchor,
  .animate-explode-bushing,
  .animate-explode-washer {
    animation: none !important;
    transform: none !important;
    opacity: 1 !important;
  }
}
```

Alternativa com seletor mais abrangente se usar classes dinâmicas:

```css
@media (prefers-reduced-motion: reduce) {
  [class*="explode-"] {
    animation: none !important;
    transform: none !important;
  }
}
```

### Relevant Files

- `app/globals.css` — verificar/corrigir regra prefers-reduced-motion
- `components/home/Hero.tsx` — confirmar que classes animadas são selecionadas pela regra

## Deliverables

- Animação desabilitada com `prefers-reduced-motion: reduce`
- Peças visíveis e estáticas no estado reduzido

## Tests

- DevTools → Emular `prefers-reduced-motion: reduce` → hero sem animação, peças estáticas visíveis
- `npx tsc --noEmit` sem erros

## Success Criteria

- Animação completamente desabilitada com `prefers-reduced-motion: reduce` ativo
- Peças visíveis no estado estático (não sumidas)
