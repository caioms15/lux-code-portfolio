/* ===== Victor Hugo Redação — Sistema de Gestão (mockup) =====
 * Shell compartilhado (sidebar + header) injetado via innerHTML — sem fetch de
 * partials (que falha em file://). Cada página declara no <body>:
 *   class="app"  data-area="aluno|admin"  data-pagina="<id do item ativo>"
 *   data-titulo="Título" data-subtitulo="..."
 * e contém <aside id="appSidebar"></aside> + <header id="appTopo"></header>.
 * Também expõe utilitários: mostrarToast(), abrirModal(), fecharModal().
 */

/* Ícones SVG inline (stroke-based, no estilo da landing) */
const IC = {
  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>',
  redacao: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  relatorios: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 14l3-4 3 3 4-6"/></svg>',
  materiais: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h11l5 5v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"/><path d="M14 4v5h5"/></svg>',
  financeiro: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/></svg>',
  ranking: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4"/><path d="M7 4h10v4a5 5 0 0 1-10 0Z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg>',
  alunos: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></svg>',
  correcao: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3 8-8"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"/></svg>',
  sair: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5M12 3v12"/></svg>',
  pdf: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></svg>',
  video: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="14" height="14" rx="2"/><path d="m22 8-6 4 6 4V8Z"/></svg>',
  aviso: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.3a2 2 0 0 1 3.4 0l8 14A2 2 0 0 1 20 20H4a2 2 0 0 1-1.7-2.7Z"/><path d="M12 9v4M12 17h.01"/></svg>',
  aula: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  caneta: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3Z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18Z"/><path d="M2 2l7.586 7.586"/></svg>',
  marcatexto: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>',
  sublinhar: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v6a6 6 0 0 0 12 0V4M4 20h16"/></svg>',
  comentario: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></svg>',
};

const NAV_ALUNO = [
  { id: "dashboard", rotulo: "Início", href: "dashboard.html", icone: IC.dashboard },
  { id: "redacao", rotulo: "Minhas Redações", href: "redacao.html", icone: IC.redacao },
  { id: "relatorios", rotulo: "Relatórios", href: "relatorios.html", icone: IC.relatorios },
  { id: "materiais", rotulo: "Materiais", href: "materiais.html", icone: IC.materiais },
  { id: "financeiro", rotulo: "Financeiro", href: "financeiro.html", icone: IC.financeiro },
  { id: "ranking", rotulo: "Ranking", href: "ranking.html", icone: IC.ranking },
];

const NAV_ADMIN = [
  { id: "dashboard", rotulo: "Painel", href: "dashboard.html", icone: IC.dashboard },
  { id: "correcao", rotulo: "Correção", href: "correcao.html", icone: IC.correcao },
  { id: "turmas", rotulo: "Turmas", href: "turmas.html", icone: IC.aula },
  { id: "alunos", rotulo: "Alunos", href: "#", icone: IC.alunos, emBreve: true },
  { id: "financeiro", rotulo: "Financeiro", href: "#", icone: IC.financeiro, emBreve: true },
];

/* Sessão fake do professor (gravada pelo login.html na aba "Sou professor").
   Fallback: Victor Hugo (dono), para quem abre o admin direto na demo. */
function obterSessaoProfessor() {
  try {
    const s = JSON.parse(localStorage.getItem("vh_sessao_prof"));
    if (s && s.nome && typeof s.dono === "boolean") return s;
  } catch (_) { /* JSON inválido: cai no fallback */ }
  return { id: "victor", nome: DADOS.professor.nome, iniciais: DADOS.professor.iniciais, papel: DADOS.professor.papel, dono: true };
}

function sairProfessor() {
  try { localStorage.removeItem("vh_sessao_prof"); } catch (_) {}
}

