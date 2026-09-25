# Guia visual do jogo — fidelidade à Professora Zig

Fonte: pasta **PROFESSORA-ZIG** no Google Drive (`README.md`, `CONTEXTO-ZIG.md`,
`Ep-04-por-que-a-tela-me-escuta/EP04-guia-de-producao.md`). Em caso de dúvida,
vale o que está no Drive.

## Regra de ouro

**O jogo nunca desenha a Zig.** Toda imagem da Zig e dos cenários vem do mesmo
fluxo da série (Google Flow / ChatGPT com a imagem de referência da Zig em
fundo branco). O código só desenha a "camada da descoberta" por cima: rede,
ondas, pontinhos, estrela, sempre em ciano `#22D3EE`.

## A personagem (não mudar nunca)

- Raposa fenaco 3D original, pequena.
- Pelagem damasco e creme, olhos castanho-âmbar enormes.
- Óculos redondos **violetas**.
- Orelhas gigantes com **circuitos ciano** e pontos de luz.
- Colete **azul-marinho** com **estrela dourada**.
- Cauda felpuda com **DUAS faixas** luminosas ciano.
- Voz feminina adulta, calorosa, curiosa e clara: o mesmo Elemento de voz do Flow.
- Uma única Zig por cena. Adultos aparecem só pelas mãos.

## Como cada material do jogo é produzido

| Material | Origem | Formato no jogo |
|---|---|---|
| Zig na pergunta, descoberta e resposta | Os 3 clipes do episódio | `.mp4` 9:16, tela cheia |
| Zig reagindo durante os testes (bolha) | Clipes curtos do Flow que começam e terminam na **pose base** | `.mp4` ~3 s, sem som |
| Zig parada (início, pausa) | ChatGPT (projeto "Canal Professora Zig") com a imagem de referência anexada | `.png` com fundo transparente |
| Cenário da fase | Último frame aprovado do clipe (`epXX-clipeN-ultimo-frame.png`) ou versão sem a Zig gerada a partir dele | `.png`/`.webp` 1080×1920 |
| Objetos para arrastar | ChatGPT, mesmo estilo 3D e mesma luz do cenário | `.png` transparente |
| Falas da Zig | Áudio dos clipes (fala literal do roteiro) e falas extras geradas com o mesmo Elemento de voz | `.mp3` |
| Música | A mesma faixa da série, contínua, 15–20% do volume | `.mp3` |
| Rede, ondas, pontinhos, estrela | Desenhados pelo código | SVG/Canvas, ciano `#22D3EE` |

Enquanto um material não existir, o jogo mostra um **marcador neutro** com o
nome do arquivo esperado, nunca uma Zig improvisada.

## Texto e tela

- Fonte "ZIG": **Montserrat Black** ou **Poppins ExtraBold**, texto branco,
  contorno preto, destaque em ciano `#22D3EE`, no máximo 2 linhas.
- Texto digitado já em MAIÚSCULAS com todos os acentos ("ESTÁ", "NÃO").
- Nenhuma letra ou número dentro de telas de tablet, mapas ou cenários.
- Teaser no fim da fase: `AMANHÃ:` + título do próximo episódio.

## Fase 4 — Por que a tela me escuta? (dados do Ep 04)

- Cenário: laboratório aconchegante da Zig, luz quente de fim de tarde, mesa
  de madeira clara com um tablet grande deitado e um lápis de madeira ao lado.
- Falas literais:
  1. "Eu toquei aqui e a estrela apareceu! Como a tela sabe onde eu toquei?"
  2. "Embaixo do vidro tem uma rede que sente a energia do meu toque. O lápis, ela não sente!"
  3. "A rede avisa onde foi o toque, e a tela responde. Ué… e esse pontinho no mapa?"
- Regra de cena: a rede acende com a pata/dedo e **não** acende com o lápis.
- Final: a estrela se junta a uma constelação e a tela vira um mapa colorido
  de cidade com um pontinho azul piscando.
- Desafio em casa (comentário fixado do post): "Com um adulto, toque a tela do
  celular com o dedo e depois com a ponta de madeira de um lápis. O que aconteceu?"
- Teaser: **AMANHÃ: O MAPA SABE ONDE ESTOU?**

## Checklist de cada tela do jogo

- [ ] A Zig veio de arte oficial (orelhas com circuitos, óculos violetas, colete com estrela, cauda com 2 faixas)
- [ ] Mesmo cenário e mesma luz do episódio
- [ ] Nenhuma letra ou número dentro de telas, mapas ou cenário
- [ ] O conceito aparece na imagem, em ciano, e não só na fala
- [ ] Legendas em MAIÚSCULAS com acentos, na fonte "ZIG"
