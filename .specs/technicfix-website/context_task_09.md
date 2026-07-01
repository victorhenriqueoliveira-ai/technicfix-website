# Contexto — task_09

## Requisitos do PRD

- Painel admin: sidebar com navegação para Produtos, Categorias, Banners, Leads, Configurações
- Header do admin: nome do usuário logado + botão de logout
- Dashboard: métricas simples (total de produtos, categorias, leads novos)
- Layout protegido por sessão Auth.js (redirect para /admin/login se não autenticado)

## Especificação Técnica

### Estrutura de rotas

```
app/
  (admin)/
    layout.tsx          ← verifica sessão, renderiza sidebar + header
    admin/
      page.tsx          ← dashboard com métricas
```

Nota: `app/admin/login/page.tsx` já existe (task_03). A rota admin é protegida pelo middleware.ts também.

### `app/(admin)/layout.tsx`
- Server Component
- Importa `auth` de `@/auth` e verifica sessão: `const session = await auth()`
- Se sem sessão: `redirect('/admin/login')`
- Renderiza: `<AdminSidebar>` (esquerda, largura fixa) + `<AdminHeader>` (topo) + `{children}` (área principal)

### `components/admin/AdminSidebar.tsx`
Links:
- Dashboard → `/admin`
- Produtos → `/admin/produtos`
- Categorias → `/admin/categorias`
- Banners → `/admin/banners`
- Leads → `/admin/leads`
- Configurações → `/admin/configuracoes`

Usar `usePathname()` para highlight. Deve ser `'use client'`.

### `components/admin/AdminHeader.tsx`
- Exibe "Painel Admin" ou nome do usuário (email)
- Botão "Sair" que submete form com Server Action chamando `signOut()` de `@/auth`

### `app/(admin)/admin/page.tsx` — Dashboard
Server Component. Busca em paralelo:
```typescript
const [totalProdutos, totalCategorias, leadsNovos] = await Promise.all([
  db.product.count(),
  db.category.count(),
  db.lead.count({ where: { status: 'novo' } }),
])
```
Renderiza 3 cards de métricas com ícone + número + label.

### Rota group `(admin)`

A pasta `app/(admin)/` cria um route group para o layout admin, separado do layout público `(public)`. O arquivo `app/admin/login/page.tsx` fica FORA de `(admin)` para não herdar o layout admin (já existe, não mover).

## Estado de dependências

- task_02 (integrada): `db`, modelos Product/Category/Lead
- task_03 (integrada): `auth` e `signOut` disponíveis em `@/auth`, middleware protegendo /admin/*

## Importante para o worker

- NÃO criar CRUD pages — apenas layout, sidebar, header, dashboard
- `app/admin/login/` já existe — NÃO criar nem modificar
- Route group: criar `app/(admin)/layout.tsx` e `app/(admin)/admin/page.tsx`
- shadcn/ui Card disponível para os metric cards (instalar se necessário: `npx shadcn@latest add card`)
- Criar testes unitários: dashboard renderiza 3 métricas, sidebar tem todos os links, AdminHeader tem botão Sair
- NÃO executar npm install desnecessário (packages já instalados)
