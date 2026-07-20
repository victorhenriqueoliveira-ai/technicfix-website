---
status: pending
title: "Atualizar Hero.test.tsx: alinhar textos de fallback e adicionar testes de acessibilidade"
type: test
complexity: medium
dependencies: [task_04]
---

# Task 08: Testes — Atualizar Hero.test.tsx

## Overview

Atualizar `__tests__/components/home/Hero.test.tsx` para alinhar com o novo componente Hero. Os textos de fallback esperados precisam ser corrigidos (havia desalinhamento pré-existente entre testes e código). Adicionar novos testes de acessibilidade e comportamento.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- NUNCA remover testes existentes — apenas corrigir textos desalinhados e adicionar novos
- Os `data-testid` obrigatórios devem estar presentes: hero-section, hero-title, hero-subtitle, hero-cta
- Não testar CSS animations via jsdom — apenas comportamento funcional
</critical>

<requirements>
- DEVE corrigir textos de fallback desalinhados (verificar `FALLBACK_BANNER` atual no Hero.tsx e atualizar os `screen.getByText` correspondentes)
- DEVE manter todos os testes de comportamento existentes (renderização de título, subtítulo, CTA, aria-label)
- DEVE adicionar: teste que confirma `aria-hidden="true"` na cena animada (`ExplodingScene` ou container equivalente)
- DEVE adicionar: teste que confirma CTA de WhatsApp renderiza com `href` contendo `wa.me`
- DEVE garantir que `npx jest __tests__/components/home/Hero.test.tsx` passa 100% ao final
</requirements>

## Subtasks

- [ ] 8.1 Ler `FALLBACK_BANNER` no Hero.tsx novo e identificar os textos reais (title, subtitle, badge)
- [ ] 8.2 Corrigir os dois testes que verificam textos de fallback (estava esperando "Technicfix — Parafusos e Materiais de Obra")
- [ ] 8.3 Confirmar que o teste de `hero-cta` no fallback continua válido (verificar se o data-testid existe no fallback)
- [ ] 8.4 Adicionar teste: container da cena animada tem `aria-hidden="true"`
- [ ] 8.5 Adicionar teste: CTA de WhatsApp tem `href` contendo `wa.me` (ou `/contato` como fallback)
- [ ] 8.6 Rodar `npx jest __tests__/components/home/Hero.test.tsx` e confirmar 100% passando

## Implementation Details

Problema pré-existente identificado:

```
// Teste atual espera:
screen.getByText('Technicfix — Parafusos e Materiais de Obra')
screen.getByText('Qualidade e durabilidade para seus projetos')

// Mas Hero.tsx tem FALLBACK_BANNER com:
title: 'Fixação que não Falha'
subtitle: 'Parafusos, fixadores e muito mais para sua obra...'
// E badge: 'TechnicFix — Parafusos e Fixadores'
```

O novo Hero pode ter o FALLBACK_BANNER atualizado com textos mais coerentes — alinhar os testes com o que foi implementado na task_04.

Para o teste de `aria-hidden`:

```tsx
it('a cena animada tem aria-hidden para acessibilidade', () => {
  render(<Hero banners={[]} />)
  const scene = document.querySelector('[aria-hidden="true"]')
  expect(scene).toBeInTheDocument()
})
```

Para o teste de WhatsApp CTA (mockando `NEXT_PUBLIC_WHATSAPP_NUMBER`):

```tsx
it('renderiza CTA de WhatsApp com href correto', () => {
  render(<Hero banners={[]} />)
  const whatsappCta = screen.getByRole('link', { name: /whatsapp/i })
  expect(whatsappCta.getAttribute('href')).toMatch(/wa\.me|\/contato/)
})
```

### Relevant Files

- `__tests__/components/home/Hero.test.tsx` — arquivo principal desta task
- `components/home/Hero.tsx` — ler para extrair textos reais do FALLBACK_BANNER

## Deliverables

- `Hero.test.tsx` atualizado com textos corretos
- 2 novos testes adicionados (aria-hidden, WhatsApp CTA)
- `npx jest Hero` 100% verde

## Tests

- `npx jest __tests__/components/home/Hero.test.tsx --verbose` — todos os testes passando
- `npx jest --coverage` — sem regressão de cobertura

## Success Criteria

- Todos os testes existentes passando (sem remoção)
- 2 novos testes adicionados
- Cobertura mantida ou aumentada
