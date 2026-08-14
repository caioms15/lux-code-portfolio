// Galeria "A sala de aula na prática": slider com uma foto por vez, setas,
// bolinhas de navegação e avanço automático. Todas as fotos em
// assets/media/alunos/ são padronizadas na proporção 708:492 (~1,44:1) —
// recortadas preservando as pessoas — e preenchem o viewport por inteiro.
// Para adicionar uma foto: recorte-a nessa mesma proporção, salve em
// assets/media/alunos/ e acrescente { src, alt } ao array abaixo.

const FOTOS_GALERIA = [
  { src: "../assets/media/alunos/sala-de-aula-vista.jpg",  alt: "Sala de aula do Victor Hugo Redação, com vista de Manaus" },
  { src: "../assets/media/alunos/alunos-com-cadernos.jpg", alt: "Alunos com os cadernos do curso em sala de aula" },
  { src: "../assets/media/alunos/alunos-com-bolsas.jpg",   alt: "Alunos comemorando as bolsas conquistadas" },
  { src: "../assets/media/alunos/sala-de-aula-turma.jpeg", alt: "Turma em aula na Cristal Tower" },
];

const AUTOPLAY_MS = 5000;

function montarGaleria() {
  const slides = document.getElementById("galeriaSlides");
  const dots = document.getElementById("galeriaDots");
  const slider = document.getElementById("galeriaSlider");
  if (!slides || !dots || !slider) return;

  let atual = 0;
  let timer = null;

  FOTOS_GALERIA.forEach((foto, i) => {
    const slide = document.createElement("figure");
    slide.className = "galeria-slide";
    // Sem loading="lazy": são poucas fotos e o slide precisa estar pronto
    // quando o autoplay chegar nele.
    slide.innerHTML = `<img class="galeria-slide-foto" src="${foto.src}" alt="${foto.alt}">`;
    slides.appendChild(slide);

    const dot = document.createElement("button");
    dot.className = "galeria-dot";
    dot.setAttribute("aria-label", `Ir para a foto ${i + 1}`);
    dot.addEventListener("click", () => irPara(i));
    dots.appendChild(dot);
  });

  function irPara(indice) {
    atual = (indice + FOTOS_GALERIA.length) % FOTOS_GALERIA.length;
    slides.style.transform = `translateX(-${atual * 100}%)`;
    dots.querySelectorAll(".galeria-dot").forEach((dot, i) => {
      dot.classList.toggle("ativa", i === atual);
    });
    reiniciarAutoplay();
  }

  function reiniciarAutoplay() {
    clearInterval(timer);
    timer = setInterval(() => irPara(atual + 1), AUTOPLAY_MS);
  }

  document.getElementById("galeriaPrev").addEventListener("click", () => irPara(atual - 1));
  document.getElementById("galeriaNext").addEventListener("click", () => irPara(atual + 1));

  // Pausa com o mouse sobre o slider (mesmo espírito do carrossel de aprovados).
  slider.addEventListener("mouseenter", () => clearInterval(timer));
  slider.addEventListener("mouseleave", reiniciarAutoplay);

  // Swipe no celular.
  let toqueX = null;
  slider.addEventListener("touchstart", (e) => { toqueX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener("touchend", (e) => {
    if (toqueX === null) return;
    const delta = e.changedTouches[0].clientX - toqueX;
    if (Math.abs(delta) > 40) irPara(delta < 0 ? atual + 1 : atual - 1);
    toqueX = null;
  }, { passive: true });

  irPara(0);
}

montarGaleria();
