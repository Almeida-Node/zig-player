# Prompts das artes do jogo

Cada item aqui corresponde a uma entrada de `src/content/assets.ts` e a um arquivo em
`public/arte/`. Rode `npm run arte` para ver o que já chegou e o que ainda falta.
Regras gerais em `docs/guia-visual.md`.

## Como a Zig se mexe no jogo

A Zig **não é animada por código**. Ela se mexe só com clipes do Google Flow, como na série:

| Onde | O que toca | Origem |
|---|---|---|
| Pergunta, descoberta e resposta | Os 3 clipes do episódio, em tela cheia, com legenda | Clipes já prontos no Drive |
| Durante os testes | A **bolha da Zig**: janelinha redonda no canto com clipes curtos de reação | Prompts M1–M5 |
| Início e pausa | Imagens paradas da Zig | Prompts Z1–Z4 |
| Rede, ondas, estrela, objetos arrastados, mapa acendendo | Animação do código, em ciano `#22D3EE` | O próprio jogo |

**Regra da pose base (a mesma ideia da regra do último frame):** todos os clipes da bolha
começam e terminam na mesma pose. Assim o jogo emenda "parada → comemora → parada → hum →
parada" sem pular. Por isso a primeira coisa a gerar é a imagem P0.

## Cabeçalho fixo

Cole no início de **todo** prompt, tanto no ChatGPT quanto no Flow. É o mesmo cabeçalho do
`EP04-guia-de-producao.md`, com o cenário do jogo.

> Use a imagem de referência da Professora Zig como elemento fixo. É a MESMA personagem original em todas as imagens: raposa fenaco 3D pequena, pelagem damasco e creme, olhos castanho-âmbar enormes, óculos redondos violetas, orelhas gigantes com circuitos ciano e pontos de luz, colete azul-marinho com estrela dourada, cauda felpuda com DUAS faixas luminosas ciano. Não trocar espécie, proporções, roupa, óculos ou voz. Uma única Zig; nenhum personagem semelhante a franquias conhecidas. Animação 3D familiar original, luz quente de fim de tarde. Sem texto, letras, números ou logotipos na imagem.

---

## ChatGPT: imagens paradas

Use o projeto **"Canal Professora Zig"** e **anexe a imagem de referência da Zig em todo
prompt**. Salve em PNG.

### P0 — Pose base (gerar primeiro)
> [CABEÇALHO FIXO] Plano médio da Zig, da cintura para cima, centralizada e de frente para a câmera, patas relaxadas na frente do colete, sorriso leve, olhando para a câmera. Fundo: laboratório aconchegante da Zig levemente desfocado, luz quente de fim de tarde. Formato quadrado 1:1, 1024×1024. Cabeça e orelhas inteiras dentro do quadro, com folga em cima.

Salve como `zig-pose-base.png`. Não entra no jogo, mas é o quadro inicial (e, se o Flow
permitir, também o final) de todos os clipes M1–M5.

### Z1 — `zig/zig-acenando.png`
> [CABEÇALHO FIXO] Zig de corpo inteiro, de frente, acenando com uma pata e sorrindo, cauda com as duas faixas ciano visível. **Fundo transparente (PNG).** Formato 3:4, 1024×1365.

### Z2 — `zig/zig-comemorando.png`
> [CABEÇALHO FIXO] Zig de corpo inteiro comemorando: as duas patas para cima, olhos felizes, faixas da cauda brilhando. **Fundo transparente (PNG).** Formato 3:4.

### Z3 — `zig/zig-pensando.png`
> [CABEÇALHO FIXO] Zig de corpo inteiro, curiosa, com uma pata no queixo e a cabeça levemente inclinada. **Fundo transparente (PNG).** Formato 3:4.

### Z4 — `zig/zig-hum.png`
> [CABEÇALHO FIXO] Zig de corpo inteiro com expressão gentil de "hum, vamos tentar outro?": sobrancelhas levantadas, sorriso de canto, uma pata aberta. Nada de tristeza ou bronca. **Fundo transparente (PNG).** Formato 3:4.

Se alguma sair com fundo branco, peça no mesmo chat: *"A mesma imagem, idêntica, com fundo transparente."*

### Fase 4 — Por que a tela me escuta?

Anexe também `ep04-clipe1-ultimo-frame.png`, para manter a mesma madeira, as mesmas cores e a mesma luz.

**F4-1 — `fase04/cenario.png`**
> [CABEÇALHO FIXO] Sem a Zig nesta imagem. Vista de cima (top-down) da mesa de madeira clara do laboratório da Zig, a mesma madeira e a mesma luz quente de fim de tarde da imagem anexada. Nas bordas, detalhes aconchegantes do laboratório levemente desfocados. O centro e a parte de cima da mesa ficam vazios, sem tablet e sem lápis (o jogo coloca esses objetos por cima). Formato vertical 9:16, 1080×1920.

