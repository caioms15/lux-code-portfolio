// Menu mobile + contador animado + sombra do header ao rolar + loop de trecho de vídeo.

(function setupMenuMobile() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("headerNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });
})();

(function setupHeaderScroll() {
  const header = document.getElementById("header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

(function setupContadores() {
  const numeros = document.querySelectorAll(".hero-stat-number[data-count]");
  if (!numeros.length) return;

  const animar = (el) => {
    const alvo = parseInt(el.dataset.count, 10);
    const prefixo = el.dataset.prefix || "";
    const sufixo = el.dataset.suffix || "";
    const duracao = 1300;
    const inicio = performance.now();

    function passo(agora) {
      const progresso = Math.min((agora - inicio) / duracao, 1);
      const eased = 1 - Math.pow(1 - progresso, 3); // easeOutCubic
      el.textContent = prefixo + Math.floor(eased * alvo) + (progresso === 1 ? sufixo : "");
      if (progresso < 1) requestAnimationFrame(passo);
      else el.textContent = prefixo + alvo + sufixo;
    }
    requestAnimationFrame(passo);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animar(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  const iniciar = () => numeros.forEach((el) => observer.observe(el));

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // Sem contagem: valores finais direto.
    numeros.forEach((el) => {
      el.textContent = (el.dataset.prefix || "") + el.dataset.count + (el.dataset.suffix || "");
    });
  } else if (window.vhQuandoHeroPronto) {
    // Espera a coreografia pós-splash chegar nos stats (delay de 460ms
    // definido em css/motion.css) antes de disparar os contadores.
    window.vhQuandoHeroPronto(() => setTimeout(iniciar, 460));
  } else {
    iniciar();
  }
})();

(function setupLoopDeTrecho() {
  // Vídeos com data-loop-inicio/fim tocam só esse trecho em loop
  // (o arquivo manaus-noite.mp4 tem créditos do videomaker no final).
  document.querySelectorAll("video[data-loop-inicio]").forEach((video) => {
    const inicio = parseFloat(video.dataset.loopInicio);
    const fim = parseFloat(video.dataset.loopFim);

    const irParaInicio = () => {
      video.currentTime = inicio;
    };

    if (video.readyState >= 1) irParaInicio();
    else video.addEventListener("loadedmetadata", irParaInicio, { once: true });

    video.addEventListener("timeupdate", () => {
      // O segundo teste cobre o wrap do atributo `loop` de volta ao 0s.
      if (video.currentTime >= fim || video.currentTime < inicio - 0.5) irParaInicio();
    });
  });
})();