function montarShell() {
  const body = document.body;
  const area = body.dataset.area; // "aluno" | "admin"
  const paginaAtiva = body.dataset.pagina;
  const nav = area === "admin" ? NAV_ADMIN : NAV_ALUNO;

  // perfil exibido no header depende da área (admin: sessão do login fake)
  const prof = area === "admin" ? obterSessaoProfessor() : null;
  const perfil = prof
    ? { nome: prof.nome, iniciais: prof.iniciais, sub: prof.papel }
    : { nome: DADOS.alunoLogado.nome, iniciais: DADOS.alunoLogado.iniciais, sub: DADOS.alunoLogado.turma };

  const marcaSub = area === "admin" ? "Painel do Professor" : "Área do Aluno";

  // --- Sidebar ---
  const itensHtml = nav.map((it) => {
    if (it.emBreve) {
      return `<span class="nav-item em-breve">${it.icone}<span class="rot-nav">${it.rotulo}</span><span class="selo">em breve</span></span>`;
    }
    const ativo = it.id === paginaAtiva ? " ativo" : "";
    return `<a class="nav-item${ativo}" href="${it.href}">${it.icone}<span class="rot-nav">${it.rotulo}</span></a>`;
  }).join("");

  const sidebar = document.getElementById("appSidebar");
  if (sidebar) {
    sidebar.className = "sidebar";
    sidebar.innerHTML = `
      <div class="sidebar-marca">
        <img src="../../assets/media/marca/logo-sem-fundo.png" alt="Victor Hugo Redação">
        <div>
          <div class="marca-nome">Victor Hugo</div>
          <div class="marca-sub">${marcaSub}</div>
        </div>
      </div>
      ${itensHtml}
      <a class="nav-item nav-sep" href="../login.html"${area === "admin" ? ' onclick="sairProfessor()"' : ""}>${IC.sair}<span class="rot-nav">Sair</span></a>
    `;
  }

  // --- Header ---
  const topo = document.getElementById("appTopo");
  if (topo) {
    topo.className = "topo";
    topo.innerHTML = `
      <div class="topo-titulo">
        <h1>${body.dataset.titulo || ""}</h1>
        ${body.dataset.subtitulo ? `<p>${body.dataset.subtitulo}</p>` : ""}
      </div>
      <div class="topo-perfil">
        <div class="topo-perfil-info">
          <div class="nome">${perfil.nome}</div>
          <div class="turma">${perfil.sub}</div>
        </div>
        <div class="avatar">${perfil.iniciais}</div>
      </div>
    `;
  }

  // área de toast (uma por página)
  if (!document.querySelector(".toast-area")) {
    const ta = document.createElement("div");
    ta.className = "toast-area";
    document.body.appendChild(ta);
  }
}

/* ===== Toast ===== */
function mostrarToast(texto, tipo = "ok") {
  let area = document.querySelector(".toast-area");
  if (!area) {
    area = document.createElement("div");
    area.className = "toast-area";
    document.body.appendChild(area);
  }
  const t = document.createElement("div");
  t.className = "toast " + tipo;
  const icone = tipo === "info" ? IC.aviso : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;flex-shrink:0"><path d="M20 6 9 17l-5-5"/></svg>';
  t.innerHTML = `<span style="display:flex">${icone}</span><span>${texto}</span>`;
  area.appendChild(t);
  setTimeout(() => {
    t.classList.add("saindo");
    setTimeout(() => t.remove(), 260);
  }, 3400);
}

/* ===== Modal ===== */
function abrirModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add("aberto");
}
function fecharModal(id) {
  const m = id ? document.getElementById(id) : document.querySelector(".modal-overlay.aberto");
  if (m) m.classList.remove("aberto");
}
document.addEventListener("click", (e) => {
  if (e.target.classList && e.target.classList.contains("modal-overlay")) {
    e.target.classList.remove("aberto");
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") fecharModal();
});

/* ===== Helpers ===== */
function formatarBRL(v) {
  return "R$ " + v.toFixed(2).replace(".", ",");
}

document.addEventListener("DOMContentLoaded", montarShell);
