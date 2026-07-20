# Hero Explosão 3D — Lista de Tarefas

## Tasks

| # | Title | Status | Complexity | Dependencies |
|---|-------|--------|------------|--------------|
| 01 | Baseline: rodar testes existentes e documentar estado atual do Hero | pending | low | — |
| 02 | Criar SVGs inline dos 5 fixadores: BoltSvg, NutSvg, AnchorSvg, BushingSvg, WasherSvg | pending | medium | task_01 |
| 03 | Definir @keyframes CSS: explode-piece e assemble-piece com trajetórias radiais | pending | medium | task_02 |
| 04 | Reescrever Hero.tsx: substituir IndustrialDecor pela ExplodingScene com peças animadas | pending | high | task_03 |
| 05 | Adicionar iluminação focal (radial gradient âmbar central) e preservar faixa amber na base | pending | small | task_04 |
| 06 | Implementar prefers-reduced-motion: desabilitar animação para acessibilidade | pending | small | task_04 |
| 07 | Ajustar SVGs para mobile (<640px): reduzir tamanhos sem sobrepor texto | pending | small | task_04 |
| 08 | Atualizar Hero.test.tsx: alinhar textos de fallback e adicionar testes de acessibilidade | pending | medium | task_04 |
| 09 | Revisão final: validar visualmente, todos os testes verdes, abrir PR | pending | small | task_05, task_06, task_07, task_08 |
