# Design

Sistema visual da landing page do Victor Hugo Redação, capturado de
`landing-page/css/styles.css` (fonte da verdade). O mockup do sistema de gestão
(`sistema-gestao/css/sistema.css`) copia estes tokens sem importar este CSS.

## Theme

Marca de cursinho pré-vestibular vibrante: azul marinho da logo como cor
institucional dominante, laranja como acento de celebração/CTA. Seções alternam
fundo branco, azul-suave e azul-profundo (com vídeo de Manaus ao fundo no hero e
nas matrículas). Fotos reais grandes carregam a energia; nada de ilustração
vetorial genérica.

## Colors

| Token | Valor | Uso |
|---|---|---|
| `--azul` | `#1e2f73` | Cor primária da marca (logo), títulos com destaque, botões primários |
| `--azul-escuro` | `#16225a` | Hover do primário, gradientes |
| `--azul-profundo` | `#0f1840` | Fundo das seções dark, overlays de vídeo |
| `--azul-claro` | `#3a53b0` | Eyebrow claro, detalhes |
| `--azul-suave` | `#eef1fb` | Fundo da seção galeria |
| `--laranja` | `#e4571e` | Acento: CTA, chips, dot ativa |
| `--laranja-escuro` | `#c4470f` | Hover do acento |
| `#ff8a4c` | — | Acento claro sobre fundos escuros (hero .accent, ícones, assinatura) |
| `--grafite` | `#14192e` | Texto principal em fundo claro |
| `--grafite-suave` | `#2c3350` | Navegação |
| `--cinza-texto` | `#5b6076` | Texto secundário |
| `--branco` / `--off-white` | `#ffffff` / `#f7f8fc` | Fundos claros |
| `--borda` | `#e2e5f0` | Bordas sutis |
| `#25d366` | — | Verde WhatsApp (só no float e ícones WhatsApp) |
| `#b7c6f5` / `#8ea6f0` | — | Eyebrow e spans de título em seções dark |

Estratégia: **committed** — o azul marinho carrega hero, metodologia e matrículas
(mais da metade da página é azul-profundo sobre vídeo); laranja aparece só onde há
ação ou conquista.

## Typography

- Títulos: `--fonte-titulo: "Poppins", "Segoe UI", Arial, sans-serif` — 700, line-height 1.14.
- Corpo: `--fonte-corpo: "Inter", "Segoe UI", Arial, sans-serif` — line-height 1.5.
- **Atenção:** nenhum `@font-face`/link carrega Poppins/Inter hoje; a página cai em
  Segoe UI/Arial. Corrigir quando fizer sentido (self-host ou Google Fonts).
- Escala: hero `clamp(2.4rem, 5vw, 4rem)`; título de seção `clamp(1.8rem, 3vw, 2.6rem)`;
  frase ambiente `clamp(1.5rem, 3vw, 2.2rem)`; subtítulo `1.05rem`; corpo ~`0.95rem`.
- Eyebrow: 0.8rem, 600, uppercase, tracking 0.12em — padrão existente em toda seção
  (identidade herdada; não expandir para novos usos).

## Components

- **Botões**: pílula (`border-radius: 999px`), Poppins 600, três variantes —
  `btn-accent` (laranja, sombra colorida), `btn-primary` (azul), `btn-secondary` /
  `btn-outline-light` (contorno). Hover: `translateY(-2px)` + escurece.
- **Cards de aprovado**: 268px, foto janela 301:233 + chip laranja uppercase + faixa
  de nome em gradiente azul. Hover levanta (`translateY(-6px)` + sombra forte).
- **Carrossel infinito**: track duplicado, `animation: scroll-left 60s linear`,
  máscara de fade nas bordas, pausa no hover.
- **Galeria**: slider 708:492, setas circulares brancas, dots (ativa = laranja
  alongada), autoplay 5s, swipe.
- **Metodologia**: cards translúcidos (`rgba(255,255,255,0.05)` + borda 0.1) sobre
  azul-profundo, ícones stroke laranja/azul-claro alternados.
- **Moldura do professor**: arco (`border-radius: 999px 999px 0 0`) com borda
  tracejada laranja interna — assinatura visual do hero.
- **WhatsApp float**: 58px, verde WhatsApp, canto inferior direito, z-index 90.

## Spacing & Layout

- Container: `1180px`, padding lateral 24px.
- Ritmo de seção: `padding: 100px 0` (ambiente 110px, footer 44px).
- Radius: `--radius: 14px` (cards), 24px (molduras de foto), 999px (pílulas).
- Sombras: `--sombra` (suave) e `--sombra-forte` (flutuação); sombras coloridas nos
  botões (`rgba` da própria cor).
- Grids assimétricos deliberados: hero `1.15fr/0.85fr`, professor `0.85fr/1.15fr`,
  matrículas `1.1fr/0.9fr`.
- Breakpoints: 900px (grids → 1 coluna), 768px (menu mobile, esconde foto do hero).

## Motion

- Existente: splash de abertura (lápis desenha a logo em SVG, pop e troca pela logo
  oficial — `js/splash.js`, geometria sincronizada via `dev/sync-logo.mjs`, nunca
  editar o bloco GEO à mão; `?nosplash` pula); contadores easeOutCubic no hero;
  carrossel linear infinito; hovers com translate/scale curtos (0.15–0.2s ease).
- Regra da spec: animações sutis e propositais — **sem** fade-in uniforme por seção,
  sem parallax gratuito, sem bounce.
- Toda animação nova precisa de alternativa `prefers-reduced-motion`.

## Assets & Media

- Logo: `assets/media/marca/logo-sem-fundo.png` (também favicon); versão animada
  editável em `assets/media/marca/logo-animada.svg`.
- Vídeos de fundo: `assets/media/video/manaus-hero.mp4` (Teatro Amazonas) e
  `manaus-noite.mp4` (loop restrito 5s–10.3s via `data-loop-inicio/fim`).
- Fotos: professor (`assets/media/professor/`), aprovados
  (`assets/media/aprovados/fotos/`, recortadas por `recortar-cards.ps1`), turmas
  (`assets/media/alunos/`, proporção 708:492).
