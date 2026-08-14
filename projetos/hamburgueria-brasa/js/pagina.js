/* Rolagem macia dos links internos.
   O CSS não usa scroll-behavior:smooth porque o banner troca o scroll por
   um sintético (normalizeScroll) e os dois brigariam pelo mesmo scroller.
   scrollTo programático, por outro lado, convive bem com ele. */
(function () {
  'use strict';
  var nav = document.querySelector('.nav');
  var suave = !matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --nav-h medido, em vez de repetido à mão em cada breakpoint. O banner
     usa para descer o hambúrguer da nav e a coluna de texto para não subir
     por baixo dela. Só é recalculado em resize. */
  function alturaNav() {
    if (nav) document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
  }
  alturaNav();
  addEventListener('resize', alturaNav, { passive: true });

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var alvo = document.getElementById(a.getAttribute('href').slice(1));
    if (!alvo) return;
    e.preventDefault();

    var folga = nav ? nav.offsetHeight : 0;
    var fim = Math.max(0, alvo.getBoundingClientRect().top + window.scrollY - folga);
    if (!suave) return window.scrollTo(0, fim);

    var ini = window.scrollY, t0 = 0, dur = Math.min(900, 260 + Math.abs(fim - ini) * 0.45);
    requestAnimationFrame(function passo(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / dur);
      var e2 = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;   // easeInOutCubic
      window.scrollTo(0, ini + (fim - ini) * e2);
      if (k < 1) requestAnimationFrame(passo);
    });
  });
})();

/* Revelação das seções ao entrar na tela. Um observador só, e cada
   elemento é desligado assim que aparece — nada fica escutando. */
(function () {
  'use strict';
  var alvos = document.querySelectorAll('.reveal');
  if (!alvos.length) return;

  if (!('IntersectionObserver' in window) ||
      matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (var i = 0; i < alvos.length; i++) alvos[i].classList.add('is-in');
    return;
  }

  var obs = new IntersectionObserver(function (linhas) {
    for (var i = 0; i < linhas.length; i++) {
      if (linhas[i].isIntersecting) {
        linhas[i].target.classList.add('is-in');
        obs.unobserve(linhas[i].target);
      }
    }
  }, { threshold: 0.12 });

  for (var j = 0; j < alvos.length; j++) obs.observe(alvos[j]);
})();
