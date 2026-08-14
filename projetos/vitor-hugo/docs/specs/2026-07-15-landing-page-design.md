# Landing Page — Victor Hugo Redação

## Contexto

Victor Hugo Redação (@vhredacao) é um curso/professor de redação em Manaus focado em
ENEM, MACRO, SIS e PSC. O objetivo imediato é um **protótipo de vendas**: uma landing
page e um mockup clicável do futuro sistema de gestão, para o professor levar a uma
reunião comercial e demonstrar o produto a um cliente/investidor antes de qualquer
desenvolvimento real de backend.

Este documento cobre **apenas a Landing Page**. O Sistema de Gestão (admin + área do
aluno) é tratado como projeto seguinte, com sua própria spec, mas o esqueleto de pastas
para ele já é reservado nesta fase para organização.

Por ser um protótipo pré-venda, não há backend, banco de dados ou autenticação real
nesta fase — tudo é estático, com dados de exemplo onde necessário.

## Objetivo da página

Equilibrar dois efeitos: (1) construir autoridade via prova social (resultados de
aprovação reais) e (2) converter visitantes em contato via WhatsApp/matrícula. Nenhum
dos dois é secundário — o CTA de contato deve estar sempre acessível, e a prova social
deve ser o elemento mais forte visualmente na página.

## Estilo visual

- **Direção**: vibrante/jovem, no espírito de um cursinho pré-vestibular — cards de
  aprovação em destaque tipo "cartaz", fotos reais grandes, energia parecida com os
  próprios posts do Instagram da marca.
- **Paleta**: fiel à marca — laranja (`#F5822B`-ish, tom da logo) e azul claro
  (`#8FB8E8`-ish, tom da logo), com neutro escuro (grafite/quase-preto) e branco de
  apoio para contraste e legibilidade. Extrair tons exatos do arquivo de logo quando
  disponível.
- **Tipografia**: peso forte, boa legibilidade, personalidade parecida com a fonte da
  logo (laranja em caixa alta/peso bold para títulos, azul mais leve/script-like como
  acento pontual — não para corpo de texto).
- **Zero "cara de IA"**: nada de gradiente roxo/azul genérico, ícones de
  foguete/robô/lâmpada, grid 3-colunas simétrico estilo SaaS genérico, ou hero com
  ilustração 3D flutuante. Fotos reais (placeholders por ora) em vez de ilustrações
  vetoriais.
- **Animações**: sutis e propositais, não os clichês de template (nada de fade-in
  genérico por seção ou parallax). Microinterações pontuais: hover em cards do
  carrossel, contador animado em números de destaque (ex: nota, quantidade de
  aprovados), transição suave no menu mobile.

## Estrutura de seções (ordem no scroll)

1. **Header fixo** — logo, navegação por âncora (Metodologia / Aprovados / Professor /
   Matrículas), botão "Área do Aluno" (link para o mockup do sistema de gestão, aba
   separada) e CTA de WhatsApp sempre visível.