**F4-2 — `fase04/tablet.png`**
> Tablet grande visto exatamente de cima, na vertical, tela apagada preto-azulada e vazia, sem reflexos fortes, sem botões ou logotipos visíveis. Borda com espessura uniforme de cerca de 6% da largura. Mesmo estilo 3D e mesma luz quente do cenário anexado. **Fundo transparente (PNG).** Formato 3:4, 1200×1600.

A borda de 6% importa: a rede ciano do jogo é desenhada dentro dessa margem.

**F4-3 — `fase04/objeto-dedo.png`**
> [CABEÇALHO FIXO] Só a pata da Zig, pelagem damasco e creme, com o dedinho indicador esticado apontando para baixo, como quem vai tocar numa tela. Sem o resto do corpo. **Fundo transparente (PNG).** Quadrado 1:1, 768×768.

**F4-4 — `fase04/objeto-lapis.png`**
> O mesmo lápis de madeira da imagem anexada, sozinho, na diagonal, com a ponta de madeira apontada e **sem grafite à mostra**. Estilo 3D do cenário, luz quente. **Fundo transparente (PNG).** Quadrado 1:1, 768×768.

**F4-5 — `fase04/objeto-luva.png`**
> Uma luva de lã infantil, fofa, tricô vermelho-alaranjado com uma faixa creme, sozinha, estilo 3D do cenário, luz quente. **Fundo transparente (PNG).** Quadrado 1:1, 768×768.

**F4-6 — `fase04/objeto-borracha.png`**
> Uma borracha escolar retangular com cantos arredondados, metade rosa e metade azul, sem letras, sozinha, estilo 3D do cenário, luz quente. **Fundo transparente (PNG).** Quadrado 1:1, 768×768.

**F4-7 — `fase04/mapa-cidade.png`**
> Mapa colorido e alegre de uma cidade vista de cima, estilo ilustração 3D suave: ruas claras, quarteirões em tons pastel, praças verdes, um rio azul. **Nenhuma letra, número, nome de rua, ícone ou logotipo.** Sem pontinho de localização (o jogo desenha o pontinho azul). Formato 3:4, 1200×1600.

---

## Google Flow: movimentos da Zig (bolha)

Configuração de sempre: **Vídeo · Gemini Omni Flash · 9:16 · 10 s**, o mesmo Elemento de
personagem e o mesmo Elemento de voz. Em cada clipe, use **P0 como quadro inicial**. Se o Flow
aceitar quadro final, use P0 também como quadro final.

Complemento fixo desses clipes (cole depois do cabeçalho):
> Plano médio fixo, câmera parada, Zig centralizada da cintura para cima, fundo do laboratório levemente desfocado, igual ao quadro inicial. **Sem fala, sem música, sem texto.** O movimento acontece e a Zig volta exatamente à pose do quadro inicial, e segura essa pose até o fim.

| Prompt | Arquivo | Ação |
|---|---|---|
| M1 | `zig/mov-parada.mp4` | A Zig respira devagar, pisca uma vez e as faixas da cauda pulsam de leve. Quase parada, para servir de loop. |
| M2 | `zig/mov-comemora.mp4` | A Zig dá um pulinho feliz com as patas para cima, as faixas da cauda brilham, e ela volta à pose. |
| M3 | `zig/mov-hum.mp4` | A Zig inclina a cabeça com um sorriso gentil de "hum…", balança de leve uma pata aberta, e volta à pose. |
| M4 | `zig/mov-surpresa.mp4` | A Zig arregala os olhos surpresa e encantada, as orelhas se levantam e os circuitos piscam, e ela volta à pose. |
| M5 | `zig/mov-aponta.mp4` | A Zig aponta com a pata para baixo e para a esquerda, para onde a criança vai tocar, e volta à pose. |

**Corte:** o Flow entrega 10 s, e o jogo usa cerca de 3 s (M1: 4 s). Corte do início até a volta à pose base e tire o áudio:

```
ffmpeg -i bruto.mp4 -t 3 -an -vf "scale=720:-2" -c:v libx264 -crf 23 -movflags +faststart zig/mov-comemora.mp4
```

Para o loop M1, confira se o último frame bate com o primeiro. Se não bater, corte no ponto onde a Zig volta à pose.

**Custo:** 5 clipes × 15 créditos = 75 créditos, **uma vez só**. As reações servem para todas as fases.

---

## Falas da Zig (áudio)

A voz é sempre o **mesmo Elemento de voz** do Flow. Existem dois casos:

**1. Falas que já estão nos clipes do Ep 04.** Basta recortar o áudio:

