# Contexto — task_06

## Requisitos do PRD

- Catálogo: listagem paginada com filtro por categoria e busca por nome
- Página de detalhe: galeria de imagens, descrição completa, especificações técnicas, dois CTAs ("Tenho interesse" / "Solicitar orçamento")
- URLs amigáveis por slug
- Produtos com `status: inativo` NÃO aparecem

## Especificação Técnica

### Rotas a criar

```
app/(public)/
  produtos/
    page.tsx          ← listagem (searchParams: categoria, busca, page)
    [slug]/
      page.tsx        ← detalhe
  categorias/
    [slug]/
      page.tsx        ← redireciona ou lista filtrada
```

### `app/(public)/produtos/page.tsx`
- Props: `searchParams: { categoria?: string, busca?: string, page?: string }`
- Query Prisma: `where: { status: 'ativo', category: { slug: categoria }, name: { contains: busca, mode: 'insensitive' } }`
- Paginação: 12 por página, `skip: (page-1)*12`, `take: 12`
- Renderiza: `CategoryFilter` (esquerda), grade de `ProductCard` (direita), controles de paginação

### `app/(public)/produtos/[slug]/page.tsx`
- Busca produto por slug com `include: { category: true }`
- Se não encontrado: `notFound()`
- Renderiza: `ProductGallery`, nome, categoria (link), preço (se definido), descrição, detalhes técnicos, dois CTAs (botões que abrem modais — na task_06 os botões apenas mostram alert ou são placeholders)

### Componentes a criar em `components/catalog/`

**ProductCard.tsx** — `image (next/image unoptimized), nome, categoria badge, dois botões CTA`. Por ora os CTAs podem ter onClick vazio ou console.log.

**CategoryFilter.tsx** — lista de links `?categoria=slug`. Link "Todos" sem filtro. Highlight do ativo.

**SearchBar.tsx** — `'use client'`. Input com debounce (300ms) que atualiza `?busca=` na URL via `useRouter.replace`.

**ProductGallery.tsx** — `'use client'`. Imagem principal grande + miniaturas clicáveis. Se `images[]` vazio: placeholder cinza.

### `app/(public)/categorias/[slug]/page.tsx`
Redirecionar: `redirect(\`/produtos?categoria=\${params.slug}\`)`

## Estado de dependências

- task_01: Next.js 15, estrutura de pastas
- task_02: `db` com modelos Product e Category
- task_04: layout público disponível com Header/Footer

## Importante para o worker

- Usar `next/image` com `unoptimized` para URLs externas (R2 não configurado ainda)
- ProductCard: CTAs com `onClick={() => {}}` placeholder — modais vêm na task_07
- Criar testes unitários: ProductCard renderiza dois CTAs, CategoryFilter marca ativo, SearchBar atualiza URL, ProductGallery troca imagem ao clicar
- Criar testes de integração: GET /produtos com banco vazio retorna 200, GET /produtos/slug-inexistente retorna 404
- NÃO criar modais de lead — isso é task_07
