# Sistema de Gestão (mockup clicável) — Victor Hugo Redação

## Contexto

A landing page está pronta, mas o botão "Área do Aluno" do header aponta para
`sistema-gestao/aluno/dashboard.html`, que não existe. Este documento especifica o
**mockup clicável do Sistema de Gestão** — área do aluno e área admin — para a mesma
reunião de vendas da landing: um protótipo estático (HTML/CSS/JS puro, sem backend,
sem autenticação real, dados fake) que demonstra o conceito navegando como um site
real.

Decisões registradas aqui foram aprovadas em brainstorming em 17/07/2026.

## Objetivo

Mostrar na reunião o valor do sistema para os dois lados:

1. **Aluno** — acompanha suas redações, notas, evolução, materiais e mensalidades num
   só lugar, pelo celular ou computador.
2. **Professor** — recebe as redações fotografadas pelos alunos e **corrige na própria
   folha** (riscando, sublinhando, comentando), com espelho de notas por competência.

O fluxo de correção na folha é o argumento central de venda e recebe o maior
investimento visual.

## Escopo

- **Área do aluno completa**: login fake + 6 telas (dashboard, redações, relatórios,
  materiais, financeiro, ranking).
- **Admin resumido**: dashboard do professor + tela de correção. Os itens "Alunos" e
  "Financeiro" aparecem na sidebar com selo "em breve" (não clicáveis) — sinalizam a
  fase seguinte sem exigir mais telas antes da reunião.

## Fluxo central: envio e correção da redação

1. O aluno fotografa a redação manuscrita e envia pela tela "Minhas Redações". No
   mockup o envio é **simulado**: seletor de arquivo real (nada é lido), barra de
   progresso (~2s), toast "Enviada! Aguardando correção" e nova linha na tabela
   (somente em memória; F5 reseta).
2. O professor abre a redação na tela de correção do admin: a folha aparece em
   destaque com **marcações pré-desenhadas** (riscos, sublinhado ondulado,
   marca-texto, balões numerados de comentário). A barra de ferramentas
   (caneta / marca-texto / sublinhar / comentário) tem estados ativos e cursor
   diferenciado sobre a folha — parece funcional, mas não desenha de verdade.
3. O professor dá as notas por competência (5 sliders 0–200, soma ao vivo) e clica
   "Concluir correção" (toast). Na versão real, essa função existirá de fato; no
   protótipo ela apenas aparenta existir.
4. O aluno vê a folha corrigida (mesmas marcações, mesma fonte de dados) ao lado do
   espelho de notas C1–C5 com barras e nota final em destaque.

## Folha de redação

- Imagem real já disponível: `dados/Exemplo de redação.png` (folha oficial ENEM 2022,
  manuscrita). Copiada para `assets/media/sistema/redacao-manuscrita.png` (mídia
  curada fica em `assets/media/`, organizada por domínio; `dados/` é o despejo bruto).
- As marcações são um **overlay SVG** absoluto sobre a `<img>`, com `viewBox` na
  proporção real da foto; balões de comentário são HTML posicionado, com os textos
  completos listados no painel ao lado (números na folha ↔ lista de comentários).
- Todas as marcações moram num único array `DADOS.marcacoes` — aluno e admin renderizam
  exatamente as mesmas. Trocar a foto no futuro = ajustar viewBox/aspect-ratio e as
  coordenadas desse array.

## Persona e dados fake

- Aluna logada: **Carina Beatriz de Souza Moura** (nome real do cabeçalho da folha,
  para a demo ficar coerente), iniciais "CB", Turma 2026 — ENEM/PSC.
- Última redação corrigida: **880** (C1 200, C2 160, C3 180, C4 180, C5 160 — soma
  exata). Histórico em progressão: 720 → 760 → 800 → 840 → 880.
- Financeiro: mensalidade **R$ 249**, 12 parcelas, fev–jun pagas, julho em aberto
  (gera o CTA do Pix fake). Aulas presenciais ter/qui 18h30, Cristal Tower.
- Ranking da turma: colegas **fictícios** + Carina em 3º lugar (destaque com margem de
  crescimento). Os 14 aprovados reais da landing **não** entram como colegas de turma;
  podem aparecer apenas em métricas/histórico do admin.
- Métricas do admin: 47 alunos ativos, 5 redações na fila (= tamanho da fila de
  correção), média da turma 812, inadimplência 8%.
- Todo dado que aparece em mais de uma tela sai de `sistema-gestao/js/dados.js` —
  nenhum número repetido hardcoded em duas páginas.

## Estilo visual

