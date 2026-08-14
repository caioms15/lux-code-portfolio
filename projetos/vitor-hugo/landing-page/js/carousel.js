// Carrossel infinito de aprovados.
// Cada foto em assets/media/aprovados/fotos/ é o miolo do post de destaque do
// @vhredacao (nota + foto do aluno), recortado dos screenshots em cards/ pelo
// script assets/media/aprovados/recortar-cards.ps1. Nome e curso são renderizados
// em HTML (faixa e chip) para que todos os cards sigam o mesmo padrão visual.
// Para adicionar um novo aprovado: salve o screenshot em cards/, rode o script e
// acrescente o aluno aqui.

const APROVADOS = [
  { img: "louise-carolline",     nome: "Louise Carolline",     curso: "Medicina", alt: "Louise Carolline — USP FUVEST & UNICAMP, Medicina" },
  { img: "julio-cesar",          nome: "Júlio César",          curso: "",         alt: "Júlio César — ENEM 2025, nota 960" },
  { img: "lucas-cunha",          nome: "Lucas Cunha",          curso: "",         alt: "Lucas Cunha — ENEM 2025, nota 940" },
  { img: "felipe-paiva",         nome: "Felipe Paiva",         curso: "Medicina", alt: "Felipe Paiva — UFRR nota 25, Medicina" },
  { img: "luiza-venturini",      nome: "Luiza Venturini",      curso: "",         alt: "Luiza Venturini — ENEM 2025, nota 920" },
  { img: "maria-clara-monteiro", nome: "Maria Clara Monteiro", curso: "",         alt: "Maria Clara Monteiro — ENEM 2025, nota 920" },
  { img: "alice-breves",         nome: "Alice Breves",         curso: "",         alt: "Alice Breves — ENEM 2025, nota 920" },
  { img: "luiz-afonso",          nome: "Luiz Afonso",          curso: "",         alt: "Luiz Afonso — ENEM 2025, nota 920" },
  { img: "cecilia-medina",       nome: "Cecília Medina",       curso: "",         alt: "Cecília Medina — ENEM 2025, nota 920" },
  { img: "anna-freitas",         nome: "Anna Freitas",         curso: "",         alt: "Anna Freitas — ENEM 2025, nota 920" },
  { img: "jaime-couto",          nome: "Jaime Couto",          curso: "",         alt: "Jaime Couto — ENEM 2025, nota 920" },
  { img: "clara-ivanir",         nome: "Clara Ivanir",         curso: "",         alt: "Clara Ivanir — ENEM 2025, nota 900" },
  { img: "guilherme-mousse",     nome: "Guilherme Mousse",     curso: "",         alt: "Guilherme Mousse — ENEM 2025, nota 900" },
  { img: "elson-andrade",        nome: "Elson Andrade",        curso: "",         alt: "Elson Andrade — ENEM 2025, nota 900" },
];

const FOTOS_DIR = "../assets/media/aprovados/fotos/";

function criarCard(aluno) {
  const card = document.createElement("figure");
  card.className = "aprovado-card";
  const chip = aluno.curso ? `<span class="aprovado-chip">${aluno.curso}</span>` : "";
  card.innerHTML = `
    <div class="aprovado-foto">
      <img src="${FOTOS_DIR}${aluno.img}.jpg" alt="${aluno.alt}" loading="lazy">
      ${chip}
    </div>
    <figcaption class="aprovado-nome">${aluno.nome}</figcaption>
  `;
  return card;
}

function montarCarrossel() {
  const track = document.getElementById("carouselTrack");
  if (!track) return;

  // Duplica a lista uma vez: a animação CSS translada -50% e reinicia sem salto visível.
  const lista = [...APROVADOS, ...APROVADOS];
  lista.forEach((aluno) => track.appendChild(criarCard(aluno)));
}

montarCarrossel();
