/* ============================================================
   NASSER & COUTINHO — interações
   ============================================================ */
(function () {
  "use strict";

  const splash = document.getElementById("splash");
  const splashLogo = document.getElementById("splashLogo");
  const nav = document.getElementById("nav");
  const navLogo = document.getElementById("navLogo");

  const flat = /[?&]flat\b/.test(location.search);
  const reduceMotion = flat || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const connection = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
  const isSlowConnection = !!(connection && (connection.saveData || /^(slow-2g|2g|3g)$/.test(connection.effectiveType || "")));

  // pula a splash inteiramente: menos movimento, conexão fraca, ou motivo de teste (?flat)
  const skipSplash = reduceMotion || isSlowConnection;

  function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

  /* -----------------------------------------------------------
     1. SPLASH SCREEN — anima rápido e depois voa para o menu (FLIP)
     ----------------------------------------------------------- */
  function flyLogoToNav() {
    try {
      const bigMono = splashLogo.querySelector(".monogram--lg");
      const from = bigMono.getBoundingClientRect();
      const to = navLogo.getBoundingClientRect();

      const scale = to.height / from.height;
      const dx = (to.left + to.width / 2) - (from.left + from.width / 2);
      const dy = (to.top + to.height / 2) - (from.top + from.height / 2);

      // "NASSER & COUTINHO" e "ARQUITETURA" saem de cena junto com o voo.
      // Desligamos as animações CSS (o 'forwards' delas trava a opacidade em 1
      // e ignoraria o fade), fixamos o estado visível e então transicionamos p/ 0.
      const wordmark = splashLogo.querySelector(".wordmark");
      const sub = splashLogo.querySelector(".subwordmark");
      [wordmark, sub].forEach((el) => {
        el.style.animation = "none";
        el.style.opacity = "1";
      });
      void splashLogo.offsetWidth; // reflow: aplica o estado antes de transicionar
      [wordmark, sub].forEach((el) => {
        el.style.transition = "opacity .45s ease";
        el.style.opacity = "0";
      });

      bigMono.style.transition = "transform .7s cubic-bezier(.7,0,.2,1)";
      bigMono.style.transformOrigin = "center center";
      bigMono.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
    } catch (err) {
      /* segue para revelar a página mesmo se a animação FLIP falhar */
    }

    setTimeout(finishSplash, 650);
  }

  let splashDone = false;
  function finishSplash() {
    if (splashDone) return;
    splashDone = true;
    nav.classList.add("brand-ready");
    splash.classList.add("is-hidden");
    startPage();
  }

  function startPage() {
    if (document.body.classList.contains("loaded")) return;
    document.body.classList.add("loaded");
    if (reduceMotion) {
      revealEls.forEach((el) => el.classList.add("in"));
      return;
    }
    revealCheck();
  }

  function runSplash() {
    if (skipSplash) {
      finishSplash();
      return;
    }
    requestAnimationFrame(() => {
      splash.classList.add("play");
      // deixa a sequência inteira aparecer (monograma + wordmark + "ARQUITETURA")
      // antes de o logo voar para o menu — sincronizado com os tempos do CSS
      setTimeout(flyLogoToNav, 2300);
    });
  }

  // rede de segurança: nunca deixa a splash bloquear a página por mais de ~3.6s,
  // mesmo se document.fonts, matchMedia ou a animação FLIP falharem
  setTimeout(finishSplash, 3600);

  if (document.fonts && document.fonts.ready) {
    Promise.race([document.fonts.ready, wait(600)]).then(runSplash).catch(runSplash);
  } else {
    runSplash();
  }

  /* -----------------------------------------------------------
     2. NAV — fundo sólido ao rolar
     ----------------------------------------------------------- */
  function updateNav() {
    nav.classList.toggle("is-solid", window.scrollY > 60);
  }
  window.addEventListener("scroll", updateNav, { passive: true });
  updateNav();

  /* -----------------------------------------------------------
     3. REVEAL ao entrar na viewport
     ----------------------------------------------------------- */
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
  revealEls.forEach((el) => io.observe(el));

  function revealCheck() {
    // fallback: revela o que já está na tela assim que a splash libera a página
    revealEls.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9) el.classList.add("in");
    });
  }

  /* -----------------------------------------------------------
     4. ÂNCORAS — rolagem nativa (scroll-behavior: smooth via CSS);
        aqui só fechamos o menu mobile ao navegar por um link
     ----------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", () => closeMenu());
  });

  /* -----------------------------------------------------------
     5. MENU MOBILE — classe + atributos ARIA; CSS cuida do layout
     ----------------------------------------------------------- */
  const burger = document.getElementById("burger");
  const navLinks = document.getElementById("navLinks");

  function openMenu() {
    nav.classList.add("menu-open");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Fechar menu");
    const firstLink = navLinks.querySelector("a");
    if (firstLink) firstLink.focus();
  }

  function closeMenu(returnFocus) {
    if (!nav.classList.contains("menu-open")) return;
    nav.classList.remove("menu-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Abrir menu");
    if (returnFocus) burger.focus();
  }

  if (burger) {
    burger.addEventListener("click", () => {
      if (nav.classList.contains("menu-open")) closeMenu(true);
      else openMenu();
    });

    document.addEventListener("click", (e) => {
      if (nav.classList.contains("menu-open") && !nav.contains(e.target)) closeMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("menu-open")) closeMenu(true);
    });
  }

  /* -----------------------------------------------------------
     6. HERO VIDEO — poster sempre visível; reprodução só quando
        a tela é grande o bastante e a conexão não é lenta/limitada
     ----------------------------------------------------------- */
  const heroVideo = document.querySelector(".hero__video");
  if (heroVideo) {
    const canAutoplay = !reduceMotion && !isSlowConnection &&
      window.matchMedia("(min-width: 721px)").matches;
    if (canAutoplay) {
      heroVideo.play().catch(() => { /* poster permanece como fallback */ });
    }
  }
})();