- Mesma identidade da landing: paleta azul marinho + laranja, tokens copiados de
  `landing-page/css/styles.css` (`:root`), Poppins/Inter com fallback de sistema
  (sem CDN — a reunião pode ser offline), botões pill, chips uppercase, cards com
  sombra suave.
- Layout de aplicativo: sidebar fixa azul-profundo (240px) com logo e navegação
  vertical (item ativo com barra laranja), conteúdo em off-white, header interno com
  título da página, avatar de iniciais e botão "Sair".
- **Zero cara de IA** (herdado da spec da landing): sem gradiente roxo genérico, sem
  ícones de foguete/robô, ícones SVG inline stroke-based como os já usados.
- Balões de comentário em Inter itálico laranja (sem fonte manuscrita — não depende de
  fonte instalada nem de rede).
- Desktop-first (demo em notebook, 1366×900); breakpoint simples abaixo de ~900px para
  nada quebrar no celular.

## Telas

### Área do aluno

| Tela | Conteúdo |
|---|---|
| `login.html` | Card centrado em fundo azul-profundo, logo, campos pré-preenchidos, "Entrar" → dashboard. Sem seleção de perfil. |
| `aluno/dashboard.html` | Saudação, tema da semana, chip "Corrigida — 880", sparkline de evolução (SVG inline), avisos do professor, próximas aulas. |
| `aluno/redacao.html` | Tabela de envios (tema, data, status em chips, nota), fluxo de envio simulado, folha corrigida + espelho C1–C5. |
| `aluno/relatorios.html` | Barras por competência, comparativo aluna × média da turma, frequência. |
| `aluno/materiais.html` | PDFs/vídeos fake com download simulado (toast). |
| `aluno/financeiro.html` | Parcelas com chips Paga/Em aberto, modal Pix fake (QR SVG inline + copia-e-cola com toast). |
| `aluno/ranking.html` | Pódio top 3 + lista do mês, Carina destacada. |

### Admin

| Tela | Conteúdo |
|---|---|
| `admin/dashboard.html` | Cards de métricas, fila de correção com link para a correção. Sidebar com "Alunos" e "Financeiro" em "em breve". |
| `admin/correcao.html` | Folha com as marcações, toolbar de ferramentas com estado ativo, sliders de nota por competência com soma ao vivo, "Concluir correção" + toast. |

O admin é acessado direto pela URL (`sistema-gestao/admin/dashboard.html`) — não há
link no login, decisão explícita para manter o login simples.

## Arquitetura

- **Multi-página** (uma URL por tela — a landing já linka para páginas específicas),
  com CSS próprio `sistema-gestao/css/sistema.css` (não importa o CSS da landing, só
  copia os tokens) e dois JS compartilhados:
  - `js/dados.js` — objeto global `DADOS` com todos os dados fake.
  - `js/sistema.js` — injeta sidebar+header via `innerHTML` (sem `fetch` de partials,
    que falha em `file://`), marca o item ativo por `body[data-pagina]`, e expõe
    utilitários (`mostrarToast`, `abrirModal`/`fecharModal`).
- Sem `fetch`, sem `type="module"`, sem `localStorage` — mockup stateless; cada página
  se renderiza a partir de `dados.js`, no mesmo padrão do `carousel.js` da landing.
- Caminhos relativos: páginas em `aluno/`/`admin/` usam `../css/`, `../js/`,
  `../../assets/`; `login.html` usa `css/`, `js/`, `../assets/`.
- **Edição na landing**: o href do botão "Área do Aluno"
  (`landing-page/index.html`) passa a apontar para `../sistema-gestao/login.html`.

## Fora de escopo (nesta spec)

- Backend, banco, autenticação real, upload real, desenho real de marcações.
- Telas de admin "Alunos" e "Financeiro" (apenas selo "em breve" na sidebar).
- Estado persistente entre páginas ou entre reloads.
- Responsividade refinada de app mobile (só o breakpoint de segurança).

## Verificação

1. Abrir a landing, clicar "Área do Aluno" (após o splash) e chegar ao login; "Entrar"
   leva ao dashboard.
2. Navegar por todos os itens da sidebar nas duas áreas sem 404 (imagens, CSS e JS
   carregando em `file://`).
3. Executar o fluxo de envio simulado e ver progresso, toast e a nova linha na tabela.
4. Conferir consistência dos números entre telas (880 no dashboard = redação =
   ranking; fila do admin = métrica).
5. Varredura final com a skill `verify` (Playwright, 1366×900 e 375×720): screenshots
   de todas as telas, listener de respostas ≥ 400 e `pageerror`.
