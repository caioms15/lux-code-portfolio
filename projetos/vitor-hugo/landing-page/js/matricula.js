/* ===== Victor Hugo Redação — Modal de matrícula =====
 * Intercepta os CTAs [data-abrir-matricula], mostra as turmas (fonte:
 * ../sistema-gestao/js/turmas.js — editáveis pelo painel do professor) e
 * envia o interessado ao WhatsApp com mensagem pré-preenchida.
 * Se turmas.js não carregar, os CTAs mantêm o href direto para o WhatsApp.
 */
(function () {
  const WHATS = "https://wa.me/5592985189494";

  function montarModal() {
    const wrap = document.createElement("div");
    wrap.className = "matricula-overlay";
    wrap.id = "matriculaOverlay";
    wrap.innerHTML = `
      <div class="matricula-modal" role="dialog" aria-modal="true" aria-labelledby="matriculaTitulo">
        <button type="button" class="matricula-fechar" aria-label="Fechar">&times;</button>
        <span class="eyebrow">Matrículas 2026</span>
        <h3 class="matricula-titulo" id="matriculaTitulo">Escolha a sua <span>turma</span>.</h3>
        <p class="matricula-sub">Preencha seu nome, escolha a turma e continue a conversa no WhatsApp.</p>
        <form id="matriculaForm" novalidate>
          <div class="matricula-campo">
            <label for="matriculaNome">Seu nome</label>
            <input type="text" id="matriculaNome" placeholder="Como devemos te chamar?" autocomplete="name">
            <p class="matricula-erro" id="erroNome">Escreva seu nome para continuar.</p>
          </div>
          <div class="matricula-campo">
            <span class="matricula-legenda">Turmas disponíveis</span>
            <div class="matricula-turmas" id="matriculaTurmas"></div>
            <p class="matricula-erro" id="erroTurma">Escolha uma turma com vagas.</p>
          </div>
          <button type="submit" class="btn btn-accent btn-lg matricula-enviar">Continuar no WhatsApp</button>
          <p class="matricula-nota">Você será direcionado ao WhatsApp do curso com sua mensagem pronta.</p>
        </form>
      </div>`;
    document.body.appendChild(wrap);
    return wrap;
  }

  function popularTurmas(container) {
    const turmas = obterTurmas();
    container.innerHTML = turmas.map((t) => {
      const st = (typeof TURMAS_STATUS !== "undefined" && TURMAS_STATUS[t.vagas]) || { rotulo: t.vagas, chip: "neutro" };
      const esgotada = t.vagas === "esgotada";
      return `
        <label class="turma-opcao${esgotada ? " esgotada" : ""}">
          <input type="radio" name="turma" value="${t.id}" ${esgotada ? "disabled" : ""}>
          <span class="turma-info">
            <span class="turma-nome">${t.nome} <span class="turma-chip ${st.chip}">${st.rotulo}</span></span>
            <span class="turma-detalhe">${t.dias} · ${t.horario} · Foco: ${t.foco}</span>
          </span>
        </label>`;
    }).join("");
    return turmas;
  }

  function init() {
    const gatilhos = document.querySelectorAll("[data-abrir-matricula]");
    if (!gatilhos.length) return;
    // turmas.js ausente (404)? CTAs seguem como link direto para o WhatsApp.
    if (typeof obterTurmas !== "function") return;

    const overlay = montarModal();
    const form = overlay.querySelector("#matriculaForm");
    const campoNome = overlay.querySelector("#matriculaNome");
    const listaTurmas = overlay.querySelector("#matriculaTurmas");
    const erroNome = overlay.querySelector("#erroNome");
    const erroTurma = overlay.querySelector("#erroTurma");
    let turmasAtuais = [];

    function abrir(e) {
      e.preventDefault();
      turmasAtuais = popularTurmas(listaTurmas);
      erroNome.classList.remove("visivel");
      erroTurma.classList.remove("visivel");
      overlay.classList.add("aberto");
      campoNome.focus();
    }
    function fechar() {
      overlay.classList.remove("aberto");
    }

    gatilhos.forEach((g) => g.addEventListener("click", abrir));
    overlay.querySelector(".matricula-fechar").addEventListener("click", fechar);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) fechar();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("aberto")) fechar();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nome = campoNome.value.trim();
      const marcada = form.querySelector('input[name="turma"]:checked');
      erroNome.classList.toggle("visivel", !nome);
      erroTurma.classList.toggle("visivel", !marcada);
      if (!nome || !marcada) return;

      const turma = turmasAtuais.find((t) => t.id === marcada.value);
      const texto = `Olá! Meu nome é ${nome} e tenho interesse na turma ${turma.nome} (${turma.dias}, ${turma.horario}).`;
      // anchor temporário: abre em nova aba com noopener sem o retorno null
      // de window.open(..., "noopener"), que forçaria navegação dupla
      const url = WHATS + "?text=" + encodeURIComponent(texto);
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
      fechar();
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
