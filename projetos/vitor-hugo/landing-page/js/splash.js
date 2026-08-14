// Splash de abertura: logo Victor Hugo animada (V dá zoom, lápis escreve o traço).
// A geometria vive no objeto GEO abaixo e é sincronizada a partir do arquivo
// editável assets/media/marca/logo-animada.svg pelo script
// landing-page/dev/sync-logo.mjs — edite o SVG, rode o sync, não edite GEO à mão.

(function () {
  // ?nosplash pula a animação (útil para desenvolvimento/testes).
  // prefers-reduced-motion também pula: o splash é pura coreografia.
  if (
    window.location.search.indexOf("nosplash") !== -1 ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;

  const AZUL = "#0e306b";
  const LARANJA = "#d34a15";

  /* GEO:INICIO (gerado por sync-logo.mjs — não editar manualmente) */
  const GEO = {
    trace: "M 430 553 C 439 553, 467 552, 482 551 C 497 550, 506 549, 518 547 C 530 545, 542 545, 554 542 C 566 538, 578 533, 589 527 C 600 521, 610 513, 619 505 C 628 496, 637 486, 644 476 C 650 465, 655 453, 658 441 C 661 429, 663 417, 662 405 C 660 393, 658 380, 652 370 C 646 359, 636 348, 626 342 C 616 336, 603 333, 591 332 C 579 332, 566 334, 556 340 C 545 345, 534 354, 527 364 C 519 373, 514 385, 510 397 C 505 409, 502 421, 500 433 C 499 446, 498 459, 498 472 C 498 484, 498 495, 499 509 C 500 523, 503 540, 504 554 C 506 568, 508 580, 509 593 C 510 606, 512 617, 513 629 C 514 641, 516 653, 517 665 C 518 677, 520 689, 521 701 C 522 713, 522 725, 525 737 C 528 749, 530 762, 536 772 C 542 783, 552 793, 563 799 C 573 805, 587 808, 599 809 C 611 810, 625 808, 636 804 C 647 799, 659 791, 667 782 C 676 773, 682 761, 687 749 C 692 737, 696 725, 699 713 C 702 701, 704 689, 707 677 C 709 665, 712 653, 714 641 C 715 629, 717 617, 718 605 C 719 593, 721 581, 722 569 C 723 557, 724 545, 726 533 C 728 521, 728 509, 732 497 C 736 485, 742 473, 750 464 C 758 454, 768 445, 779 440 C 790 435, 804 433, 816 433 C 828 433, 842 436, 852 441 C 863 447, 874 457, 880 467 C 886 477, 889 490, 892 502 C 894 515, 893 528, 892 540 C 892 553, 890 565, 889 577 C 888 589, 886 601, 885 613 C 884 625, 882 637, 881 649 C 880 661, 878 673, 877 685 C 876 697, 874 709, 873 721 C 872 733, 870 745, 873 757 C 876 769, 882 781, 890 791 C 897 801, 908 810, 919 816 C 930 822, 944 826, 956 828 C 969 830, 982 830, 994 827 C 1006 825, 1018 820, 1030 814 C 1041 808, 1051 800, 1060 791 C 1070 782, 1078 772, 1085 761 C 1092 750, 1098 738, 1103 726 C 1108 714, 1114 698, 1117 686 C 1120 674, 1121 660, 1122 655",
    traceWidth: 85,
    innerWidth: 14,
    v: "M 45 265 L 198 265 L 368 712 L 543 314 L 635 300 L 458 830 L 318 830 Z",
    acento: "M 569 250 L 714 250 L 695 295 L 557 282 Z",
    pontaCone: "M 1138 544 Q 1151 532 1160 550 C 1170 573, 1177 612, 1179 647 L 1070 654 C 1082 611, 1104 571, 1138 544 Z",
    pontaSeta: "M 1131 570 L 1090 627 L 1117 632 L 1131 610 L 1146 631 L 1166 620 Z",
    borrachaHalo: { x: 326, y: 508, w: 104, h: 90, rx: 14 },
    borrachaLaranja: { x: 334, y: 519, w: 52, h: 68, rx: 10 },
    borrachaFerrolho: { x: 384, y: 517, w: 46, h: 72, rx: 8 },
    redacaoArc: "M 856 962 A 340 340 0 0 0 1251 758",
    redacaoFont: 88,
    redacaoSpacing: 4
  };
  /* GEO:FIM */

  const svg = `
  <svg class="splash-logo" viewBox="0 0 1254 1000" xmlns="http://www.w3.org/2000/svg" fill="none">
    <defs>
      <path id="redacaoArc" d="${GEO.redacaoArc}" fill="none"/>
    </defs>

    <g id="vectorLogo">
    <!-- V -->
    <path class="splash-v" d="${GEO.v}" fill="${AZUL}"/>
    <path class="splash-acento" d="${GEO.acento}" fill="${AZUL}"/>

    <!-- traço do lápis (corpo azul) -->
    <path class="splash-trace" d="${GEO.trace}" style="stroke-width:${GEO.traceWidth}"/>

    <!-- cone da ponta (sob o miolo branco, para o traço entrar nele) -->
    <g class="splash-ponta">
      <path d="${GEO.pontaCone}" fill="${AZUL}"/>
    </g>

    <!-- miolo branco do traço -->
    <path class="splash-trace-inner" d="${GEO.trace}" style="stroke-width:${GEO.innerWidth}"/>

    <!-- seta branca dentro da ponta (base entalhada, como na logo) -->
    <g class="splash-ponta">
      <path d="${GEO.pontaSeta}" fill="#ffffff"/>
    </g>

    <!-- borracha: halo branco + laranja + ferrolho com contorno azul -->
    <g class="splash-borracha">
      <rect x="${GEO.borrachaHalo.x}" y="${GEO.borrachaHalo.y}" width="${GEO.borrachaHalo.w}" height="${GEO.borrachaHalo.h}" rx="${GEO.borrachaHalo.rx}" fill="#ffffff"/>
      <rect x="${GEO.borrachaLaranja.x}" y="${GEO.borrachaLaranja.y}" width="${GEO.borrachaLaranja.w}" height="${GEO.borrachaLaranja.h}" rx="${GEO.borrachaLaranja.rx}" fill="${LARANJA}"/>
      <rect x="${GEO.borrachaFerrolho.x}" y="${GEO.borrachaFerrolho.y}" width="${GEO.borrachaFerrolho.w}" height="${GEO.borrachaFerrolho.h}" rx="${GEO.borrachaFerrolho.rx}" fill="#ffffff" stroke="${AZUL}" stroke-width="9"/>
    </g>

    <!-- cabeça do lápis viajando com o traço -->
    <g class="splash-pencil-head" id="pencilHead">
      <circle cx="0" cy="0" r="30" fill="${LARANJA}"/>
    </g>

    <!-- REDAÇÃO (preto, curvado em arco como na logo) -->
    <text class="splash-redacao" fill="#1a1a1a"
      font-family="Poppins, 'Segoe UI', Arial, sans-serif" font-weight="800" font-size="${GEO.redacaoFont}"
      letter-spacing="${GEO.redacaoSpacing}">
      <textPath href="#redacaoArc" startOffset="0">REDAÇÃO</textPath>
    </text>
    </g>

    <!-- logo oficial (PNG real): revelada na troca disfarçada pelo zoom.
         Posicionada nas coordenadas exatas de onde a arte vive na imagem original
         (bbox 38,233 -> 1232,960), então alinha com o desenho vetorial. -->
    <image id="officialLogo" href="../assets/media/marca/logo-sem-fundo.png"
      x="38" y="233" width="1194" height="727" opacity="0"/>
  </svg>`;

  const splash = document.createElement("div");
  splash.id = "splash";
  splash.innerHTML = svg;
  document.body.appendChild(splash);
  document.body.classList.add("splash-active");

  // Anima o traço sendo desenhado + a cabeça do lápis viajando por cima.
  const outer = splash.querySelector(".splash-trace");
  const inner = splash.querySelector(".splash-trace-inner");
  const head = splash.querySelector("#pencilHead");
  const len = outer.getTotalLength();

  [outer, inner].forEach((p) => {
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
  });

  // Velocidade global da animação. 1.5 = 50% mais rápida.
  const SPEED = 1.5;
  const ms = (v) => v / SPEED;

  const DRAW_START = ms(150);      // ms — o lápis já começa a escrever no início
  const DRAW_DUR = ms(1600);       // ms — duração do desenho do traço
  const LEAD = ms(300) + 300;      // ms — pop/troca começam ANTES do traço terminar
                                   // (0,3s reais a mais de antecipação, fora do SPEED)
  const POP_DUR = ms(420);         // ms — o "vupzinho" (crescidinha) que revela a logo
  const POP_SCALE = 1.06;          // pico do pop
  const HOLD_OFFICIAL = ms(1000);  // ms — logo oficial estática após o pop
  const DRAW_END = DRAW_START + DRAW_DUR;
  const POP_START = DRAW_END - LEAD;
  let rafId;
  let elementosRevelados = false;
  let trocada = false;

  const svgEl = splash.querySelector(".splash-logo");
  const vetor = splash.querySelector("#vectorLogo");
  const oficial = splash.querySelector("#officialLogo");
  const vEl = splash.querySelector(".splash-v");
  const acentoEl = splash.querySelector(".splash-acento");
  const pontaEls = splash.querySelectorAll(".splash-ponta");
  const redacaoEl = splash.querySelector(".splash-redacao");

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function draw(now, t0) {
    const elapsed = now - t0;
    const p = Math.min(Math.max((elapsed - DRAW_START) / DRAW_DUR, 0), 1);
    const drawn = len * easeInOut(p);

    outer.style.strokeDashoffset = len - drawn;
    inner.style.strokeDashoffset = len - drawn;

    if (elapsed >= DRAW_START && p < 1) {
      const pt = outer.getPointAtLength(drawn);
      head.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
      head.style.opacity = "1";
    } else if (p >= 1) {
      head.style.opacity = "0";
    }

    // Um pouco antes do traço terminar (POP_START), revela o V, o acento, a ponta
    // e o REDAÇÃO (fade) — tudo ainda embaçado, enquanto o lápis dá os retoques finais.
    if (elapsed >= POP_START && !elementosRevelados) {
      elementosRevelados = true;
      if (vEl) vEl.style.opacity = "1";
      if (acentoEl) acentoEl.style.opacity = "1";
      pontaEls.forEach((el) => (el.style.opacity = "1"));
      if (redacaoEl) redacaoEl.style.opacity = "1";
    }

    // Vupzinho: um pop de escala rápido, começando ~0,3s antes do traço terminar.
    // A troca vetor -> logo oficial acontece no PICO do pop, disfarçada pela
    // crescidinha e ainda com o lápis em curso.
    if (elapsed >= POP_START) {
      const t = Math.min((elapsed - POP_START) / POP_DUR, 1);
      // curva de pop: sobe até POP_SCALE na metade, volta a 1 no fim
      const pop = 1 + (POP_SCALE - 1) * Math.sin(Math.PI * t);
      svgEl.style.transform = `scale(${pop})`;

      if (t >= 0.5 && !trocada) {
        trocada = true;
        vetor.style.opacity = "0";
        oficial.style.opacity = "1";
      }
    }

    if (elapsed < POP_START + POP_DUR + HOLD_OFFICIAL) {
      rafId = requestAnimationFrame((n) => draw(n, t0));
    } else {
      finish();
    }
  }

  function finish() {
    cancelAnimationFrame(rafId);
    splash.classList.add("hide");
    document.body.classList.remove("splash-active");
    // Avisa a coreografia do hero (js/motion.js) que o lápis terminou.
    window.dispatchEvent(new CustomEvent("vh:splash-done"));
    setTimeout(() => splash.remove(), 530);
  }

  requestAnimationFrame((n) => draw(n, n));
})();
