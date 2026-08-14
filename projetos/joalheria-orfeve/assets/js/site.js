/* ══════════════════════════════════════════════════════════════════════
   ORFÈVE — interações
   ══════════════════════════════════════════════════════════════════════ */
(() => {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;


/* ── cursor ─────────────────────────────────────────────────────────── */
if (fine && !calm) {
  const cur  = $('.cursor');
  const dot  = $('.cursor__dot');
  const ring = $('.cursor__ring');
  let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, on = false;

  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX; y = e.clientY;
    if (!on) { on = true; cur.classList.add('on'); rx = x; ry = y; }
    dot.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
  }, { passive: true });

  (function trail() {
    rx += (x - rx) * .14;
    ry += (y - ry) * .14;
    ring.style.transform = `translate3d(${rx.toFixed(2)}px,${ry.toFixed(2)}px,0) translate(-50%,-50%)`;
    requestAnimationFrame(trail);
  })();

  const hot = 'a,button,input,.ang';
  addEventListener('pointerover', e => {
    if (e.target.closest?.(hot)) cur.classList.add('hot');
  }, { passive: true });
  addEventListener('pointerout', e => {
    if (e.target.closest?.(hot)) cur.classList.remove('hot');
  }, { passive: true });
  addEventListener('blur', () => cur.classList.remove('on'));
}


/* ── header: encolhe no scroll ──────────────────────────────────────── */
const hd = $('#hd');
let lastStuck = null;
const onStuck = () => {
  const s = scrollY > 40;
  if (s !== lastStuck) { lastStuck = s; hd.classList.toggle('stuck', s); }
};
onStuck();


/* ── menu mobile ────────────────────────────────────────────────────── */
{
  const bt = $('#btMenu'), menu = $('#menu');
  const set = open => {
    bt.setAttribute('aria-expanded', String(open));
    bt.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(() => {
        menu.classList.add('on');
        $$('.menu__nav a', menu).forEach((a, i) => a.style.transitionDelay = `${.06 + i * .055}s`);
      });
    } else {
      menu.classList.remove('on');
      setTimeout(() => { menu.hidden = true; }, calm ? 0 : 450);
    }
  };
  bt.addEventListener('click', () => set(bt.getAttribute('aria-expanded') !== 'true'));
  $$('.menu__nav a', menu).forEach(a => a.addEventListener('click', () => set(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) set(false); });
}


/* ── busca: filtra as peças do grid ─────────────────────────────────── */
{
  const bt = $('#btBusca'), box = $('#busca'), inp = $('#buscaInput'),
        hint = $('#buscaHint'), fechar = $('#btBuscaX');
  const pecas = $$('.peca');
  const limpo = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

  const set = open => {
    bt.setAttribute('aria-expanded', String(open));
    box.hidden = !open;
    if (open) inp.focus();
    else { inp.value = ''; filtrar(); }
  };
  const filtrar = () => {
    const q = limpo(inp.value);
    if (!q) { pecas.forEach(p => p.hidden = false); hint.textContent = ''; return; }
    let n = 0;
    pecas.forEach(p => {
      const alvo = limpo(`${p.dataset.nome} ${p.dataset.col}`);
      const bate = alvo.includes(q);
      p.hidden = !bate;
      if (bate) n++;
    });
    hint.textContent = n ? `${n} ${n === 1 ? 'peça' : 'peças'}` : 'Nenhuma peça — fale com o ateliê';
  };

  bt.addEventListener('click', () => set(box.hidden));
  fechar.addEventListener('click', () => set(false));
  inp.addEventListener('input', filtrar);
  inp.addEventListener('keydown', e => {
    if (e.key === 'Escape') set(false);
    if (e.key === 'Enter') { e.preventDefault(); $('#joias').scrollIntoView({ behavior: calm ? 'auto' : 'smooth' }); }
  });
}


/* ── revelação no scroll ────────────────────────────────────────────── */
{
  const io = new IntersectionObserver((es, o) => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      o.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: .12 });

  $$('.rv, .edi__big').forEach((el, i) => {
    if (el.parentElement?.classList.contains('mani__cols') ||
        el.closest('.exp__l') || el.closest('.grid')) {
      el.style.transitionDelay = `${(i % 4) * .09}s`;
    }
    io.observe(el);
  });
}