2. **Hero** — headline de impacto (tom similar a "Redação com quem entende do
   assunto"), subtítulo mencionando ENEM/MACRO/SIS/PSC, CTA duplo: WhatsApp direto e
   "Ver aprovações" (scroll para o carrossel).
3. **Carrossel infinito de aprovados** — ver seção dedicada abaixo.
4. **Galeria "A sala de aula na prática"** — slider de fotos reais das turmas (sala de
   aula, alunos com cadernos, celebração de bolsas). Ver seção dedicada abaixo.
5. **Metodologia** — os 3 pilares já usados na bio do Instagram: "Redação com técnica,
   clareza e propósito"; "Argumentação, repertório e análise crítica";
   "Atendimento e informações". Layout em cards ou lista visual forte, não texto corrido.
6. **Sobre o professor** — foto (placeholder) + bio curta + diferencial de ensino/
   credenciais.
7. **Matrículas 2026 + localização** — data de início das aulas, endereço (Edifício
   Cristal Tower, Av. Umberto Calderaro, Adrianópolis, Manaus), contatos/telefone, CTA
   final de WhatsApp. Mapa é opcional (avaliar se agrega ou só polui na fase de
   protótipo).
8. **Footer** — redes sociais, contato, direitos autorais.

## Carrossel de aprovados

- **Comportamento**: scroll automático em loop infinito (sem paradas visíveis entre o
  fim e o recomeço da lista), pausa ao passar o mouse (hover) para permitir leitura.
- **Implementação**: card padronizado híbrido. A foto é o miolo do post de destaque
  do @vhredacao (nota/resultado + foto do aluno), recortado dos screenshots em
  `assets/media/aprovados/cards/` pelo script `assets/media/aprovados/recortar-cards.ps1`
  (salva em `assets/media/aprovados/fotos/`). Moldura, enquadramento (janela de aspecto
  fixo), chip de curso e faixa de nome são HTML/CSS — todos os cards ficam com o mesmo
  tamanho e o mesmo padrão visual, independentemente do recorte original.
- **Conteúdo**: lista `APROVADOS` em `landing-page/js/carousel.js` (14 alunos — ENEM
  2025 notas 900–960, UFRR/Medicina, USP FUVEST & UNICAMP/Medicina).
- **Para adicionar um novo aprovado**: salvar o screenshot do post em `cards/`, rodar
  `recortar-cards.ps1` e acrescentar o aluno (img, nome, curso, alt) na lista
  `APROVADOS`.

## Galeria "A sala de aula na prática"

- **Comportamento**: slider clássico — uma foto grande por vez, setas laterais,
  bolinhas de navegação, avanço automático a cada 5s (pausa no hover, reinicia após
  interação) e swipe no celular.
- **Implementação**: todas as fotos em `assets/media/alunos/` são padronizadas na
  proporção 708:492 (~1,44:1) — recortadas dos originais preservando as pessoas
  (janela/teto/papel cedem espaço, rostos não) — e preenchem o viewport do slider por
  inteiro (`object-fit: cover` sem corte em runtime, pois viewport e fotos têm a mesma
  proporção). Os originais sem recorte continuam em `dados/` e
  `assets/media/professor/`.
- **Conteúdo**: lista `FOTOS_GALERIA` em `landing-page/js/galeria.js`, apontando para
  `assets/media/alunos/`.
- **Para adicionar uma foto**: recortá-la na mesma proporção 708:492, salvar em
  `assets/media/alunos/` e acrescentar `{ src, alt }` na lista `FOTOS_GALERIA`.

## Mídia

Todas as imagens citadas nesta fase (logo, fotos do professor, fotos de fundo dos
cards de aprovados) ainda não existem como arquivos no disco — foram compartilhadas
apenas dentro da conversa. Nesta fase, usar **placeholders rotulados** (ex: bloco cinza
com texto "FOTO_PROFESSOR_SALA_AULA") no lugar de cada imagem, organizados em
`assets/media/professor/`, `assets/media/aprovados/` e `assets/media/marca/`. O
professor substitui pelos arquivos reais depois.

## Stack

HTML/CSS/JS puro, sem build step — abre direto no navegador ou hospeda como site
estático (Netlify/Vercel) em minutos. Facilita ajustes de última hora antes da reunião
e não impõe dependências para um protótipo sem backend.

## Estrutura de pastas do projeto

```
Victor Hugo/
├── CLAUDE.md                          # contexto do projeto para sessões futuras
├── docs/
│   └── specs/
│       └── 2026-07-15-landing-page-design.md
├── assets/
│   └── media/
│       ├── professor/                 # placeholders: perfil, sala de aula, bolo, retrato
│       ├── aprovados/                 # placeholders por aluno (6 cards)
│       └── marca/                     # logo, favicon
├── landing-page/
│   ├── index.html
│   ├── css/
│   └── js/
└── sistema-gestao/                    # esqueleto reservado; spec própria depois
    ├── admin/
    │   ├── dashboard.html
    │   ├── alunos.html
    │   ├── financeiro.html
    │   └── correcao.html
    └── aluno/
        ├── dashboard.html
        ├── redacao.html
        ├── relatorios.html
        ├── materiais.html
        ├── financeiro.html
        └── ranking.html
```

## Fora de escopo (nesta spec)

- Qualquer funcionalidade real do Sistema de Gestão (admin ou área do aluno) — vira
  spec própria. Nesta fase só o esqueleto de pastas é criado, vazio.
- Backend, banco de dados, autenticação, envio real de formulários.
- Scraping automatizado do Instagram (decidido explicitamente: extração manual dos
  dados já compartilhados na conversa, sem API/Apify).
- Mapa incorporado (Google Maps embed) — avaliar como melhoria futura, não bloqueia o
  protótipo.

## Verificação

Como é um protótipo estático sem backend, a verificação é visual/manual:
1. Abrir `landing-page/index.html` no navegador e navegar por todas as seções via
   scroll e pelos links do header.
2. Confirmar que o carrossel de aprovados roda em loop contínuo e pausa no hover.
3. Testar responsividade em viewport mobile (menu deve colapsar/adaptar).
4. Confirmar que os CTAs de WhatsApp apontam para o link correto
   (`whatsa.me/5592985189494` ou similar, confirmar com o professor).
5. Conferir que nenhum placeholder de imagem quebra o layout (dimensões reservadas).
