<task>
Correções e melhorias de navegação no Header — Technicfix
</task>

<goal>
Corrigir erros de importação que causam falha em runtime (PriceFilter com Slider undefined), fechar o menu mobile automaticamente após busca e adicionar dropdowns de Categorias e Produtos no Header para facilitar a navegação direta ao catálogo.
</goal>

<requirements>
Negocio:
- O site não pode travar em runtime por imports mal resolvidos de componentes de UI.
- O visitante mobile deve ser redirecionado para os resultados de busca sem precisar fechar o menu manualmente.
- O visitante desktop e mobile deve conseguir acessar qualquer categoria ou produto diretamente pelo Header, sem precisar passar pela página de listagem.
- O dropdown de Produtos exibe no máximo 30 itens em ordem alfabética, com link "Ver todos os produtos" ao final apontando para /produtos.

Arquitetura:
- Corrigir o import de @base-ui/react/Slider em components/catalog/PriceFilter.tsx: trocar `import * as Slider` por `import { Slider }` para que Slider.Root, Slider.Track etc. estejam definidos.
- Varrer todos os componentes do projeto em busca de outros imports de @base-ui/react ou de qualquer lib UI que possam resultar em `undefined` no render (ex.: import namespace vs named export).
- O Header atual é Server Component; os dados de categorias e produtos para os dropdowns devem ser buscados no Server Component pai e passados como props aos sub-componentes client.
- O Sheet (menu hambúrguer mobile) usa estado open controlado externamente para permitir que a busca feche o drawer programaticamente.
- As listas de categorias e produtos para os dropdowns devem vir do banco (Prisma) ordenadas por nome ASC.
- Reaproveitar o componente HeaderSearchBar existente; adicionar callback onSearch que sinaliza ao Header para fechar o Sheet.

UI/UX:
- Desktop: itens "Categorias" e "Produtos" aparecem na NavBar (Camada 3 do Header ou na MainBar), cada um abre um dropdown ao hover ou click, com lista de links em coluna, scroll interno se necessário.
- Mobile: os mesmos itens aparecem como accordions dentro do Sheet (menu hambúrguer), cada um expande/colapsa ao toque, sem fechar o menu.
- Ao confirmar busca (Enter ou clique no botão) dentro do menu mobile, o Sheet fecha antes da navegação.
- Links de categorias: /categorias/[slug]; links de produtos: /produtos/[slug].
- Dropdown de Produtos: máximo 30 itens A–Z + link "Ver todos os produtos" fixo no final.
- Dropdown de Categorias: todos os itens sem limite (tipicamente < 20).
</requirements>

<acceptance_criteria>
- Dado que o visitante acessa /produtos, quando o PriceFilter é renderizado, então não ocorre erro "Element type is invalid" nem tela em branco.
- Dado que o visitante mobile abre o menu hambúrguer e digita uma busca, quando pressiona Enter ou clica no botão de busca, então o menu fecha e a página de resultados é exibida.
- Dado que o visitante desktop posiciona o cursor sobre "Categorias" no Header, quando o dropdown abre, então todas as categorias do banco aparecem em ordem alfabética com links para /categorias/[slug].
- Dado que o visitante desktop posiciona o cursor sobre "Produtos" no Header, quando o dropdown abre, então até 30 produtos ativos aparecem em ordem alfabética com links para /produtos/[slug] e um link "Ver todos os produtos" ao final.
- Dado que o visitante mobile abre o menu hambúrguer, quando toca em "Categorias" ou "Produtos", então um accordion expande com a lista de links correspondente sem fechar o menu.
- Dado que nenhum produto ativo existe no banco, quando o dropdown de Produtos é aberto, então aparece apenas o link "Ver todos os produtos".
</acceptance_criteria>

<constraints>
FAÇA: corrigir o import de Slider como `import { Slider } from '@base-ui/react/Slider'` em PriceFilter.tsx.
FAÇA: varrer todos os componentes que usam libs UI externas em busca de padrões de import que possam retornar undefined.
FAÇA: buscar categorias e produtos no Server Component e passar via props para evitar fetch client-side desnecessário.
FAÇA: controlar o estado open do Sheet no Header para poder fechá-lo via callback da busca.
FAÇA: manter o Header como Server Component na camada de dados; extrair partes interativas para Client Components específicos.
NÃO FAÇA: buscar categorias ou produtos direto no Client Component com useEffect/fetch.
NÃO FAÇA: remover ou alterar o comportamento existente do menu mobile além do fechamento automático após busca.
NUNCA: renderizar todos os produtos no dropdown sem limite — máximo 30 itens + link "Ver todos".
</constraints>