/* ── nav ativa ──────────────────────────────────────────────────────── */
{
  const secs = ['#hero', '#colecoes', '#joias', '#marca', '#experiencia']
    .map(id => $(id)).filter(Boolean);
  const links = new Map($$('.nav a').map(a => [a.getAttribute('href'), a]));
  const io = new IntersectionObserver(es => {
    es.forEach(e => {
      const a = links.get('#' + e.target.id) || (e.target.id === 'hero' ? links.get('#topo') : null);
      if (a) a.classList.toggle('act', e.isIntersecting);
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(s => io.observe(s));
}


/* ── hero: dois vídeos em sequência ─────────────────────────────────── */
{
  const hero = $('#hero'), v1 = $('#v1'), v2 = $('#v2');
  let atual = v1, armado = false;

  requestAnimationFrame(() => hero.classList.add('lit'));

  const trocar = () => {
    const prox = atual === v1 ? v2 : v1;
    prox.currentTime = 0;
    const p = prox.play();
    if (p) p.catch(() => {});
    prox.classList.add('is-on');
    atual.classList.remove('is-on');
    // pausa o anterior só depois do fade, para não travar a imagem no corte
    const sai = atual;
    setTimeout(() => { if (sai !== prox) sai.pause(); }, 900);
    atual = prox;
    armado = false;
  };

  // o segundo vídeo só começa a baixar na metade do primeiro (§17)
  const armar = () => {
    if (armado || !atual.duration) return;
    if (atual.currentTime / atual.duration < .45) return;
    armado = true;
    const prox = atual === v1 ? v2 : v1;
    if (prox.preload !== 'auto') { prox.preload = 'auto'; prox.load(); }
  };

  [v1, v2].forEach(v => {
    v.addEventListener('ended', trocar);
    v.addEventListener('timeupdate', armar, { passive: true });
  });

  if (calm) {
    v1.removeAttribute('autoplay');
  } else {
    const p = v1.play();
    if (p) p.catch(() => { /* autoplay barrado: fica o poster */ });
  }

  // pausa o hero quando ele sai da tela
  new IntersectionObserver(es => {
    es.forEach(e => {
      if (calm) return;
      if (e.isIntersecting) { const p = atual.play(); if (p) p.catch(() => {}); }
      else atual.pause();
    });
  }, { threshold: .05 }).observe(hero);

  /* progresso do scroll dentro do hero (sticky cinematográfico) */
  const media = $('.hero__media'), txt = $('.hero__txt');
  let tick = false;
  const quadro = () => {
    tick = false;
    onStuck();
    if (calm) return;
    const r = hero.getBoundingClientRect();
    const total = hero.offsetHeight - innerHeight;
    if (total <= 0 || r.bottom < 0 || r.top > innerHeight) return;
    const p = Math.min(1, Math.max(0, -r.top / total));
    media.style.transform = `scale(${(1 + p * .075).toFixed(4)})`;
    txt.style.transform = `translate3d(0,${(-p * 70).toFixed(2)}px,0)`;
    txt.style.opacity = String(Math.max(0, 1 - p * 1.15));
  };
  addEventListener('scroll', () => {
    if (!tick) { tick = true; requestAnimationFrame(quadro); }
  }, { passive: true });
  quadro();
}


/* ── filme: toca só quando está na tela ─────────────────────────────── */
{
  const v = $('#filmV');
  if (v) new IntersectionObserver(es => {
    es.forEach(e => {
      if (e.isIntersecting && !calm) {
        if (v.preload !== 'auto') { v.preload = 'auto'; v.load(); }
        const p = v.play(); if (p) p.catch(() => {});
      } else v.pause();
    });
  }, { threshold: .3 }).observe(v);
}


/* ── ângulos: o cursor gira a peça ──────────────────────────────────── */
$$('.ang').forEach(fig => {
  const urls = (fig.dataset.angles || '').split('|').filter(Boolean);
  if (urls.length < 2) return;

  const base = fig.querySelector('img');
  const alt  = fig.dataset.alt || base?.alt || '';
  let camadas = [base], regua, idx = 0, pronto = false;

  const montar = () => {
    if (pronto) return;
    pronto = true;
    base.classList.add('on');
    // as demais entram como decorativas: o alt já foi dito na primeira
    urls.slice(1).forEach(src => {
      const im = new Image();
      im.src = src; im.alt = ''; im.width = base.width; im.height = base.height;
      im.decoding = 'async'; im.setAttribute('aria-hidden', 'true');
      fig.appendChild(im);
      camadas.push(im);
    });
    regua = document.createElement('span');
    regua.className = 'ruler';
    regua.setAttribute('aria-hidden', 'true');
    urls.forEach(() => regua.appendChild(document.createElement('i')));
    fig.appendChild(regua);
    idx = -1; mirar(0);
    fig.setAttribute('role', 'img');
    fig.setAttribute('aria-label', alt);
  };

  // pointermove já vem no máximo uma vez por quadro; trocar classe é barato
  const mirar = i => {
    if (i === idx) return;
    idx = i;
    camadas.forEach((im, n) => im.classList.toggle('on', n === i));
    if (regua) [...regua.children].forEach((el, n) => el.classList.toggle('on', n === i));
  };

  const daPosicao = clientX => {
    const r = fig.getBoundingClientRect();
    const t = Math.min(.9999, Math.max(0, (clientX - r.left) / r.width));
    return Math.floor(t * urls.length);
  };

  // só monta quando a peça se aproxima da viewport (§17)
  new IntersectionObserver((es, o) => {
    es.forEach(e => { if (e.isIntersecting) { montar(); o.disconnect(); } });
  }, { rootMargin: '400px' }).observe(fig);

  fig.addEventListener('pointermove', e => {
    if (!pronto) return;
    if (e.pointerType === 'touch' && !e.buttons && e.pressure === 0) return;
    mirar(daPosicao(e.clientX));
  }, { passive: true });

  fig.addEventListener('pointerdown', e => {
    fig.classList.add('touched');
    if (pronto) mirar(daPosicao(e.clientX));
  }, { passive: true });

  fig.addEventListener('pointerleave', () => {
    if (!pronto) return;
    fig.classList.remove('touched');
    mirar(0);
  });

  // teclado: setas percorrem os ângulos
  fig.tabIndex = 0;
  fig.addEventListener('keydown', e => {
    if (!pronto) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); mirar(Math.min(urls.length - 1, idx + 1)); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); mirar(Math.max(0, idx - 1)); }
  });
  fig.addEventListener('focus', () => fig.classList.add('touched'));
  fig.addEventListener('blur',  () => { fig.classList.remove('touched'); mirar(0); });
});

})();
