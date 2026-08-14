// Sincroniza a geometria de assets/media/marca/logo-animada.svg para o bloco
// GEO de landing-page/js/splash.js.
//
// Uso (na raiz do projeto):  node landing-page/dev/sync-logo.mjs
//
// O que é sincronizado (por id no SVG):
//   #trace            -> GEO.trace (o d) + GEO.traceWidth (stroke-width)
//   #trace-inner      -> GEO.innerWidth (stroke-width; o d vem sempre do #trace)
//   #v, #acento       -> GEO.v, GEO.acento
//   #ponta-cone       -> GEO.pontaCone
//   #ponta-seta       -> GEO.pontaSeta
//   #borracha-*       -> GEO.borracha* (x/y/width/height/rx dos rects)
//   #redacaoArc       -> GEO.redacaoArc
//   #redacao          -> GEO.redacaoFont, GEO.redacaoSpacing
//
// Cores e fontes NÃO são sincronizadas (ficam no splash.js/CSS) — se mudar
// cores no SVG, replique manualmente ou peça para o Claude.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const svgPath = join(root, "assets", "media", "marca", "logo-animada.svg");
const jsPath = join(root, "landing-page", "js", "splash.js");

const svg = readFileSync(svgPath, "utf8");
const js = readFileSync(jsPath, "utf8");

// Acha a tag completa (aceita atributos em qualquer ordem, estilo Inkscape).
function tagById(id) {
  const re = new RegExp(`<[a-zA-Z]+[^>]*\\bid=["']${id}["'][^>]*>`, "s");
  const m = svg.match(re);
  if (!m) throw new Error(`Elemento com id="${id}" não encontrado no SVG.`);
  return m[0];
}

function attr(tag, name) {
  // atributo direto
  let m = tag.match(new RegExp(`\\b${name}=["']([^"']+)["']`));
  if (m) return m[1];
  // dentro de style="..."
  m = tag.match(/\bstyle=["']([^"']+)["']/);
  if (m) {
    const s = m[1].match(new RegExp(`(?:^|;)\\s*${name}\\s*:\\s*([^;]+)`));
    if (s) return s[1].trim();
  }
  return null;
}

function need(tag, name, id) {
  const v = attr(tag, name);
  if (v === null) throw new Error(`Atributo "${name}" não encontrado em #${id}.`);
  return v;
}

const num = (v) => String(parseFloat(v));

const trace = tagById("trace");
const inner = tagById("trace-inner");
const v = tagById("v");
const acento = tagById("acento");
const cone = tagById("ponta-cone");
const seta = tagById("ponta-seta");
const halo = tagById("borracha-halo");
const laranja = tagById("borracha-laranja");
const ferrolho = tagById("borracha-ferrolho");
const arc = tagById("redacaoArc");
const redacao = tagById("redacao");

const rect = (tag, id) => ({
  x: num(need(tag, "x", id)),
  y: num(need(tag, "y", id)),
  w: num(need(tag, "width", id)),
  h: num(need(tag, "height", id)),
  rx: num(attr(tag, "rx") ?? "0"),
});

const b1 = rect(halo, "borracha-halo");
const b2 = rect(laranja, "borracha-laranja");
const b3 = rect(ferrolho, "borracha-ferrolho");

const geo = `/* GEO:INICIO (gerado por sync-logo.mjs — não editar manualmente) */
  const GEO = {
    trace: ${JSON.stringify(need(trace, "d", "trace"))},
    traceWidth: ${num(attr(trace, "stroke-width") ?? "85")},
    innerWidth: ${num(attr(inner, "stroke-width") ?? "14")},
    v: ${JSON.stringify(need(v, "d", "v"))},
    acento: ${JSON.stringify(need(acento, "d", "acento"))},
    pontaCone: ${JSON.stringify(need(cone, "d", "ponta-cone"))},
    pontaSeta: ${JSON.stringify(need(seta, "d", "ponta-seta"))},
    borrachaHalo: { x: ${b1.x}, y: ${b1.y}, w: ${b1.w}, h: ${b1.h}, rx: ${b1.rx} },
    borrachaLaranja: { x: ${b2.x}, y: ${b2.y}, w: ${b2.w}, h: ${b2.h}, rx: ${b2.rx} },
    borrachaFerrolho: { x: ${b3.x}, y: ${b3.y}, w: ${b3.w}, h: ${b3.h}, rx: ${b3.rx} },
    redacaoArc: ${JSON.stringify(need(arc, "d", "redacaoArc"))},
    redacaoFont: ${num(attr(redacao, "font-size") ?? "88")},
    redacaoSpacing: ${num(attr(redacao, "letter-spacing") ?? "4")}
  };
  /* GEO:FIM */`;

if (!/\/\* GEO:INICIO[\s\S]*?GEO:FIM \*\//.test(js)) {
  throw new Error("Bloco GEO não encontrado em splash.js.");
}
const out = js.replace(/\/\* GEO:INICIO[\s\S]*?GEO:FIM \*\//, geo);
writeFileSync(jsPath, out);
console.log("OK — geometria sincronizada do SVG para splash.js.");
console.log("Abra landing-page/index.html para ver a animação atualizada.");
