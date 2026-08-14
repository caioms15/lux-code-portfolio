/* ============================================================
   BRASA 66 — reprodutor da montagem do hambúrguer
   ------------------------------------------------------------
   Como funciona, em uma frase: o scroll escolhe um índice, o
   índice escolhe um fotograma, o fotograma vai para um canvas.

   Decisões que sustentam a fluidez e a nitidez:

   · nada é interpolado. progresso → índice inteiro → drawImage.
     Sem morphing, sem regeneração, sem quadro sintético;

   · o scroll nativo é normalizado (ScrollTrigger.normalizeScroll).
     A roda do mouse no Windows entrega saltos de ~100 px; sem isso
     o progresso chega em degraus e a animação parece travar mesmo
     rodando a 60 fps;

   · o progresso do scroll não é desenhado direto: alimenta um alvo,
     e um amortecimento exponencial normalizado por delta time
     persegue esse alvo dentro do rAF. Mesma sensação a 60 e 144 Hz,
     e o quadro assenta exatamente onde o dedo parou;

   · um único laço, o do gsap.ticker, que já é um rAF. Nenhum
     setInterval, nenhuma animação CSS concorrente, nenhum segundo
     laço que possa dessincronizar;

   · o canvas nunca é maior que a fonte (704 px). Ampliar a memória
     de pixels além do original só produz borrão e custa banda de
     GPU. Quando o painel é menor, o canvas encolhe junto e a
     redução usa imageSmoothingQuality alto;

   · por quadro só acontecem um drawImage e um transform. Nada de
     width/height/top/left, nada de filter, nada de blend — cada um
     desses forçaria layout ou repintura a cada quadro;

   · medidas em pixel só são lidas em refresh/resize, nunca durante
     a rolagem.
   ============================================================ */
