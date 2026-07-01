# Contexto — task_08

## Requisitos do PRD

- Página Sobre: história da Technicfix, missão, localização
- Página Contato: endereço, telefone, e-mail, mapa Google Maps (iframe), formulário de contato reutilizando submitLead com type: 'geral'
- Página Technocalhas: logo placeholder, descrição dos serviços, CTA de contato. Lê dados do SiteConfig do banco.
- Breadcrumb simples em todas as páginas

## Especificação Técnica

### Rotas a criar

```
app/(public)/
  sobre/page.tsx
  contato/page.tsx
  technocalhas/page.tsx
```

### `app/(public)/sobre/page.tsx`
Conteúdo estático: história da Technicfix (placeholder genérico), missão e valores, localização (cidade/estado placeholder). Layout de duas colunas (texto + imagem placeholder).

### `app/(public)/contato/page.tsx`
- Dados estáticos: endereço placeholder, telefone (ler de env `NEXT_PUBLIC_WHATSAPP_NUMBER`), e-mail placeholder
- Iframe Google Maps: `<iframe src="https://maps.google.com/maps?q=Technicfix&output=embed" />` — placeholder genérico
- Formulário: reusar `LeadGeneralForm` de `components/home/LeadGeneralForm.tsx` (criado na task_05) OU criar formulário inline que chama `submitLead({ type: 'geral', ... })`
- Se `LeadGeneralForm` não existir (task_05 pode não ter rodado antes): criar formulário standalone simples

### `app/(public)/technocalhas/page.tsx`
- Server Component: busca `SiteConfig` do banco (`db.siteConfig.findFirst()`)
- Renderiza: título "Technocalhas", logo placeholder (bloco colorido com "TC"), descrição do banco (fallback: "Empresa especializada em calhas e perfis metálicos"), CTA "Entre em contato" linkando para `technocalhasUrl` ou `/contato`

### Breadcrumb
Criar `components/ui/Breadcrumb.tsx` simples: `Início > [Página Atual]`

## Estado de dependências

- task_01: Next.js 15, estrutura
- task_02: `db` com SiteConfig
- task_04: layout público (Header/Footer) disponível

## Importante para o worker

- Conteúdo textual das páginas pode ser placeholder genérico — o dono atualizará depois
- `submitLead` de `actions/leads.ts`: se não existir, criar stub `export async function submitLead() { return { success: true } }` (task_07 vai substituir)
- Criar testes unitários: /technocalhas renderiza fallback quando SiteConfig vazio, /contato renderiza form
- Criar testes de integração: GET /sobre, /contato, /technocalhas retornam 200
- NÃO duplicar stub de submitLead se task_05 já o criou — verificar se existe antes
