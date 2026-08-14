# Victor Hugo Redação — Protótipo de Vendas

## O que é este projeto

Protótipo estático para uma reunião comercial: uma Landing Page institucional e (fase
seguinte) um mockup clicável de um Sistema de Gestão para o curso de redação
**Victor Hugo Redação** (@vhredacao no Instagram), professor focado em ENEM, MACRO, SIS
e PSC, sediado em Manaus (Edifício Cristal Tower, Adrianópolis).

**Este é um protótipo, não o produto final.** Não há backend, banco de dados ou
autenticação real nesta fase — tudo é HTML/CSS/JS estático com dados de exemplo, para
demonstrar o conceito visual e funcional numa reunião de vendas.

## Estrutura de pastas

```text
assets/media/          # mídias organizadas por domínio (professor, aprovados, marca)
docs/specs/            # documentos de design (spec por feature/fase)
landing-page/          # a landing page institucional (pronta)
sistema-gestao/        # esqueleto reservado para o mockup do sistema (spec própria, ainda não implementado)
```

## Mídia

As imagens reais (fotos do professor, logo, fotos dos alunos aprovados) ainda não
existem como arquivos — foram compartilhadas apenas em conversa. Todos os arquivos em
`assets/media/**/*.svg` são **placeholders rotulados** (retângulo cinza + nome do
arquivo esperado). Substitua pelo arquivo real mantendo o mesmo nome, ou atualize as
referências em `landing-page/index.html` se o nome mudar.

## Stack

HTML/CSS/JS puro, sem build step. Abre direto no navegador (`landing-page/index.html`)
ou hospeda como site estático (Netlify/Vercel). Não introduzir framework/bundler nesta
fase — o objetivo é velocidade de iteração antes da reunião.

## Specs

Cada bloco de trabalho (Landing Page, Sistema de Gestão) tem sua própria spec em
`docs/specs/YYYY-MM-DD-<topico>-design.md`. Ver
`docs/specs/2026-07-15-landing-page-design.md` para o design vigente da Landing Page.

## Logo animada (splash)

A animação de abertura (`landing-page/js/splash.js` + `css/splash.css`) desenha a
logo em SVG (lápis escrevendo o "h") e troca pela logo oficial num zoom-out/in.
A geometria é editável em `assets/media/marca/logo-animada.svg` e sincronizada com
`node landing-page/dev/sync-logo.mjs` — nunca editar o bloco GEO do splash.js à mão.
Ver `landing-page/dev/LEIA-ME.md`.

## Refinos: motion + camada literária (jul/2026)

A landing tem duas camadas adicionais, ambas com gate de `prefers-reduced-motion`:

- **Motion** (`css/motion.css` + `js/motion.js`): coreografia do hero pós-splash
  (splash.js dispara `vh:splash-done`; consumidores usam `window.vhQuandoHeroPronto`),
  sublinhados de lápis que se desenham nos títulos, ícones da metodologia traçados,
  frase do ambiente escrita palavra a palavra, barra de progresso de leitura no header
  e a nota 960 circulada. Linguagem: sempre o gesto da escrita — sem fade-in por seção.
- **Literatura** (`css/literatura.css` + `js/literatura.js`): easter eggs descobríveis
  com citações do cânone ENEM + autores da Amazônia, **verificadas contra fontes
  primárias** (não editar de ouvido — há variantes corrompidas na internet): título da
  aba ao sair, console, toast "Repertório desbloqueado" no footer, notas ✎ nas seções,
  hover na assinatura do ambiente (Thiago de Mello), carimbo de cópia, `::selection`,
  clique triplo na logo (estante secreta).

Contexto estratégico em `PRODUCT.md`; sistema visual capturado em `DESIGN.md`.
Verificação dirigida por Playwright: ver skill `verify` (`.claude/skills/verify`).

## Sistema de Gestão (mockup implementado)

Mockup clicável estático (HTML/CSS/JS puro, dados fake, sem backend) implementado em
`sistema-gestao/`, conforme `docs/specs/2026-07-17-sistema-gestao-design.md`:

- `login.html` — login fake com abas "Sou aluno" (→ dashboard do aluno) e "Sou
  professor" (select de perfil: Victor Hugo, dono, ou Rafael Nunes, convidado;
  grava `localStorage["vh_sessao_prof"]` → dashboard do admin).
- `aluno/` — 6 telas: dashboard, redacao, relatorios, materiais, financeiro, ranking.
- `admin/` — dashboard, correcao e turmas ("Alunos" e "Financeiro" ficam com
  selo "em breve" na sidebar). Em `turmas.html`, só o perfil dono edita
  (`obterSessaoProfessor().dono`); convidado vê read-only com banner.
- `css/sistema.css` copia os tokens de cor/fonte da landing (não importa o CSS dela);
  `js/dados.js` é a fonte única de dados fake; `js/sistema.js` injeta sidebar+header
  (sem `fetch` — quebraria em `file://`); `js/folha.js` renderiza a folha corrigida
  com o overlay de marcações.

A folha usada é real: `assets/media/sistema/redacao-manuscrita.png` (657×833). As
marcações do professor vivem em `DADOS.folha` (viewBox 657×833) e são compartilhadas
entre a tela do aluno e a de correção do admin. A persona logada é "Carina Beatriz de
Souza Moura" (nome do cabeçalho da folha). O botão "Área do Aluno" da landing aponta
para `sistema-gestao/login.html`.

## Formulário de matrícula (turmas)

Os CTAs "Garantir minha vaga"/"Quero minha vaga" da landing abrem um modal
(`landing-page/js/matricula.js` + `css/matricula.css`) com as turmas, e o envio abre
o WhatsApp com mensagem pré-preenchida (nome + turma). A fonte única das turmas é
`sistema-gestao/js/turmas.js` (seed `TURMAS_SEED` + `obterTurmas()`/`salvarTurmas()`
via `localStorage["vh_turmas"]`), carregada pela landing por caminho relativo. O
professor dono edita as turmas em `sistema-gestao/admin/turmas.html` e a landing
reflete ao reabrir o modal (mesma origem/storage; em `file://` alguns navegadores
particionam — servir a pasta num host estático para a demo completa).
