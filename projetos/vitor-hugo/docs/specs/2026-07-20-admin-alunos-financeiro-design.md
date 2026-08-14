# Admin: telas Alunos e Financeiro — design

Data: 2026-07-20
Status: aprovado

## Contexto

`sistema-gestao/admin/` hoje só tem `dashboard.html` e `correcao.html`. A sidebar
(`js/sistema.js`, `NAV_ADMIN`) lista "Alunos" e "Financeiro" com selo `emBreve: true`
e `href: "#"`. Esta spec cobre a implementação real das duas telas, removendo o selo.

Também inclui um link "Sou professor" em `login.html` apontando para
`admin/dashboard.html` (não há login próprio para o admin no mockup — acesso direto).

## Tela: Alunos (`admin/alunos.html`)

- Tabela: nome, turma, nota média, frequência (%), status financeiro (chip).
- Clique na linha abre modal (reusa `.modal-overlay` / `abrirModal()` / `fecharModal()`
  já existentes em `sistema.css`/`sistema.js`) com:
  - dados do aluno (nome, turma, desde quando)
  - mini-histórico de notas (lista curta de envios fake, estilo `DADOS.envios`)
  - status das parcelas (paga/aberta/futura, mesmo vocabulário de `DADOS.parcelas`)

## Tela: Financeiro (`admin/financeiro.html`)

- Cards resumo no topo: Recebido no mês, Em aberto, Inadimplência.
- Tabela abaixo: mesma lista de alunos, com valor da mensalidade, status
  (chip `chip-ok`/`chip-aberto`/`chip-neutro`, mesmo padrão de `aluno/financeiro.html`)
  e ação "Cobrar" (botão que dispara `mostrarToast("Cobrança enviada", "ok")` — sem
  efeito real, é mockup).

## Dados fake

Novo array `DADOS.alunosAdmin` em `js/dados.js`, com os mesmos 10 nomes de
`DADOS.ranking` (mantém consistência entre Ranking do aluno e Alunos do admin).
Cada entrada ganha: turma, frequência (%), nota média (a mesma de `ranking[i].nota`),
status financeiro, mini-histórico de 3-4 envios fake, e parcela do mês corrente
(mesmo shape de `DADOS.parcelas`, um item).

A aluna logada (Carina, posição 3) usa os dados reais já existentes em `DADOS.envios`
e `DADOS.parcelas` em vez de gerar novos, para não divergir do que ela já vê na área
do aluno.

## Navegação

- `js/sistema.js`: `NAV_ADMIN` remove `emBreve: true` e `href: "#"` dos itens
  `alunos` e `financeiro`, aponta para `alunos.html` e `financeiro.html`.
- `login.html`: novo link "Sou professor" abaixo de "Recuperar acesso", apontando
  para `admin/dashboard.html`. (Já implementado nesta sessão.)

## Fora de escopo

- Sem página de detalhe dedicada por aluno (é modal).
- Sem edição real de dados, envio de cobrança real, ou paginação — é mockup estático.
- Sem novo login para admin.
