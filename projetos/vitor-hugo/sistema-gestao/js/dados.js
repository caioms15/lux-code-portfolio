/* ===== Victor Hugo Redação — Sistema de Gestão (mockup) =====
 * Fonte ÚNICA de dados fake. Tudo que aparece em mais de uma tela sai daqui,
 * para os números nunca divergirem entre páginas (nota 880, fila do admin,
 * espelho de competências, etc). Não há backend — cada página lê DADOS e se
 * renderiza sozinha (padrão do carousel.js da landing).
 *
 * A folha corrigida é assets/media/sistema/redacao-manuscrita.png (657x833).
 * As marcações do professor (marcacoes[]) usam coordenadas no viewBox 657x833
 * — mesma imagem/mesmas marcas no aluno e no admin. Trocar a foto = ajustar
 * FOLHA_VIEWBOX e recolocar os pontos abaixo.
 */

const FOLHA_IMG = "redacao-manuscrita.png";
const FOLHA_W = 657;
const FOLHA_H = 833;

const DADOS = {
  alunoLogado: {
    nome: "Carina Beatriz de Souza Moura",
    primeiroNome: "Carina",
    iniciais: "CB",
    turma: "Turma 2026 — ENEM/PSC",
    desde: "fevereiro de 2026",
  },

  professor: {
    nome: "Victor Hugo",
    iniciais: "VH",
    papel: "Professor de Redação",
  },

  temaDaSemana: {
    titulo: "Desafios para a valorização de comunidades e povos tradicionais no Brasil",
    prazo: "20/07/2026",
    obs: "Envie sua redação até domingo para entrar na próxima rodada de correção.",
  },

  /* Envios da aluna. O mais recente já corrigido: 880 (soma exata das competências). */
  envios: [
    {
      id: 5,
      tema: "Desafios para a valorização de comunidades e povos tradicionais no Brasil",
      dataEnvio: "12/07/2026",
      status: "corrigida",
      notaFinal: 880,
      competencias: { c1: 200, c2: 160, c3: 180, c4: 180, c5: 160 },
      temFolha: true,
    },
    { id: 4, tema: "Caminhos para combater a intolerância religiosa no Brasil", dataEnvio: "05/07/2026", status: "corrigida", notaFinal: 840, competencias: { c1: 200, c2: 160, c3: 160, c4: 160, c5: 160 } },
    { id: 3, tema: "O estigma associado às doenças mentais na sociedade brasileira", dataEnvio: "28/06/2026", status: "corrigida", notaFinal: 800, competencias: { c1: 160, c2: 160, c3: 160, c4: 160, c5: 160 } },
    { id: 2, tema: "Democratização do acesso ao cinema no Brasil", dataEnvio: "21/06/2026", status: "corrigida", notaFinal: 760, competencias: { c1: 160, c2: 160, c3: 120, c4: 160, c5: 160 } },
    { id: 1, tema: "Manipulação do comportamento do usuário pelo controle de dados na internet", dataEnvio: "14/06/2026", status: "corrigida", notaFinal: 720, competencias: { c1: 160, c2: 120, c3: 160, c4: 120, c5: 160 } },
  ],

  /* Rótulos e descrições das 5 competências do ENEM + média da turma (para comparativo). */
  competencias: [
    { id: "c1", rotulo: "C1", nome: "Domínio da norma culta", mediaTurma: 168 },
    { id: "c2", rotulo: "C2", nome: "Compreensão do tema", mediaTurma: 150 },
    { id: "c3", rotulo: "C3", nome: "Seleção e organização de argumentos", mediaTurma: 154 },
    { id: "c4", rotulo: "C4", nome: "Coesão e mecanismos linguísticos", mediaTurma: 158 },
    { id: "c5", rotulo: "C5", nome: "Proposta de intervenção", mediaTurma: 148 },
  ],

  frequencia: { presencas: 22, total: 24, percentual: 92 },

  /* Marcações do professor sobre a folha (viewBox 657x833). Compartilhadas aluno/admin. */
  folha: {
    img: FOLHA_IMG,
    viewBox: `0 0 ${FOLHA_W} ${FOLHA_H}`,
    largura: FOLHA_W,
    altura: FOLHA_H,
    marcacoes: [
      { tipo: "sublinhado", x: 70, y: 250, largura: 240 },
      { tipo: "marcatexto", x: 60, y: 322, largura: 300, altura: 20 },
      { tipo: "risco", x1: 300, y1: 400, x2: 400, y2: 396 },
      { tipo: "sublinhado", x: 80, y: 512, largura: 360 },
      { tipo: "risco", x1: 120, y1: 590, x2: 210, y2: 585 },
    ],
    /* Balões numerados: posição em % da folha + comentário no painel lateral. */
    comentarios: [
      { n: 1, xPct: 52, yPct: 30, comp: "C1", texto: "Atenção à <em>concordância verbal</em> aqui — o sujeito é plural." },
      { n: 2, xPct: 60, yPct: 39, comp: "C4", texto: "Conectivo <em>“portanto”</em> repetido no parágrafo. Varie os operadores." },
      { n: 3, xPct: 72, yPct: 48, comp: "C3", texto: "Bom repertório! Cite a fonte para <em>fortalecer o argumento</em>." },
      { n: 4, xPct: 40, yPct: 71, comp: "C5", texto: "Detalhe melhor o <em>agente</em> e o <em>meio</em> da proposta de intervenção." },
    ],
    resumoProfessor: "Redação sólida, com repertório pertinente e boa progressão. Ajuste a concordância na introdução e varie os conectivos para chegar aos 960. Parabéns pela evolução!",
  },

  /* Financeiro: mensalidade R$ 249, fev–jun pagas, julho em aberto. */
  mensalidade: 249.0,
  parcelas: [
    { mes: "Fevereiro/2026", valor: 249.0, vencimento: "10/02/2026", status: "paga", pagoEm: "08/02/2026" },
    { mes: "Março/2026", valor: 249.0, vencimento: "10/03/2026", status: "paga", pagoEm: "09/03/2026" },
    { mes: "Abril/2026", valor: 249.0, vencimento: "10/04/2026", status: "paga", pagoEm: "10/04/2026" },
    { mes: "Maio/2026", valor: 249.0, vencimento: "10/05/2026", status: "paga", pagoEm: "07/05/2026" },
    { mes: "Junho/2026", valor: 249.0, vencimento: "10/06/2026", status: "paga", pagoEm: "10/06/2026" },
    { mes: "Julho/2026", valor: 249.0, vencimento: "10/07/2026", status: "aberta" },
    { mes: "Agosto/2026", valor: 249.0, vencimento: "10/08/2026", status: "futura" },
  ],
  pixChave: "vhredacao@pix.com.br",

  /* Ranking da turma: colegas fictícios + a aluna logada em 3º. */
  ranking: [
    { posicao: 1, nome: "Rafael Nogueira", nota: 940, ehAluno: false },
    { posicao: 2, nome: "Beatriz Lemos", nota: 900, ehAluno: false },
    { posicao: 3, nome: "Carina Beatriz de Souza Moura", nota: 880, ehAluno: true },
    { posicao: 4, nome: "Thiago Albuquerque", nota: 860, ehAluno: false },
    { posicao: 5, nome: "Marina Vasconcelos", nota: 860, ehAluno: false },
    { posicao: 6, nome: "Pedro Henrique Sales", nota: 840, ehAluno: false },
    { posicao: 7, nome: "Larissa Fontes", nota: 820, ehAluno: false },
    { posicao: 8, nome: "Gustavo Meireles", nota: 800, ehAluno: false },
    { posicao: 9, nome: "Ana Júlia Tavares", nota: 780, ehAluno: false },
    { posicao: 10, nome: "Bruno Carvalho", nota: 760, ehAluno: false },
  ],

  materiais: [
    { tipo: "pdf", titulo: "Guia da Competência 5 — Proposta de Intervenção", meta: "PDF · 1,8 MB" },
    { tipo: "pdf", titulo: "Banco de repertório sociocultural (atualizado)", meta: "PDF · 3,2 MB" },
    { tipo: "video", titulo: "Aula gravada — Coesão e conectivos", meta: "Vídeo · 42 min" },
    { tipo: "pdf", titulo: "Modelo de redação nota 1000 comentado", meta: "PDF · 900 KB" },
    { tipo: "video", titulo: "Como estruturar a introdução em 5 minutos", meta: "Vídeo · 18 min" },
    { tipo: "pdf", titulo: "Lista de conectivos por função argumentativa", meta: "PDF · 420 KB" },
  ],

  avisos: [
    { data: "15/07/2026", texto: "Nova redação disponível: tema sobre povos e comunidades tradicionais. Prazo até domingo (20/07)." },
    { data: "10/07/2026", texto: "Correções da semana liberadas. Confira o espelho da sua última redação." },
    { data: "05/07/2026", texto: "Aulão de repertório sociocultural na terça, 18h30, presencial na Cristal Tower." },
  ],

  proximasAulas: [
    { dia: "Terça-feira", data: "22/07", hora: "18h30", assunto: "Repertório sociocultural aplicado" },
    { dia: "Quinta-feira", data: "24/07", hora: "18h30", assunto: "Oficina de proposta de intervenção" },
  ],

  /* ===== Admin ===== */
  filaCorrecao: [
    { aluno: "Carina Beatriz de Souza Moura", turma: "ENEM/PSC", tema: "Povos e comunidades tradicionais", recebidaEm: "12/07/2026", prioridade: "alta", temFolha: true },
    { aluno: "Thiago Albuquerque", turma: "ENEM", tema: "Povos e comunidades tradicionais", recebidaEm: "12/07/2026", prioridade: "normal" },
    { aluno: "Larissa Fontes", turma: "MACRO", tema: "Povos e comunidades tradicionais", recebidaEm: "11/07/2026", prioridade: "normal" },
    { aluno: "Gustavo Meireles", turma: "SIS", tema: "Intolerância religiosa", recebidaEm: "11/07/2026", prioridade: "normal" },
    { aluno: "Ana Júlia Tavares", turma: "ENEM/PSC", tema: "Intolerância religiosa", recebidaEm: "10/07/2026", prioridade: "baixa" },
  ],

  metricasAdmin: [
    { rotulo: "Alunos ativos", valor: "47" },
    { rotulo: "Redações na fila", valor: "5" }, // = filaCorrecao.length
    { rotulo: "Média da turma", valor: "812" },
    { rotulo: "Inadimplência", valor: "8%", alerta: true },
  ],
};

/* mantém a métrica "Redações na fila" sempre igual ao tamanho real da fila */
DADOS.metricasAdmin[1].valor = String(DADOS.filaCorrecao.length);