| Arquivo | Texto | De onde recortar |
|---|---|---|
| `fase04/voz-pergunta.mp3` | "Eu toquei aqui e a estrela apareceu! Como a tela sabe onde eu toquei?" | clipe 1 |
| `fase04/voz-rede.mp3` | "Embaixo do vidro tem uma rede que sente a energia do meu toque." | clipe 2, 1ª frase |
| `fase04/voz-lapis.mp3` | "O lápis, ela não sente!" | clipe 2, 2ª frase |
| `fase04/voz-resposta.mp3` | "A rede avisa onde foi o toque, e a tela responde." | clipe 3, 1ª frase |
| `fase04/voz-mapa.mp3` | "Ué… e esse pontinho no mapa?" | clipe 3, 2ª frase |

```
ffmpeg -i ep04-clipe2-descoberta.mp4 -vn -ss 0.4 -to 4.6 -af loudnorm=I=-14:TP=-1 fase04/voz-rede.mp3
```
(Os tempos `-ss`/`-to` saem das pausas da voz, os mesmos usados em `gerar_legendas.py`.)

**2. Falas novas do jogo.** Prompt V no Flow, com P0 como quadro inicial:
> [CABEÇALHO FIXO] Plano médio fixo, Zig centralizada, fundo do laboratório desfocado. Zig fala olhando para a câmera, com carinho: "[FALA]". Uma única fala literal, sem outras falas, sem narrador, sem música.

Depois é só extrair o áudio (`-vn`, com o mesmo `loudnorm`). Dá para pôr **2 ou 3 falas curtas num único clipe de 10 s** e recortar cada uma, o que economiza créditos.

| Arquivo | Fala |
|---|---|
| `comum/voz-comecar.mp3` | "Oi! Eu sou a Professora Zig. Vamos descobrir juntos?" |
| `comum/voz-hum.mp3` | "Hum, não foi dessa vez. Vamos tentar outro?" |
| `comum/voz-estrela.mp3` | "Você descobriu! Ganhou uma estrela de descoberta!" |
| `comum/voz-exploradora.mp3` | "E você testou tudo, até o que não funciona! Ganhou mais uma estrela!" |
| `comum/voz-amanha.mp3` | "Amanhã tem mistério novo. Assista ao episódio de hoje!" |
| `comum/voz-desafio.mp3` | "Agora é com você: chame um adulto e faça o teste de verdade!" |
| `comum/voz-pausa.mp3` | "Que tal uma pausa? Chame um adulto e faça um experimento de verdade!" |
| `comum/voz-trancada.mp3` | "Essa fase abre quando você terminar a anterior!" |
| `comum/voz-em-breve.mp3` | "Essa fase chega junto com o episódio!" |
| `fase04/voz-testar.mp3` | "Vamos testar! Leve cada coisa até a tela, ou toque com o seu dedo." |
| `fase04/voz-leve-estrela.mp3` | "Leve a estrela até as amigas dela lá em cima!" |
| `fase04/voz-desafio.mp3` | "Com um adulto, toque a tela do celular com o dedo e depois com a ponta de madeira de um lápis. O que aconteceu?" |

As falas comuns servem para todas as fases. Cada fase nova precisa só das suas próprias.

---

## Arquivos que já existem no Drive (só copiar)

| Destino em `public/arte/` | Origem no Drive (PROFESSORA-ZIG) |
|---|---|
| `fase04/ep04-clipe1-pergunta.mp4` | `Ep-04-por-que-a-tela-me-escuta/producao-ep04/clipes/` |
| `fase04/ep04-clipe2-descoberta.mp4` | idem |
| `fase04/ep04-clipe3-resposta.mp4` | idem |
| `comum/vinheta-final-zig.mp4` | `_vinheta/vinheta-final-zig.mp4` (o jogo toca sem som: não convida a criança a seguir perfis) |
| `comum/musica-serie.mp3` | a faixa usada na montagem (não está no Drive) |

Antes de copiar os clipes, deixe-os mais leves para o celular:
```
ffmpeg -i ep04-clipe1-pergunta.mp4 -vf "scale=720:-2" -c:v libx264 -crf 24 -c:a aac -b:a 96k -movflags +faststart fase04/ep04-clipe1-pergunta.mp4
```

## Checklist antes de colocar uma arte no jogo

- [ ] Orelhas com circuitos, óculos violetas, colete com estrela, cauda com **2** faixas
- [ ] Mesma luz quente de fim de tarde do episódio
- [ ] Nenhuma letra ou número na imagem
- [ ] PNG com fundo transparente, quando pedido
- [ ] Clipes da bolha começam **e terminam** na pose base
- [ ] `npm run arte` mostra ✅ para o arquivo
