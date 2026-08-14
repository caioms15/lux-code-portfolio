# Editando a logo da animação manualmente

A geometria da logo animada do splash vive em um arquivo SVG editável:

```
assets/media/marca/logo-animada.svg
```

## Fluxo de edição

1. **Abra o SVG** no Inkscape (grátis), Illustrator, Figma (importar) — ou até num
   editor de texto (as coordenadas são legíveis).
2. A camada `referencia` mostra a **logo oficial a 35% de opacidade** por baixo do
   desenho — use como guia para alinhar. Pode ocultar/apagar; o sync ignora ela.
3. Edite os nós/curvas do que quiser ajustar.
4. **Não renomeie os `id=`** dos elementos (`trace`, `v`, `acento`, `ponta-cone`,
   `ponta-seta`, `borracha-*`, `redacaoArc`, `redacao`) — o sync mapeia por eles.
5. Rode na raiz do projeto:

   ```
   node landing-page/dev/sync-logo.mjs
   ```

6. Abra `landing-page/index.html` e veja a animação com a nova geometria.

## O que o sync sincroniza

| No SVG                  | Vai para                                  |
|-------------------------|-------------------------------------------|
| `#trace` (d + stroke-width) | caminho que o lápis desenha + espessura |
| `#trace-inner` (stroke-width) | espessura do miolo branco (o caminho é sempre o do `#trace`) |
| `#v`, `#acento`         | o V e o acento agudo                      |
| `#ponta-cone`, `#ponta-seta` | a ponta do lápis                     |
| `#borracha-halo/risco/laranja/ferrolho` | a borracha            |
| `#redacaoArc` (d)       | o arco por onde o texto REDAÇÃO corre     |
| `#redacao` (font-size, letter-spacing) | tamanho/espaçamento do texto |

**Cores e fonte NÃO são sincronizadas** — se mudar cores no SVG, ajuste também em
`landing-page/js/splash.js` (constantes `AZUL`/`LARANJA`) e
`landing-page/css/splash.css`, ou peça para o Claude.

## Dicas

- O `#trace` é o caminho que a animação "escreve" — mantenha ele como um caminho
  único e contínuo (sem sub-caminhos `M` no meio), senão o lápis "teleporta".
- O início do traço deve ficar sob o ferrolho da borracha, e o fim dentro do cone
  da ponta.
- Se o Inkscape converter o path para coordenadas relativas (letras minúsculas),
  não tem problema — o navegador entende dos dois jeitos.
