// Literatura — easter eggs descobríveis (ver css/literatura.css).
// Todas as citações abaixo foram verificadas contra fontes primárias
// (Wikisource, dominiopublico.gov.br, edições integrais; para os repertórios
// nota 1000: texto legal em espelhos oficiais MEC/STF, DUDH na tradução
// oficial da ONU, livros conferidos no texto da edição citada) em 20/07/2026 —
// texto e atribuição conferidos palavra por palavra. Não editar de ouvido:
// a internet está cheia de variantes corrompidas (ex.: "só se consegue a
// simplicidade" — o livro diz "só consigo"; "Vês!" — a 1ª edição traz "Vês?!").
// Autores traduzidos (Bauman, Han) entram como paráfrase de conceito
// (parafrase: true — a ficha não usa aspas), nunca como citação literal
// não conferida na edição brasileira.

(function () {
  const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ===== Acervo ===== */

  // Curtas (título da aba + carimbo de cópia)
  const CURTAS = [
    "✎ «Não permita Deus que eu morra, / Sem que eu volte para lá.» — Gonçalves Dias",
    "✎ «Viver é muito perigoso.» — Guimarães Rosa",
    "✎ «No meio do caminho tinha uma pedra.» — Drummond",
    "✎ «Ao vencedor, as batatas!» — Machado de Assis",
    "✎ «Faz escuro mas eu canto / porque a manhã vai chegar.» — Thiago de Mello",
  ];

  // Toast do fim da página (repertório desbloqueado)
  const TOASTS = [
    {
      citacao:
        "O correr da vida embrulha tudo, a vida é assim: esquenta e esfria, aperta e daí afrouxa, sossega e depois desinquieta. O que ela quer da gente é coragem.",
      fonte: "— Guimarães Rosa, Grande Sertão: Veredas (1956)",
      uso: "Use em: resiliência, escolhas e projeto de vida.",
    },
    {
      citacao:
        "Vês?! Ninguém assistiu ao formidável / Enterro de tua última quimera. / Somente a Ingratidão — esta pantera — / Foi tua companheira inseparável!",
      fonte: "— Augusto dos Anjos, Versos Íntimos (Eu, 1912)",
      uso: "Use em: saúde mental e individualismo moderno.",
    },
    {
      citacao:
        "Liberdade — essa palavra que o sonho humano alimenta: que não há ninguém que explique, e ninguém que não entenda!",
      fonte: "— Cecília Meireles, Romanceiro da Inconfidência (1953)",
      uso: "Use em: cidadania, democracia e direitos.",
    },
    {
      citacao:
        "A educação, direito de todos e dever do Estado e da família, será promovida e incentivada com a colaboração da sociedade.",
      fonte: "— Constituição Federal de 1988, Art. 205",
      uso: "Use em: educação, dever do Estado e cidadania.",
    },
    {
      citacao:
        "Todos os seres humanos nascem livres e iguais em dignidade e direitos.",
      fonte: "— Declaração Universal dos Direitos Humanos, Art. 1º (ONU, 1948)",
      uso: "Use em: dignidade humana — serve a quase todo tema social.",
    },
    {
      citacao:
        "Minha provocação sobre adiar o fim do mundo é exatamente sempre poder contar mais uma história.",
      fonte: "— Ailton Krenak, Ideias para Adiar o Fim do Mundo (2019)",
      uso: "Use em: meio ambiente, povos originários e Amazônia.",
    },
    {
      citacao: "A prática antirracista é urgente e se dá nas atitudes mais cotidianas.",
      fonte: "— Djamila Ribeiro, Pequeno Manual Antirracista (2019)",
      uso: "Use em: racismo estrutural e igualdade racial.",
    },
    {
      citacao:
        "O Brasil precisa ser dirigido por uma pessoa que já passou fome. A fome também é professora.",
      fonte: "— Carolina Maria de Jesus, Quarto de Despejo (1960)",
      uso: "Use em: desigualdade social, fome e invisibilidade.",
    },
    {
      parafrase: true,
      citacao:
        "Na modernidade líquida, os vínculos humanos são como líquidos: não conservam a forma — desfazem-se e refazem-se com facilidade.",
      fonte: "— conceito de Zygmunt Bauman, Modernidade Líquida (Zahar, 2001)",
      uso: "Use em: relações virtuais, consumismo e fluidez dos vínculos.",
    },
    {
      parafrase: true,
      citacao:
        "Na sociedade do desempenho, o indivíduo se torna explorador de si mesmo — e o excesso de produtividade desemboca no esgotamento.",
      fonte: "— conceito de Byung-Chul Han, Sociedade do Cansaço (Vozes, 2015)",
      uso: "Use em: saúde mental, burnout e produtividade tóxica.",
    },
  ];

  // Notas ✎ por seção (tema casado ao conteúdo)
  const NOTAS_SECAO = [
    {
      secao: "#metodologia",
      citacao: "Um galo sozinho não tece uma manhã: ele precisará sempre de outros galos.",
      fonte: "— João Cabral de Melo Neto, Tecendo a Manhã (A Educação pela Pedra, 1966)",
      uso: "Use em: cooperação, educação e construção coletiva.",
    },
    {
      secao: "#professor",
      citacao: "Que ninguém se engane, só consigo a simplicidade através de muito trabalho.",
      fonte: "— Clarice Lispector, A Hora da Estrela (1977)",
      uso: "Use em: trabalho, esforço e clareza como conquista.",
    },
    {
      secao: "#matriculas",
      citacao: "O sertanejo é, antes de tudo, um forte.",
      fonte: "— Euclides da Cunha, Os Sertões (1902)",
      uso: "Use em: resiliência e desigualdade regional.",
    },
  ];

  // Estante secreta (clique triplo na logo — colecionável por sessão)
  const ESTANTE = [
    {
      citacao:
        "Cada criatura humana traz duas almas consigo: uma que olha de dentro para fora, outra que olha de fora para dentro.",
      fonte: "— Machado de Assis, O Espelho (Papéis Avulsos, 1882)",
    },
    {
      citacao: "Minha terra tem palmeiras, / Onde canta o Sabiá.",
      fonte: "— Gonçalves Dias, Canção do Exílio (Primeiros Cantos, 1846)",
    },
    {
      citacao: "A vida começa verdadeiramente com a memória.",
      fonte: "— Milton Hatoum, Relato de um Certo Oriente (1989) · romance manauara",
    },
    {
      citacao: "Tupi, or not tupi that is the question.",
      fonte: "— Oswald de Andrade, Manifesto Antropófago (1928)",
    },
    {
      citacao:
        "Alguns dos nossos desejos só se cumprem no outro, os pesadelos pertencem a nós mesmos.",
      fonte: "— Milton Hatoum, Dois Irmãos (2000) · romance manauara",
    },
    {
      citacao: "A praça! A praça é do povo / Como o céu é do condor",
      fonte: "— Castro Alves, O Povo ao Poder (1864)",
    },
    {
      citacao: "Tenho apenas duas mãos e o sentimento do mundo",
      fonte: "— Carlos Drummond de Andrade, Sentimento do Mundo (1940)",
    },
    {
      citacao:
        "A pátria que quisera ter era um mito; era um fantasma criado por ele no silêncio do seu gabinete.",
      fonte: "— Lima Barreto, Triste Fim de Policarpo Quaresma (1911)",
    },
    {
      citacao:
        "Fica decretado que agora vale a verdade, que agora vale a vida, e que de mãos dadas, trabalharemos todos pela vida verdadeira.",
      fonte: "— Thiago de Mello, Os Estatutos do Homem, Art. I (1964) · poeta do Amazonas",
    },
  ];

  // O poeta sob a assinatura do professor (faixa ambiente)
  const XARA = {
    citacao:
      "«Fica decretado que todos os dias da semana, inclusive as terças-feiras mais cinzentas, têm direito a converter-se em manhãs de domingo.»",
    fonte: "— Thiago de Mello, poeta de Barreirinha/AM · Os Estatutos do Homem, Art. II",
  };

  /* ===== Marcador de página na aba (visibilitychange) ===== */

  (function marcadorDeAba() {
    const tituloOriginal = document.title;
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        const i = parseInt(sessionStorage.getItem("vh-aba") || "0", 10);
        document.title = CURTAS[i % CURTAS.length];
        sessionStorage.setItem("vh-aba", String(i + 1));
      } else {
        document.title = tituloOriginal;
      }
    });
  })();

  /* ===== Biblioteca escondida no console ===== */

  (function biblioteca() {
    try {
      const azul = "background:#0f1840;color:#f7f8fc;padding:10px 14px;border-radius:8px;line-height:1.6";
      const laranja = "color:#ff8a4c;font-weight:bold";
      console.log(
        "%c✎ Victor Hugo Redação — %cManaus/AM%c\n\n" +
          "«Ao verme que primeiro roeu as frias carnes do meu cadáver\n" +
          "dedico como saudosa lembrança estas Memórias Póstumas.»\n" +
          "— Machado de Assis, Memórias Póstumas de Brás Cubas (1881)\n\n" +
          "«Oh! Bendito o que semeia / Livros... livros à mão cheia...\n" +
          "E manda o povo pensar!» — Castro Alves, O Livro e a América (1870)\n\n" +
          "Curiosidade é meio caminho para a aprovação — anota esses dois:\n" +
          "cabem em temas de educação, desigualdade e vaidade nas redes.\n" +
          "Matrículas 2026: https://wa.me/5592985189494",
        azul + ";font-size:12px",
        laranja,
        azul + ";font-size:12px"
      );
    } catch (_) {
      /* console indisponível: segue o jogo */
    }
  })();

  /* ===== Marca-texto que carimba a cópia ===== */

  (function carimboDeCopia() {
    document.addEventListener("copy", (e) => {
      const selecao = String(window.getSelection());
      // Só carimba trechos longos: telefone, endereço e nomes seguem intactos.
      if (selecao.length <= 80 || !e.clipboardData) return;
      const i = Math.floor(selecao.length) % CURTAS.length;
      e.clipboardData.setData(
        "text/plain",
        `${selecao}\n\n— copiado de Victor Hugo Redação (@vhredacao)\n${CURTAS[i]}`
      );
      e.preventDefault();
    });
  })();

  /* ===== Ficha de repertório (componente compartilhado) ===== */

  function criarFicha({ titulo, citacao, fonte, uso, classe, parafrase }) {
    const ficha = document.createElement("aside");
    ficha.className = `vh-ficha ${classe || ""}`;
    ficha.setAttribute("role", "status");
    // Paráfrase de conceito (traduções não conferidas verbatim): sem aspas.
    const corpo = parafrase ? citacao : `«${citacao}»`;
    ficha.innerHTML =
      `<div class="vh-ficha-titulo">✎ ${titulo}</div>` +
      `<div class="vh-ficha-citacao">${corpo} <span class="vh-ficha-fonte">${fonte}</span></div>` +
      (uso ? `<div class="vh-ficha-uso">${uso}</div>` : "") +
      '<button class="vh-ficha-fechar" aria-label="Fechar">×</button>';
    return ficha;
  }

  function mostrarFichaTemporaria(opcoes, duracaoMs) {
    const anterior = document.querySelector(".vh-ficha-flutuante");
    if (anterior) anterior.remove();

    const ficha = criarFicha(opcoes);
    ficha.classList.add("vh-ficha-flutuante");
    document.body.appendChild(ficha);

    let timer;
    const fechar = () => {
      clearTimeout(timer);
      ficha.classList.remove("vh-visivel");
      setTimeout(() => ficha.remove(), reduzido ? 0 : 400);
    };
    const armar = (ms) => {
      clearTimeout(timer);
      timer = setTimeout(fechar, ms);
    };

    ficha.querySelector(".vh-ficha-fechar").addEventListener("click", fechar);
    ficha.addEventListener("mouseenter", () => clearTimeout(timer));
    ficha.addEventListener("mouseleave", () => armar(3000));

    requestAnimationFrame(() => ficha.classList.add("vh-visivel"));
    armar(duracaoMs);
    return ficha;
  }

  /* ===== Toast "Repertório desbloqueado" no fim da página ===== */

  (function repertorioNoRodape() {
    const footer = document.querySelector(".footer");
    if (!footer || sessionStorage.getItem("vh-toast-footer")) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          obs.disconnect();
          sessionStorage.setItem("vh-toast-footer", "1");
          const escolha = TOASTS[Math.floor(Math.random() * TOASTS.length)];
          mostrarFichaTemporaria(
            { titulo: "Repertório desbloqueado", classe: "vh-ficha-toast", ...escolha },
            8000
          );
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(footer);
  })();

  /* ===== Notas de lápis ✎ nos cantos das seções ===== */

  (function notasDeSecao() {
    let aberta = null;

    function fechar() {
      if (!aberta) return;
      aberta.popover.remove();
      aberta.botao.setAttribute("aria-expanded", "false");
      aberta = null;
    }

    document.addEventListener("click", (e) => {
      if (aberta && !aberta.popover.contains(e.target) && e.target !== aberta.botao) fechar();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") fechar();
    });

    NOTAS_SECAO.forEach((nota) => {
      const secao = document.querySelector(nota.secao);
      if (!secao) return;

      const botao = document.createElement("button");
      botao.className = "vh-nota-secao";
      botao.setAttribute("aria-label", "Nota de repertório");
      botao.setAttribute("aria-expanded", "false");
      botao.textContent = "✎";
      secao.appendChild(botao);

      botao.addEventListener("click", (e) => {
        e.stopPropagation();
        const estavaAberta = aberta && aberta.botao === botao;
        fechar();
        if (estavaAberta) return;

        const popover = criarFicha({ titulo: "Repertório", ...nota });
        popover.classList.add("vh-nota-popover");
        popover.style.position = "absolute";
        secao.appendChild(popover);
        popover.querySelector(".vh-ficha-fechar").addEventListener("click", fechar);
        botao.setAttribute("aria-expanded", "true");
        aberta = { botao, popover };
      });
    });
  })();

  /* ===== O poeta sob a assinatura (faixa ambiente) ===== */

  (function poetaSobAssinatura() {
    const assinatura = document.querySelector(".ambiente-assinatura");
    const inner = document.querySelector(".ambiente-inner");
    if (!assinatura || !inner) return;

    assinatura.setAttribute("tabindex", "0");
    assinatura.setAttribute("role", "button");
    assinatura.setAttribute("aria-expanded", "false");

    const xara = document.createElement("div");
    xara.className = "vh-xara";
    xara.innerHTML =
      `<div class="vh-xara-inner"><p>${XARA.citacao}` +
      `<span class="vh-xara-fonte">${XARA.fonte}</span></p></div>`;
    inner.appendChild(xara);

    let fixada = false;
    const abrir = () => inner.classList.add("vh-xara-aberta");
    const fecharSeSolta = () => {
      if (!fixada) inner.classList.remove("vh-xara-aberta");
    };
    const sincronizarAria = () =>
      assinatura.setAttribute("aria-expanded", String(inner.classList.contains("vh-xara-aberta")));

    assinatura.addEventListener("mouseenter", () => {
      abrir();
      sincronizarAria();
    });
    assinatura.addEventListener("mouseleave", () => {
      fecharSeSolta();
      sincronizarAria();
    });
    assinatura.addEventListener("focus", () => {
      abrir();
      sincronizarAria();
    });
    assinatura.addEventListener("blur", () => {
      fecharSeSolta();
      sincronizarAria();
    });

    const alternar = () => {
      fixada = !fixada;
      if (fixada) abrir();
      else inner.classList.remove("vh-xara-aberta");
      sincronizarAria();
    };
    assinatura.addEventListener("click", alternar);
    assinatura.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        alternar();
      }
    });
  })();

  /* ===== Estante secreta: clique triplo na logo ===== */

  (function estanteSecreta() {
    const logo = document.querySelector(".header-logo");
    if (!logo) return;

    let cliques = [];
    logo.addEventListener("click", (e) => {
      const agora = Date.now();
      cliques = cliques.filter((t) => agora - t < 1500);
      cliques.push(agora);
      if (cliques.length < 3) return; // 1 ou 2 cliques: navegação normal para #topo

      e.preventDefault();
      cliques = [];
      const i = parseInt(sessionStorage.getItem("vh-estante") || "0", 10);
      const livro = ESTANTE[i % ESTANTE.length];
      sessionStorage.setItem("vh-estante", String(i + 1));
      mostrarFichaTemporaria(
        {
          titulo: `Estante secreta · ${(i % ESTANTE.length) + 1}/${ESTANTE.length}`,
          classe: "vh-ficha-estante",
          ...livro,
        },
        6000
      );
    });
  })();
})();
