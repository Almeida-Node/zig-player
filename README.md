# Laboratório da Zig

Jogo de descoberta com a **Professora Zig** para crianças de 6 a 9 anos. Cada fase é
um episódio da série: **pergunta → testes → resposta → estrela → desafio em casa**.
Roda no navegador do celular ou tablet, na vertical (9:16), só com toque.

- Ideia do jogo: [`docs/game.md`](docs/game.md)
- Fidelidade à mascote: [`docs/guia-visual.md`](docs/guia-visual.md)
- Prompts das artes, movimentos e falas: [`docs/prompts-artes-jogo.md`](docs/prompts-artes-jogo.md)

## Rodar

```bash
npm install
npm run dev      # abre em http://localhost:5173 (e na rede local, para testar no celular)
npm test         # testes
npm run build    # versão final em dist/
npm run arte     # quais artes oficiais já estão em public/arte/
```

## Estado

| Fase | Episódio | Situação |
|---|---|---|
| 4 | Por que a tela me escuta? | Jogável, com marcadores no lugar das artes |
| 1–3, 5–6 | | "Em breve" (entram com seus episódios) |

## Como funciona

- **A Zig nunca é desenhada pelo código.** Imagens, clipes e voz vêm do mesmo fluxo da
  série (Google Flow e ChatGPT, com a imagem de referência). Enquanto um arquivo não
  existe em `public/arte/`, o jogo mostra um marcador neutro com o nome esperado.
- **Movimentos:** os clipes do episódio aparecem em tela cheia e as reações rápidas
  (comemora, hum, surpresa, aponta) aparecem na "bolha" redonda da Zig. Essas reações
  começam e terminam na mesma pose base. O código anima só a descoberta, em ciano
  `#22D3EE`: rede, ondas, estrela e objetos.
- **Voz:** usa o áudio oficial quando existe. Sem ele, usa a voz do aparelho como
  provisória, sempre com legenda em MAIÚSCULAS no estilo "ZIG".
- **Sem derrota, sem anúncios, sem compras, sem chat, sem coleta de dados.** As estrelas
  ficam salvas só no aparelho (`localStorage`).

## Estrutura

```
src/
  content/   assets.ts (lista de artes), falas.ts, fases.ts
  core/      progresso, voz, arrastar, marcadores de arte
  game/      condutor dos 5 momentos de cada fase
  phases/    uma pasta por fase (regras em logic.ts + cena em index.ts)
  ui/        início, bolha da Zig, legenda
public/arte/ artes oficiais (fora do código)
```

Para criar uma fase nova: copie `src/phases/fase04/`, adicione as artes em
`src/content/assets.ts`, as falas em `src/content/falas.ts` e ligue o `script` em
`src/content/fases.ts`.
