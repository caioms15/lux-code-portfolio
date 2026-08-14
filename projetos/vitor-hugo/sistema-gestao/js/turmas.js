/* ===== Victor Hugo Redação — Turmas (fonte única) =====
 * Carregado tanto pela landing (../sistema-gestao/js/turmas.js) quanto pelo
 * admin. Não depende de DADOS nem de sistema.js.
 *
 * Persistência do mockup: localStorage "vh_turmas" (edições do professor no
 * painel). Sem valor salvo — ou com JSON inválido — vale o seed abaixo.
 * Atenção em file://: alguns navegadores particionam o localStorage por
 * arquivo, e aí a landing não enxerga a edição feita no admin. Servindo a
 * pasta num host estático (Netlify/Vercel/`npx serve`) o compartilhamento
 * funciona normalmente; o seed garante que nada quebra em nenhum caso.
 */

const TURMAS_CHAVE = "vh_turmas";

const TURMAS_SEED = [
  { id: "enem-manha", nome: "ENEM Intensivo — Manhã", dias: "Seg, Qua e Sex", horario: "08h — 11h30", foco: "ENEM", vagas: "abertas" },
  { id: "enem-tarde", nome: "ENEM Intensivo — Tarde", dias: "Seg, Qua e Sex", horario: "14h — 17h30", foco: "ENEM", vagas: "poucas" },
  { id: "macro-sis-noite", nome: "MACRO/SIS — Noite", dias: "Ter e Qui", horario: "18h30 — 21h30", foco: "MACRO e SIS", vagas: "abertas" },
  { id: "psc-sabado", nome: "PSC UFAM — Sábado", dias: "Sábado", horario: "08h — 12h", foco: "PSC", vagas: "esgotada" },
];

const TURMAS_STATUS = {
  abertas: { rotulo: "Vagas abertas", chip: "ok" },
  poucas: { rotulo: "Últimas vagas", chip: "alerta" },
  esgotada: { rotulo: "Turma cheia", chip: "neutro" },
};

function obterTurmas() {
  try {
    const salvas = JSON.parse(localStorage.getItem(TURMAS_CHAVE));
    if (Array.isArray(salvas) && salvas.length && salvas.every((t) => t && t.id && t.nome)) {
      return salvas;
    }
  } catch (_) { /* JSON inválido: cai no seed */ }
  return TURMAS_SEED.map((t) => ({ ...t }));
}

function salvarTurmas(lista) {
  try {
    localStorage.setItem(TURMAS_CHAVE, JSON.stringify(lista));
  } catch (_) { /* storage indisponível: mockup segue em memória */ }
}

function restaurarTurmasPadrao() {
  try {
    localStorage.removeItem(TURMAS_CHAVE);
  } catch (_) { /* idem */ }
}
