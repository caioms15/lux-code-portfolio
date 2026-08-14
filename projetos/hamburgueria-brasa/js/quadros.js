/* ============================================================
   BRASA 66 — configuração da sequência de quadros
   ------------------------------------------------------------
   A montagem do hambúrguer é uma sequência de fotogramas reais,
   extraídos do vídeo da casa (1280×720, 24 fps) e recortados em
   704×704 no eixo do hambúrguer. Nada é gerado, interpolado ou
   remontado: o quadro exibido é sempre um fotograma inteiro do
   original, escolhido por índice a partir do progresso do scroll.

   Faixa usada: quadros 40 a 124 do vídeo — de "montado" até o
   ponto em que o movimento estabiliza. Antes de 40 e depois de
   124 o hambúrguer fica praticamente parado, o que só gastaria
   rolagem sem entregar movimento.

   O fundo cinza de estúdio foi aquecido para o bege da casa em
   pré-processamento, preservando a vinheta e o reflexo. Por isso
   os quadros são opacos: sem canal alfa, sem recorte, sem franja.
   ============================================================ */
window.BRASA_QUADROS = {
  n: 85,                       // total de quadros da sequência

  /* dois jogos prontos; a escolha é feita em tempo de execução pelo
     tamanho real do painel, pelo devicePixelRatio e pelo aparelho. */
  jogos: {
    grande:  { dir: 'assets/quadros/g/', lado: 704 },
    pequeno: { dir: 'assets/quadros/p/', lado: 384 }
  },

  /* o ffmpeg numera de 001 */
  arquivo: function (i) { return 'q' + String(i + 1).padStart(3, '0') + '.webp'; },

  /* Distância de rolagem do trecho fixo, em alturas de janela.
     É o botão de fluidez: a sequência tem 85 quadros fixos, então o que
     define se o movimento parece contínuo ou em degraus é quantos pixels
     de rolagem cabem entre um quadro e o seguinte.
        2,2 telas ≈ 20 px por quadro
        1,8 telas ≈ 16 px por quadro   ← atual
     Diminuir deixa mais fluido e a animação passa mais rápido; aumentar
     dá mais tempo de leitura e reaparece o degrau. Abaixo de ~1,4 o
     banner acaba antes de o olho acompanhar. */
  rolagem: 1.8,

  /* constante de tempo do amortecimento, em segundos. Quanto menor,
     mais o quadro cola no dedo; quanto maior, mais macio. 0,075 s
     assenta em ~4 quadros a 60 Hz. */
  tau: 0.075,

  /* limites de progresso onde a legenda e o rótulo trocam */
  fases: [0.16, 0.68],
  rotulos: ['montado', 'abrindo', 'aberto']
};
