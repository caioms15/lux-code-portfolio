// Motion — a linguagem da escrita (ver css/motion.css).
// Coreografia do hero pós-splash, sublinhados que se desenham, ícones da
// metodologia traçados, frase do ambiente que se escreve, barra de progresso
// de leitura e a nota 960 circulada. Tudo dispara uma vez, via
// IntersectionObserver, e respeita prefers-reduced-motion.

(function () {
  const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Ícone de lápis compartilhado (barra de progresso e risco da moldura).
  const LAPIS_SVG =
    '<svg viewBox="0 0 24 24"><path d="M3 17.2V21h3.8L17.9 9.9l-3.8-3.8L3 17.2Zm18-9.4a1 1 0 0 0 0-1.4l-2.4-2.4a1 1 0 0 0-1.4 0l-1.9 1.9 3.8 3.8 1.9-1.9Z"/></svg>';

  /* ===== Hero pronto: flag global + fila (main.js também consome) ===== */

  const filaHeroPronto = [];
  window.vhQuandoHeroPronto = function (fn) {
    if (window.VH_HERO_READY) fn();
    else filaHeroPronto.push(fn);
  };

  function iniciarHero() {
    if (window.VH_HERO_READY) return;
    window.VH_HERO_READY = true;
    document.body.classList.remove("vh-pre-hero");
    document.body.classList.add("vh-hero-ready");
    filaHeroPronto.splice(0).forEach((fn) => fn());
  }

  /* ===== Coreografia do hero (pós-splash) ===== */

  if (reduzido) {
    // Sem coreografia: hero visível e "pronto" imediatamente.
    window.VH_HERO_READY = true;
  } else if (document.getElementById("splash")) {
    document.body.classList.add("vh-pre-hero");
    window.addEventListener("vh:splash-done", iniciarHero, { once: true });
    // Rede de segurança: se o evento nunca vier, libera o hero mesmo assim.
    setTimeout(iniciarHero, 6000);
  } else {
    // ?nosplash ou splash ausente: entrada direta no próximo frame.
    requestAnimationFrame(iniciarHero);
  }

  /* ===== Sublinhado que se desenha nos destaques dos títulos ===== */

  // Path levemente ondulado — traço de lápis, não régua.
  const SUBLINHADO_PATH = "M2 7 C 30 3, 70 9, 105 6 S 165 4, 198 7";

  document
    .querySelectorAll(".hero-title .accent, .section-title span, .hero-stat-label .stat-destaque")
    .forEach((span) => {
    span.classList.add("vh-sublinhado");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "vh-sublinhado-svg");
    svg.setAttribute("viewBox", "0 0 200 12");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", SUBLINHADO_PATH);
    path.setAttribute("pathLength", "1");
    svg.appendChild(path);
    span.appendChild(svg);
  });

  /* ===== Observer único de "entrou no viewport, uma vez" ===== */

  function observarUmaVez(elementos, aoEntrar, opcoes) {
    if (!elementos.length) return;
    if (reduzido) {
      elementos.forEach(aoEntrar);
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          aoEntrar(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, opcoes);
    elementos.forEach((el) => obs.observe(el));
  }

  // Títulos de seção: o traço se desenha depois que se lê o título.
  // O do hero fica fora do observer — ele entra na coreografia pós-splash
  // (o observer dispararia embaixo do splash, e ninguém veria o gesto).
  const titulosComDestaque = [...document.querySelectorAll(".section-title")].filter((t) =>
    t.querySelector(".vh-sublinhado")
  );
  observarUmaVez(titulosComDestaque, (el) => el.classList.add("vh-inview"), { threshold: 0.6 });

  window.vhQuandoHeroPronto(() => {
    const heroTitle = document.querySelector(".hero-title");
    if (!heroTitle) return;
    // Título sobe aos 100ms e assenta ~650ms; o sublinhado vem em seguida.
    setTimeout(() => heroTitle.classList.add("vh-inview"), reduzido ? 0 : 700);
  });

  // Ícones da metodologia: pathLength normaliza o traçado sem medir nada.
  document
    .querySelectorAll(".metodologia-icon path, .metodologia-icon rect, .metodologia-icon circle")
    .forEach((p) => p.setAttribute("pathLength", "1"));
  observarUmaVez(
    [...document.querySelectorAll(".metodologia-card")],
    (card) => card.classList.add("vh-inview"),
    { threshold: 0.4 }
  );

  /* ===== A frase do ambiente que se escreve ===== */

  (function prepararAmbiente() {
    const frase = document.querySelector(".ambiente-frase");
    const assinatura = document.querySelector(".ambiente-assinatura");
    const secao = document.querySelector(".ambiente");
    if (!frase || !secao) return;

    if (!reduzido) {
      const texto = frase.textContent;
      frase.setAttribute("aria-label", texto);
      const palavras = texto.trim().split(/\s+/);
      frase.textContent = "";
      const miolo = document.createElement("span");
      miolo.setAttribute("aria-hidden", "true");
      palavras.forEach((palavra, i) => {
        const s = document.createElement("span");
        s.className = "vh-palavra";
        s.style.setProperty("--i", i);
        s.textContent = palavra;
        miolo.appendChild(s);
        if (i < palavras.length - 1) miolo.appendChild(document.createTextNode(" "));
      });
      frase.appendChild(miolo);

      if (assinatura) {
        assinatura.classList.add("vh-clip");
        assinatura.style.setProperty(
          "--vh-assinatura-delay",
          `${(palavras.length * 40 + 300) / 1000}s`
        );
      }
    }

    observarUmaVez([secao], (el) => el.classList.add("vh-inview"), { threshold: 0.5 });
  })();

  /* ===== Barra de progresso de leitura (traço de lápis) ===== */

  (function progressoDeLeitura() {
    const header = document.getElementById("header");
    if (!header) return;

    const wrap = document.createElement("div");
    wrap.className = "vh-progresso";
    wrap.setAttribute("aria-hidden", "true");
    wrap.innerHTML =
      '<div class="vh-progresso-traco"></div>' +
      '<div class="vh-progresso-lapis">' + LAPIS_SVG + "</div>";
    header.appendChild(wrap);

    const traco = wrap.querySelector(".vh-progresso-traco");
    const lapis = reduzido ? null : wrap.querySelector(".vh-progresso-lapis");
    let agendado = false;

    function atualizar() {
      agendado = false;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const p = total > 0 ? Math.min(window.scrollY / total, 1) : 0;
      traco.style.transform = `scaleX(${p})`;
      if (lapis) lapis.style.transform = `translate(${p * wrap.offsetWidth - 2}px, -50%)`;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!agendado) {
          agendado = true;
          requestAnimationFrame(atualizar);
        }
      },
      { passive: true }
    );
    atualizar();
  })();

  /* ===== Nota 960 circulada (gesto de professor) ===== */

  (function circularNota() {
    const stat = document.querySelector(".hero-stat-number[data-count]");
    if (!stat) return;

    const wrap = document.createElement("span");
    wrap.className = "vh-nota-wrap";
    stat.parentNode.insertBefore(wrap, stat);
    wrap.appendChild(stat);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "vh-elipse");
    svg.setAttribute("viewBox", "0 0 200 80");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    // Laço único desenhado à mão, dando a volta completa e voltando a cruzar o
    // ponto de partida no topo (sobreposição de caneta, sem lacuna aberta).
    // Começa em ~(112,8), percorre direita/baixo/esquerda/cima e retorna
    // passando de novo pelo topo até ~(130,7).
    path.setAttribute(
      "d",
      "M112 8 C 165 6, 196 22, 193 40 C 190 63, 150 77, 98 75 C 44 73, 6 58, 7 38 C 8 18, 48 5, 100 7 C 152 9, 190 24, 186 41 C 183 56, 158 66, 130 7"
    );
    path.setAttribute("pathLength", "1");
    svg.appendChild(path);
    wrap.appendChild(svg);

    // Circula ~1,5s depois do início dos contadores (fim do easeOutCubic).
    window.vhQuandoHeroPronto(() => {
      const espera = reduzido ? 0 : 460 + 1500;
      setTimeout(() => wrap.classList.add("vh-circulada"), espera);
    });
  })();

  /* ===== Quantidade de alunos em destaque (sublinhado + pop) ===== */

  (function destacarQuantidade() {
    const span = document.querySelector(".hero-stat-label .stat-destaque");
    if (!span) return;
    window.vhQuandoHeroPronto(() => {
      // Entra logo depois da nota circulada terminar de se traçar.
      const espera = reduzido ? 0 : 460 + 1500 + 650;
      setTimeout(() => span.classList.add("vh-inview", "vh-destacado"), espera);
    });
  })();

  /* ===== Lápis que risca a moldura tracejada do professor ===== */

  (function riscarMoldura() {
    const frame = document.querySelector(".hero-foto-frame");
    const arch = document.querySelector(".hero-foto-arch");
    // Sem JS/reduzido: permanece o ::before tracejado estático do CSS.
    if (!frame || !arch || reduzido) return;

    arch.classList.add("vh-arco-js");

    const NS = "http://www.w3.org/2000/svg";
    const INSET = 14; // espelha o inset do ::before original
    let svg = null;
    let lapis = null;

    function construir() {
      const W = frame.clientWidth;
      const H = frame.clientHeight;
      if (!W || !H) return;
      // border-radius 999px 999px 0 0 com inset: raio clampado à metade da largura.
      const R = Math.min((W - INSET * 2) / 2, H - INSET);
      const d =
        `M ${INSET} ${H} L ${INSET} ${INSET + R} ` +
        `A ${R} ${R} 0 0 1 ${W - INSET} ${INSET + R} ` +
        `L ${W - INSET} ${H}`;

      if (svg) svg.remove();
      if (lapis) lapis.remove();

      svg = document.createElementNS(NS, "svg");
      svg.setAttribute("class", "vh-arco-svg");
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svg.setAttribute("aria-hidden", "true");
      svg.innerHTML =
        '<defs><mask id="vhArcoMask" maskUnits="userSpaceOnUse">' +
        `<path class="vh-arco-reveal" d="${d}" pathLength="1" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round"/>` +
        '</mask><mask id="vhArcoMaskBrilho" maskUnits="userSpaceOnUse">' +
        `<path class="vh-arco-reveal-brilho" d="${d}" pathLength="1" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round"/>` +
        "</mask></defs>" +
        `<path class="vh-arco-traco" d="${d}" fill="none" mask="url(#vhArcoMask)"/>` +
        `<path class="vh-arco-brilho" d="${d}" fill="none" mask="url(#vhArcoMaskBrilho)"/>`;
      // Depois do arch (o fundo azul dele lavaria o laranja), antes da foto.
      frame.insertBefore(svg, arch.nextSibling);

      lapis = document.createElement("div");
      lapis.className = "vh-arco-lapis";
      lapis.innerHTML = LAPIS_SVG;
      lapis.style.offsetPath = `path("${d}")`;
      frame.appendChild(lapis);
    }

    // O arco entra aos 300ms e assenta ~950ms (vh-arch-in); o risco vem em
    // seguida e fica em loop (ciclo de 40s — ver vh-arco-risco no CSS).
    window.vhQuandoHeroPronto(() => {
      construir();
      setTimeout(() => frame.classList.add("vh-arco-riscada"), 950);
    });

    let t;
    window.addEventListener("resize", () => {
      clearTimeout(t);
      t = setTimeout(() => {
        if (window.VH_HERO_READY) construir();
      }, 150);
    });
  })();
})();
