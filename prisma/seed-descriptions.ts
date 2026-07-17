import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const DESCRIPTIONS: Record<string, string> = {
  // Parafusos
  'Parafuso sextavado':
    'Parafuso com cabeça sextavada para aperto com chave de boca ou chave de fenda. Fabricado em aço carbono com tratamento anticorrosivo, ideal para fixações estruturais em metal, madeira e concreto. Disponível em diversas bitolas e comprimentos.',
  'Parafuso Allen':
    'Parafuso com encaixe interno hexagonal (Allen), projetado para instalações que exigem alta resistência e acabamento limpo. Muito utilizado em montagem de equipamentos industriais, máquinas e móveis. Aço carbono tratado termicamente.',
  'Parafuso chipboard':
    'Parafuso de rosca soberba desenvolvido especialmente para fixação em madeira aglomerada, MDF e OSB. Rosca autoatarraxante de passo largo garante maior resistência ao arrancamento. Cabeça chata com fenda Philips ou Torx.',
  'Parafuso autoatarraxante':
    'Parafuso com ponta perfurante que dispensa pré-furação em chapas metálicas finas. Ideal para montagem de perfis de aço, telhas metálicas, calhas e estruturas galvanizadas. Alta resistência ao torque e à corrosão.',
  'Parafuso para drywall':
    'Parafuso de rosca fina e grossa desenvolvido para fixação de chapas de gesso (drywall) em perfis metálicos ou madeira. Ponta aguda facilita a penetração sem pré-furação. Cabeça trompete minimiza o dano à superfície.',
  'Parafuso soberba':
    'Parafuso com rosca larga de passo grosso para fixação em madeira maciça e compensado. Excelente resistência ao arranque e fácil instalação. Disponível com cabeça chata, oval ou panela, com acabamento zincado ou inox.',
  'Parafuso francês':
    'Parafuso com cabeça redonda e quadrado sob a cabeça, projetado para não girar ao apertar a porca. Amplamente utilizado em fixações de madeira, estruturas de cercas, portões e conexões onde o acesso ao parafuso é limitado.',
  'Parafuso de máquina':
    'Parafuso de uso geral com rosca métrica, utilizado com porca para montagem de equipamentos, máquinas e estruturas metálicas. Fabricado em aço carbono com tratamento de superfície para resistência à corrosão. Disponível nas classes 4.8, 8.8 e inox.',
  'Parafuso inox':
    'Parafuso fabricado em aço inoxidável AISI 304 ou 316, com alta resistência à corrosão e oxidação. Indicado para ambientes úmidos, marítimos, alimentícios e químicos. Mantém integridade estrutural e estética mesmo em condições adversas.',
  'Parafuso flangeado':
    'Parafuso com flange integrada sob a cabeça que distribui a carga e elimina a necessidade de arruela. Garante fixação segura e rápida em chapas metálicas, peças plásticas e montagens automotivas. Fabricado em aço com tratamento anticorrosivo.',

  // Porcas
  'Porca sextavada':
    'Porca de seis lados para aperto com chave de boca ou chave de fenda. Fabricada em aço carbono com tratamento zincado ou fosfatizado, compatível com parafusos de rosca métrica. Essencial em fixações mecânicas, estruturais e industriais.',
  'Porca travante':
    'Porca com elemento interno de nylon ou encaste metálico que impede o afrouxamento por vibração. Ideal para fixações em motores, equipamentos industriais, veículos e qualquer aplicação sujeita a choques e trepidações.',
  'Porca borboleta':
    'Porca com asas laterais para aperto e soltura manual, sem necessidade de ferramentas. Amplamente utilizada em fixações que exigem ajustes frequentes, como grades, painéis de acesso, armações e equipamentos de manutenção.',
  'Porca cega':
    'Porca com topo fechado que protege a extremidade da rosca do parafuso contra corrosão, impactos e contato acidental. Muito utilizada em acabamentos de montagens expostas e aplicações onde a segurança ou estética são prioritárias.',
  'Porca flangeada':
    'Porca com flange serrilhada ou lisa integrada que distribui a carga sobre uma área maior, eliminando a necessidade de arruela separada. Garante aperto mais seguro e resistência ao afrouxamento. Comum em linhas automotivas e industriais.',

  // Arruelas
  'Arruela lisa':
    'Arruela plana de aço que distribui a carga de aperto e protege a superfície da peça contra danos causados pela rotação do parafuso ou porca. Disponível em aço carbono zincado, galvanizado ou inox, em diversas bitolas métricas.',
  'Arruela de pressão':
    'Arruela cônica com fenda que exerce pressão elástica constante sobre a fixação, prevenindo o afrouxamento por vibração. Essencial em aplicações mecânicas e industriais sujeitas a trepidações e variações de temperatura.',
  'Arruela dentada':
    'Arruela com dentes internos ou externos que penetram levemente na superfície das peças, criando travas mecânicas que impedem a rotação e o afrouxamento. Indicada para fixações em painéis elétricos e equipamentos eletrônicos.',
  'Arruela de vedação':
    'Arruela com elemento de borracha ou EPDM vulcanizado que garante estanqueidade ao redor do parafuso. Ideal para fixações expostas a água, chuva ou líquidos em coberturas metálicas, telhas onduladas e painéis externos.',

  // Buchas
  'Bucha de nylon':
    'Bucha plástica de nylon para fixação em alvenaria, tijolos e blocos de concreto. Expande ao inserir o parafuso, garantindo ancoragem firme. Resistente à umidade e corrosão, indicada para cargas leves e médias em paredes convencionais.',
  'Bucha S':
    'Bucha de nylon com nervuras e garras que proporcionam fixação segura em substrato sólido ou vazado, como tijolos furados e blocos cerâmicos. Versátil, aceita parafusos chipboard e autoatarraxante. Ideal para quadros, prateleiras e acessórios.',
  'Bucha para drywall':
    'Bucha expansível desenvolvida para fixação em chapas de gesso acartonado (drywall). Abre atrás da chapa ao ser instalada, distribuindo a carga em área maior. Suporta cargas de até 25 kg dependendo da espessura da chapa.',
  'Bucha química':
    'Sistema de ancoragem química bicomponente de alta resistência para fixações em concreto, pedra e alvenaria. Resina epóxi ou vinilester que, ao curar, garante ancoragem superior à mecânica. Indicada para cargas pesadas e estruturas críticas.',
  'Bucha metálica':
    'Bucha de expansão em aço zincado ou inox para fixação em concreto maciço e pedra natural. Expansão pelo cone interno garante carga de arrancamento elevada. Ideal para fixações estruturais, equipamentos pesados e perfis de ancoragem.',
  'Bucha de impacto':
    'Bucha de nylon reforçado com nervuras longitudinais que garantem maior aderência em substrato de baixa resistência ou furos irregulares. Resiste à torção durante a inserção do parafuso. Indicada para paredes de tijolos e blocos porosos.',

  // Chumbadores
  'Chumbador parabolt':
    'Chumbador de expansão mecânica para fixação em concreto maciço de alta resistência. Rosca externa garante ancoragem profunda e carga de arrancamento elevada. Amplamente utilizado em estruturas metálicas, equipamentos industriais e ancoragens de segurança.',
  'Chumbador químico':
    'Sistema de ancoragem química com resina bicomponente para fixação de barras roscadas, chumbadores e armaduras em concreto, pedra e alvenaria. Alta resistência à vibração, cargas dinâmicas e arrancamento. Certificado para aplicações estruturais.',
  'Chumbador de expansão':
    'Chumbador metálico que se expande mecanicamente pelo aperto do parafuso ou pela penetração do cone. Indicado para fixações em concreto armado, lajes e elementos pré-moldados. Oferece instalação rápida e resistência comprovada a cargas axiais e cisalhantes.',
  'Chumbador JA':
    'Chumbador de expansão cônica para fixação em concreto, muito utilizado na construção civil para ancoragem de perfis, trilhos, máquinas e equipamentos. Instalação simples com martelo, sem necessidade de torque de aperto. Alta resistência ao arrancamento.',

  // Barras e Fixação
  'Barra roscada':
    'Barra de aço com rosca métrica em todo o comprimento, utilizada como tirante, conector ou elemento de ancoragem. Pode ser cortada no comprimento desejado. Disponível em aço carbono zincado, galvanizado ou inox, nos padrões UNC e métrico.',
  'Haste roscada':
    'Haste de aço com rosca nas extremidades para conexão e travamento entre peças, suportes e estruturas. Produto versátil utilizado em suspensões, travamentos e fixações de painéis, dutos e tubulações. Alta resistência mecânica e à corrosão.',
  'Vergalhão roscado':
    'Vergalhão de aço carbono com rosca métrica para uso em sistemas de ancoragem química e mecânica, estruturas de concreto armado e chumbamentos profundos. Compatível com buchas químicas e porcas de alta resistência.',
  'Pino de fixação':
    'Pino de aço endurecido para fixação rápida em concreto e aço por meio de pistola de impacto ou martelo. Elimina a necessidade de perfuração prévia na maioria das aplicações. Garante fixação rápida e segura em obras e instalações industriais.',

  // Rebites
  'Rebite de alumínio':
    'Rebite tubular de alumínio para fixação permanente por deformação mecânica. Leve, resistente à corrosão e fácil de instalar com alicate de rebitar. Ideal para fixação de chapas, letreiros, calhas, dutos e materiais onde a soldagem não é viável.',
  'Rebite estrutural':
    'Rebite de alta resistência para aplicações estruturais que exigem maior carga de cisalhamento e arrancamento. Fabricado em aço ou alumínio reforçado, utilizado em carrocerias, estruturas metálicas, equipamentos agrícolas e aplicações de engenharia.',
  'Rebite repuxo':
    'Rebite de puxar (pop rivet) para instalação com acesso por apenas um lado da peça. Mandril interno é puxado e rompido, expandindo o corpo do rebite. Amplamente utilizado em chapas, perfis, eletrodomésticos e montagens industriais em geral.',

  // Ferramentas
  'Furadeira':
    'Furadeira elétrica para perfuração em madeira, metal, alvenaria e plástico. Motor de alta potência com velocidade variável e reversão de giro. Mandril de aperto rápido facilita a troca de brocas. Disponível nos modelos com fio e sem fio (bateria).',
  'Parafusadeira':
    'Parafusadeira elétrica com embreagem ajustável para aperto e remoção de parafusos sem danificar a fixação. Leve e compacta, ideal para uso em obras, móveis e instalações. Versões com bateria de lítio garantem autonomia para uso intenso.',
  'Martelete':
    'Martelete elétrico com sistema de percussão para perfuração em concreto, pedra e alvenaria resistente. Função combinada (rotação + impacto ou só impacto) para uso como cinzel. Mandril SDS permite troca rápida de brocas e ponteiros.',
  'Chave de impacto':
    'Chave de impacto pneumática ou elétrica para aperto e remoção de parafusos e porcas com alto torque. Ideal para uso em borracharias, oficinas mecânicas e montagem de estruturas metálicas. Reduz esforço e aumenta a produtividade em fixações pesadas.',
  'Chave Allen':
    'Conjunto de chaves hexagonais (Allen) em aço cromo-vanádio para aperto de parafusos com encaixe interno. Disponível em jogos com bitolas métricas e polegadas. Versões com cabo ergonômico ou em L para maior torque e acessibilidade.',
  'Chave combinada':
    'Chave com boca fixa em uma extremidade e catraca ou estrela na outra, para aperto em parafusos e porcas sextavados. Fabricada em aço cromo-vanádio com acabamento cromado. Disponível em bitolas métricas e em polegadas.',
  'Chave inglesa':
    'Chave ajustável com abertura regulável para aperto de parafusos e porcas de diferentes bitolas. Corpo em aço forjado de alta resistência. Ideal para manutenção geral, hidráulica e trabalhos onde não se dispõe do conjunto completo de chaves.',
  'Alicate universal':
    'Alicate de uso geral para dobrar, cortar e prender peças e fios. Mandíbulas serrilhadas proporcionam maior aderência. Fabricado em aço carbono com cabo isolado. Essencial na caixa de ferramentas de qualquer profissional.',
  'Alicate de pressão':
    'Alicate de pressão (Vise-Grip) com trava mecânica para prender peças com força constante sem esforço contínuo do operador. Muito utilizado para segurar peças durante soldagem, ajustes e manutenção. Ajuste de pressão por parafuso traseiro.',
  'Trena':
    'Trena de fita de aço com trava automática e gancho reforçado. Fita com marcações métricas e em polegadas de fácil leitura. Carcaça resistente a impactos e borracha de proteção. Disponível nos tamanhos 3 m, 5 m, 8 m e 10 m.',
  'Estilete':
    'Estilete com lâmina retrátil de aço inox para corte de papelão, embalagens, drywall e materiais em geral. Corpo ergonômico com travas de segurança. Lâmina quebrável em segmentos para manter sempre o fio cortante afiado.',
  'Martelo':
    'Martelo de carpinteiro com cabeça de aço forjado e cabo de madeira, fibra ou borracha para absorção de impactos. Utilizado para pregar, extrair pregos e trabalhos gerais de construção. Disponível nos pesos 300 g, 500 g e 800 g.',

  // Itens metálicos
  'Correntes':
    'Correntes de aço galvanizado ou inox para amarração, içamento, bloqueio e aplicações gerais. Elos soldados de alta resistência ao cisalhamento e à tração. Disponível em diversas bitolas (espessura do fio) e comprimentos cortados sob medida.',
  'Ganchos':
    'Ganchos de aço forjado para içamento, suspensão e amarração de cargas. Trava de segurança impede a saída acidental do cabo ou corrente. Disponível com olhal, parafuso ou girador. Carga de trabalho indicada em cada unidade.',
  'Mosquetões':
    'Mosquetões de aço ou alumínio para conexão rápida entre pontos de ancoragem, cabos e correias. Trava giratória ou de rosca garante segurança contra abertura acidental. Utilizados em alpinismo, içamento, linhas de vida e equipamentos de segurança.',
  'Olhais':
    'Olhais de aço zincado ou inox com rosca para fixação em madeira ou metal, usados como ponto de ancoragem para cabos, cordas, correntes e mosquetões. Disponível em formato fechado ou aberto (argola) e em diversas bitolas métricas.',
  'Grampos':
    'Grampos de aço para fixação de cabos de aço, cordas e mangueiras. Corpo em U com placa de aperto distribui a força uniformemente e impede o escorregamento. Indicados para sistemas de suspensão, tirantes e fixações de cabos em geral.',
  'Abraçadeiras de nylon':
    'Abraçadeiras plásticas (enforca-gato) de nylon PA66 para organização e fixação de cabos, fios e mangueiras. Sistema de trava com dente que impede a abertura após o aperto. Resistentes a UV, temperatura e tração. Disponíveis em diversas cores e comprimentos.',
  'Abraçadeiras metálicas':
    'Abraçadeiras de aço inox ou galvanizado para fixação de tubos, mangueiras e cabos em superfícies expostas a vibração, calor e produtos químicos. Parafuso de aperto permite ajuste preciso do diâmetro. Alta resistência mecânica e à corrosão.',

  // EPIs
  'Luvas':
    'Luvas de segurança para proteção das mãos contra cortes, abrasão, produtos químicos e impactos. Disponíveis em couro, látex, nitrila, neoprene e malha de aço, cada material indicado para riscos específicos. Conformes às normas NR-6 e ABNT NBR.',
  'Óculos de proteção':
    'Óculos de segurança com lentes de policarbonato resistentes a impactos, respingos químicos e radiação UV. Armação flexível com hastes ajustáveis para uso confortável sobre os óculos de grau. Conformes à norma ANSI Z87.1 e CA aprovado.',
  'Capacete':
    'Capacete de segurança classe A ou B em polietileno de alta densidade (PEAD) para proteção contra impactos e penetração. Suspensão interna ajustável para encaixe perfeito. Disponível com aba frontal ou aba completa. CA aprovado pelo Ministério do Trabalho.',
  'Protetor auricular':
    'Protetor auricular tipo plug (espuma) ou concha (abafador) para redução do nível de pressão sonora em ambientes com ruído elevado. NRR indicado em cada produto. Confortável para uso prolongado e conforme às normas ABNT e CA aprovado.',
}

async function main() {
  console.log('Atualizando descrições dos produtos...\n')

  let updated = 0
  let notFound = 0

  for (const [name, description] of Object.entries(DESCRIPTIONS)) {
    const slug = slugify(name)
    const product = await prisma.product.findUnique({ where: { slug } })

    if (!product) {
      console.warn(`⚠ Produto não encontrado: ${name} (${slug})`)
      notFound++
      continue
    }

    await prisma.product.update({
      where: { slug },
      data: { description },
    })

    console.log(`✓ ${name}`)
    updated++
  }

  console.log(`\nConcluído: ${updated} atualizados · ${notFound} não encontrados`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
