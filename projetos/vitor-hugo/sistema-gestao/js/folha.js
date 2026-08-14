/* ===== Folha de redação + overlay de marcações =====
 * Renderiza a foto da redação (assets/media/sistema/) com as marcações do
 * professor por cima (SVG no viewBox da folha) + balões numerados de comentário.
 * Usado no aluno (redacao.html) e no admin (correcao.html) — a MESMA fonte de
 * dados (DADOS.folha) garante marcações idênticas nas duas telas.
 *
 * @param alvo   elemento onde injetar
 * @param folha  DADOS.folha
 * @param prefix caminho até assets/media/sistema/ (varia por nível de pasta)
 */
function renderFolha(alvo, folha, prefix) {
  const marcasSvg = folha.marcacoes.map((m) => {
    if (m.tipo === "sublinhado") {
      // sublinhado ondulado: quadráticas encadeadas
      const passo = 12, amp = 4;
      let d = `M ${m.x} ${m.y}`;
      for (let x = 0; x < m.largura; x += passo) {
        d += ` q ${passo / 2} ${-amp} ${passo} 0`;
      }
      return `<path d="${d}" fill="none" stroke="var(--laranja)" stroke-width="2.4" stroke-linecap="round"/>`;
    }
    if (m.tipo === "marcatexto") {
      return `<rect x="${m.x}" y="${m.y - m.altura / 2}" width="${m.largura}" height="${m.altura}" rx="4" fill="#f6c445" opacity="0.32"/>`;
    }
    if (m.tipo === "risco") {
      return `<line x1="${m.x1}" y1="${m.y1}" x2="${m.x2}" y2="${m.y2}" stroke="var(--laranja)" stroke-width="3" stroke-linecap="round"/>`;
    }
    return "";
  }).join("");

  const baloes = folha.comentarios.map((c) =>
    `<div class="balao" data-n="${c.n}" style="left:${c.xPct}%;top:${c.yPct}%"
       onmouseenter="realcarComentario(${c.n},true)" onmouseleave="realcarComentario(${c.n},false)">${c.n}</div>`
  ).join("");

  alvo.innerHTML = `
    <div class="folha-wrap" id="folha-wrap">
      <img src="${prefix}${folha.img}" alt="Folha de redação corrigida">
      <svg class="folha-marcas" viewBox="${folha.viewBox}" preserveAspectRatio="none">${marcasSvg}</svg>
      ${baloes}
    </div>`;
}

/* Realce recíproco balão <-> comentário do painel lateral. */
function realcarComentario(n, ligar) {
  document.querySelectorAll('.balao[data-n="' + n + '"]').forEach(el => el.classList.toggle("realce", ligar));
  document.querySelectorAll('.comentario[data-n="' + n + '"]').forEach(el => el.classList.toggle("realce", ligar));
}
