# ADR-001: Uso de next-auth@5.0.0-beta.31 em produção

## Status

Aceito

## Data

2026-07-17

## Contexto

O projeto Technicfix adota autenticação via `next-auth` (NextAuth.js v5). A versão disponível no momento da implementação do módulo de administração era `5.0.0-beta.31` — ainda em fase beta, sem release estável publicado no npm.

A versão v5 do NextAuth representa uma reescrita significativa em relação à v4, introduzindo:
- API unificada via `auth()` exportada de `auth.ts`
- Exportações nomeadas: `{ handlers, auth, signIn, signOut }`
- Suporte nativo ao App Router do Next.js
- Novo schema de sessão (JWT por padrão, sem banco de dados)

O projeto usa as seguintes exportações diretamente em produção:

```ts
// auth.ts
export const { handlers, auth, signIn, signOut } = NextAuth({ ... })
```

A versão beta foi adotada porque é a única que oferece suporte completo ao App Router do Next.js 15, utilizado neste projeto. A versão estável da v4 não suporta o padrão de `async` Server Components e `auth()` como middleware de servidor.

## Decisão

Continuar utilizando `next-auth@5.0.0-beta.31` em produção de forma monitorada, até que uma versão estável (sem sufixo `beta` ou `rc`) seja publicada no npm e os critérios de upgrade definidos abaixo sejam atendidos.

## Riscos

### Breaking Changes entre beta e stable

O ciclo beta do NextAuth v5 tem histórico de introduzir breaking changes entre versões beta:

| Área de Risco | Descrição |
|---|---|
| API `auth()` | Assinatura ou comportamento de retorno pode mudar entre beta e stable |
| `signIn()` / `signOut()` | Opções e comportamento de redirecionamento podem ser alterados |
| Schema de sessão | Formato do token JWT ou campos `user`, `expires` podem sofrer renomeação |
| Callbacks | Assinaturas de `jwt`, `session`, `authorized` podem ser alteradas |
| Providers | API de `Credentials` provider pode mudar (ex.: campo `authorize`) |
| Middleware | Integração com `middleware.ts` via `auth` como handler pode quebrar |

### Riscos Operacionais

- **Suporte limitado**: Issues de bugs em versões beta têm menor prioridade no repositório oficial
- **Documentação instável**: A documentação oficial pode não refletir a versão em uso
- **Segurança**: Vulnerabilidades de segurança em versões beta podem demorar mais para receber patches backportados
- **Compatibilidade**: Atualizações automáticas de dependências transitivas podem introduzir incompatibilidades

## Critérios de Upgrade

O upgrade para a versão estável do NextAuth DEVE ser executado somente quando **todos** os critérios abaixo forem atendidos:

### Critério 1 — Versão estável publicada no npm

```bash
npm view next-auth version
# Resultado esperado: X.Y.Z (sem sufixo -beta, -rc, -alpha ou similar)
```

Verificação objetiva: executar o comando acima e confirmar que a versão retornada não contém nenhum dos sufixos: `beta`, `rc`, `alpha`, `canary`, `next`.

### Critério 2 — Changelog sem breaking changes nas APIs utilizadas

Verificar o changelog oficial da versão stable em:
- https://github.com/nextauthjs/next-auth/releases

Confirmar que **nenhuma** das seguintes APIs sofreu breaking change na versão stable em relação à `5.0.0-beta.31`:
- `auth()` (função de autenticação no servidor)
- `signIn()` e `signOut()`
- Schema de `session.user` e `session.expires`
- Callback `jwt` e `session`
- Provider `Credentials` e campo `authorize`

Se o changelog listar breaking changes nessas áreas, o upgrade requer um plano de migração antes de ser executado.

### Critério 3 — Ausência de issues críticas abertas no repositório oficial

Verificar no repositório `nextauthjs/next-auth` no GitHub:
- Filtrar issues abertas com labels: `bug` + `severity:high` ou `security`
- Período: issues abertas nos últimos 30 dias antes da data planejada para o upgrade
- Critério de aprovação: zero issues críticas sem resposta do maintainer em mais de 7 dias

URL de verificação: https://github.com/nextauthjs/next-auth/issues?q=is%3Aopen+is%3Aissue+label%3Abug

### Critério 4 — Build e testes passando após bump da versão

Antes de commitar o upgrade em produção:
1. Executar `npm install next-auth@latest` no ambiente de desenvolvimento
2. Executar `npm run build` sem erros de TypeScript ou de runtime
3. Testar manualmente o fluxo de login/logout no ambiente de staging
4. Verificar que sessões existentes não foram invalidadas inesperadamente

## Alternativas Consideradas

### Alternativa A: Usar next-auth v4 (versão estável)

- **Prós**: versão estável, amplamente testada, suporte garantido
- **Contras**: não suporta App Router do Next.js 15; requer uso de `getServerSession()` e padrões depreciados
- **Por que rejeitada**: incompatível com a arquitetura adotada (App Router + Server Components)

### Alternativa B: Implementar autenticação customizada sem next-auth

- **Prós**: controle total, sem dependência de biblioteca em beta
- **Contras**: alto custo de implementação e manutenção; reinventa soluções já resolvidas (CSRF, JWT, session management)
- **Por que rejeitada**: não justificado para o escopo e tamanho do projeto

## Consequências

### Positivas

- Suporte completo ao App Router do Next.js 15
- API limpa e unificada (`auth()`, `signIn()`, `signOut()`)
- Preparação antecipada para a versão estável (sem migração de v4 → v5 no futuro)

### Negativas

- Risco de breaking changes entre beta e stable exige monitoramento
- Qualquer desenvolvedor que faça upgrade de dependências deve verificar se `next-auth` foi alterado

### Mitigações Ativas

- Versão fixada com `^5.0.0-beta.31` no `package.json` (range compatível dentro do beta)
- Este ADR serve como checklist obrigatório antes de qualquer upgrade da dependência
- Revisão do `package.json` incluída no processo de code review

## Referências

- Repositório oficial: https://github.com/nextauthjs/next-auth
- Releases e changelog: https://github.com/nextauthjs/next-auth/releases
- Guia de migração v4 → v5: https://authjs.dev/getting-started/migrating-to-v5
- Documentação NextAuth v5: https://authjs.dev/reference/nextjs
- Issue tracker (bugs): https://github.com/nextauthjs/next-auth/issues?q=is%3Aopen+label%3Abug
- `package.json` do projeto: versão em uso `"next-auth": "^5.0.0-beta.31"`
- `auth.ts` na raiz do repositório: ponto de entrada das exportações de autenticação