(function () {
  'use strict';

  var CFG = window.BRASA_QUADROS;
  if (!CFG || typeof gsap === 'undefined') return;

  /* ---------- elementos ---------- */
  var secao  = document.querySelector('.hero');
  var fixo   = document.querySelector('.hero__sticky');
  var painel = document.querySelector('.painel');
  var palco  = document.getElementById('palco');
  var tela   = document.getElementById('tela');
  var carga  = document.getElementById('carga');
  var barra  = document.getElementById('bar');
  var dica   = document.getElementById('hint');
  var estado = document.getElementById('estado');
  var texto  = document.getElementById('heroTexto');
  var textos = [].slice.call(document.querySelectorAll('.cap'));
  if (!palco || !tela) return;

  var DIAG = location.search.indexOf('diag') >= 0;
  // congela num ponto para conferência: index.html?p=0.5
  var FORCADO = new URLSearchParams(location.search).get('p');
  var P0 = FORCADO === null ? 0 : Math.max(0, Math.min(1, +FORCADO));
  if (DIAG) {
    window.addEventListener('error', function (e) {
      if (estado) estado.textContent = 'ERRO: ' + e.message + ' @' + e.lineno;
    });
  }

  /* ============================================================
     1. QUALIDADE ADAPTATIVA — qual jogo de quadros baixar
     Escolhido uma única vez, antes de qualquer download: trocar de
     jogo no meio custaria uma segunda carga inteira.
     ============================================================ */
  /* Lado do quadrado realmente desenhado. O palco toma o bloco inteiro, mas
     o object-fit do canvas encaixa um quadrado dentro dele, então quem manda
     é a menor das duas medidas. */
  function ladoCss() {
    return Math.max(1, Math.min(palco.clientWidth, palco.clientHeight));
  }

  /* A conta é em pixels de CSS, não em pixels do aparelho. Num celular de
     dpr 3 nenhum dos dois jogos evita a ampliação, então o que decide é o
     tamanho aparente do painel e o custo de banda e memória — 2,9 MB para
     ocupar 430 px de tela é desperdício. */
  function escolheJogo() {
    var largura = ladoCss() || (painel && painel.clientWidth) || 600;
    var grosso = matchMedia('(pointer: coarse)').matches;

    var modesto =
      (navigator.deviceMemory && navigator.deviceMemory < 4) ||
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      (navigator.connection && navigator.connection.saveData);

    if (modesto || largura < 420 || (grosso && largura < 560)) return CFG.jogos.pequeno;
    return CFG.jogos.grande;
  }
  var JOGO = escolheJogo();

  /* ============================================================
     2. CARREGAMENTO — cada arquivo entra uma única vez
     Um Image por quadro, guardado no vetor e nunca recriado nem
     trocado de src. decode() joga a decodificação para fora da
     thread principal, então nenhum drawImage posterior encontra
     uma imagem ainda comprimida.
     ============================================================ */
  var quadros = new Array(CFG.n);
  var pedidos = new Array(CFG.n);           // memoriza: um pedido por índice, nunca dois
  var prontos = 0;

  function carregaUm(i) {
    if (pedidos[i]) return pedidos[i];
    pedidos[i] = new Promise(function (ok) {
      var img = new Image();
      img.decoding = 'async';
      img.draggable = false;
      var fim = function () {
        if (img.naturalWidth) quadros[i] = img;   // erro de rede não vira quadro vazio
        prontos++;
        if (carga) carga.textContent = Math.round(prontos / CFG.n * 100) + '%';
        ok();
      };
      img.onerror = fim;                    // um quadro faltando não trava a página
      img.src = JOGO.dir + CFG.arquivo(i);
      if (img.decode) img.decode().then(fim, fim);
      else img.onload = fim;
    });
    return pedidos[i];
  }

  function carrega() {
    var fila = [];
    for (var i = 0; i < CFG.n; i++) fila.push(carregaUm(i));
    return Promise.all(fila);
  }

  /* ============================================================
     3. TELA — dimensionamento e desenho
     ============================================================ */
  var g = tela.getContext('2d', { alpha: false });
  var bw = 0, bh = 0;      // memória do canvas, no formato do bloco
  var lado = 0, ox = 0, oy = 0;   // quadrado do quadro, centrado no canvas

  function medir() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var L = palco.clientWidth, A = palco.clientHeight;
    var quadradoCss = Math.max(1, Math.min(L, A));
    // teto na fonte: o quadrado desenhado nunca passa do lado do arquivo,
    // porque ampliar a memória de pixels além dela só borra
    var k = Math.min(dpr, JOGO.lado / quadradoCss);

    var nbw = Math.max(1, Math.round(L * k)), nbh = Math.max(1, Math.round(A * k));
    if (nbw === bw && nbh === bh) return false;

    bw = nbw; bh = nbh;
    lado = Math.round(quadradoCss * k);
    ox = Math.round((bw - lado) / 2);
    oy = Math.round((bh - lado) / 2);
    tela.width = bw;
    tela.height = bh;
    // trocar width zera o estado do contexto: reconfigurar aqui
    g.imageSmoothingEnabled = true;
    g.imageSmoothingQuality = 'high';
    // enquanto a sequência não chega, bege em vez do preto do canvas opaco
    g.fillStyle = '#e8d6b8';
    g.fillRect(0, 0, bw, bh);
    return true;
  }

  /* Se o índice pedido ainda não baixou, usa o mais próximo que já existe.
     Só percorre a vizinhança enquanto a carga está incompleta. */
  function disponivel(i) {
    if (quadros[i]) return i;
    for (var d = 1; d < CFG.n; d++) {
      if (i - d >= 0 && quadros[i - d]) return i - d;
      if (i + d < CFG.n && quadros[i + d]) return i + d;
    }
    return -1;
  }

  /* O bloco quase nunca é quadrado, mas o quadro é. A sobra não é pintada
     pelo CSS: é a borda do próprio quadro esticada para fora. Assim o fundo
     do bloco é, literalmente, o fundo do vídeo — não existe emenda entre um
     degradê inventado e a vinheta da foto, que era o que aparecia antes.
     Custa dois a quatro drawImage a mais, todos de uma linha ou coluna. */
  var iAtual = -1;
  function pinta(i) {
    var j = disponivel(i);
    if (j < 0 || j === iAtual) return;
    iAtual = j;

    var q = quadros[j], F = JOGO.lado;
    g.drawImage(q, ox, oy, lado, lado);

    var abaixo = bh - oy - lado, direita = bw - ox - lado;
    if (oy > 0)      g.drawImage(q, 0, 0,     F, 1, 0,        0,          bw, oy);
    if (abaixo > 0)  g.drawImage(q, 0, F - 1, F, 1, 0,        oy + lado,  bw, abaixo);
    if (ox > 0)      g.drawImage(q, 0,     0, 1, F, 0,        oy,         ox, lado);
    if (direita > 0) g.drawImage(q, F - 1, 0, 1, F, ox + lado, oy,   direita, lado);
  }
  function repinta() {                       // após resize, redesenha o mesmo índice
    var i = iAtual < 0 ? 0 : iAtual;
    iAtual = -1;
    pinta(i);
  }

  /* ============================================================
     4. ACESSÓRIOS — só mudam quando o valor muda
     Escrever no DOM a cada quadro é o jeito mais fácil de perder
     os 60 fps; aqui cada escrita passa por um filtro de mudança.
     ============================================================ */
  var faseAtual = -1;
  function fase(p) {
    var f = p < CFG.fases[0] ? 0 : p < CFG.fases[1] ? 1 : 2;
    if (f === faseAtual) return;
    faseAtual = f;
    for (var i = 0; i < textos.length; i++) textos[i].classList.toggle('is-on', i === f);
    if (estado) estado.textContent = CFG.rotulos[f];
  }

  var barraAnt = -1, opAnt = -1, dicaAnt = null;
  function acessorios(p) {
    var b = Math.round(p * 1000) / 1000;
    if (barra && b !== barraAnt) { barraAnt = b; barra.style.transform = 'scaleX(' + b + ')'; }

    var op = Math.round((1 - Math.max(0, (p - 0.9) / 0.1) * 0.85) * 100) / 100;
    if (texto && op !== opAnt) { opAnt = op; texto.style.opacity = op; }

    var esconde = p > 0.03;
    if (dica && esconde !== dicaAnt) { dicaAnt = esconde; dica.classList.toggle('is-off', esconde); }

    fase(p);
  }

  /* ============================================================
     5. LAÇO — um só, dentro do rAF do gsap.ticker
     ============================================================ */
  var alvo = 0, atual = 0, ativo = false, marca = 0;

  function aplica(p) {
    pinta(Math.round(p * (CFG.n - 1)));
    acessorios(p);
  }

  function passo() {
    if (!ativo && atual === alvo) return;    // parado e fora de cena: custo zero
    var agora = performance.now();
    var dt = marca ? Math.min((agora - marca) / 1000, 0.05) : 1 / 60;
    marca = agora;

    // amortecimento normalizado por delta time: independe da taxa do monitor
    atual += (alvo - atual) * (1 - Math.exp(-dt / CFG.tau));
    if (Math.abs(alvo - atual) < 0.00025) atual = alvo;   // assenta, não oscila

    aplica(atual);
  }

  /* ============================================================
     6. SCROLL
     ============================================================ */
  /* Primeira pintura: acontece assim que o quadro inicial existe, sem esperar
     o resto da sequência. Antes disso o painel ficaria bege vazio por segundos
     mesmo já tendo em mãos a imagem que precisa mostrar. */
  function mostra() {
    if (FORCADO !== null) palco.style.transition = 'none';   // sem fade, para o tiro sair limpo
    medir();
    aplica(P0);
    palco.classList.add('is-pronto');
  }

  /* Ligação com o scroll: só depois que a sequência está completa (ou que o
     prazo estourou), para a rolagem não começar aos saltos. */
  function liga() {
    if (carga) carga.remove();
    if (FORCADO !== null) return;

    // quem pediu menos movimento recebe o hambúrguer aberto e parado
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      aplica(1);
      if (dica) dica.style.display = 'none';
      return;
    }

    /* troca o scroll nativo por sintético. É o que elimina o degrau da
       roda do mouse e o repique elástico do toque — a maior parte da
       sensação de "travando" vinha daí, não da taxa de quadros. */
    ScrollTrigger.normalizeScroll(true);

    /* No celular, esconder e mostrar a barra do navegador muda a altura da
       janela no meio da rolagem. Sem isto o ScrollTrigger recalcula os
       limites nessa hora e a animação dá um salto justo enquanto o dedo
       está na tela — o pior momento possível. */
    ScrollTrigger.config({ ignoreMobileResize: true });

    ScrollTrigger.create({
      trigger: secao,
      start: 'top top',
      end: function () { return '+=' + Math.round(window.innerHeight * CFG.rolagem); },
      pin: fixo,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      // resize entra por aqui: o ScrollTrigger já escuta a janela,
      // então não há um segundo listener nosso para duplicar
      onRefresh: function () { if (medir()) repinta(); },
      onToggle: function (self) { ativo = self.isActive; },
      onUpdate: function (self) { alvo = self.progress; ativo = true; }
    });

    gsap.ticker.add(passo);

    if (DIAG && estado) {
      var st = ScrollTrigger.getAll()[0];
      estado.textContent =
        'jogo=' + JOGO.lado + ' tela=' + lado + ' dpr=' + (window.devicePixelRatio || 1) +
        ' quadros=' + prontos + '/' + CFG.n +
        ' fim=' + Math.round(st.end - st.start) +
        ' palco=' + Math.round(palco.clientWidth);
    }
  }

  /* Arranque: obrigatório é só o quadro que vai aparecer primeiro. Passados
     3,5 s a animação já vale — o que faltar é coberto pelo vizinho mais
     próximo e substituído assim que chega. */
  /* O quadro de abertura vem sozinho, antes do resto: 85 pedidos em paralelo
     brigam por seis conexões e podem deixar justamente ele no fim da fila. */
  gsap.registerPlugin(ScrollTrigger);

  carregaUm(Math.round(P0 * (CFG.n - 1)))
    .then(function () {
      mostra();
      var prazo = new Promise(function (r) { setTimeout(r, 3500); });
      return Promise.race([carrega(), prazo]);
    })
    .then(liga);
})();
