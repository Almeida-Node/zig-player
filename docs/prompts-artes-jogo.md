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

### Fase 1 — Como a IA aprende? (cartões de maçãs e bananas)

Anexe um frame do Ep 01 (laboratório com cartões de frutas e a máquina curiosa).

**F1-1 — `fase01/cenario.png`**
> [CABEÇALHO FIXO] Sem a Zig nesta imagem. Vista de cima da mesa do laboratório aconchegante do Ep 01, madeira clara, luz quente de fim de tarde, alguns cartões de frutas espalhados só nas bordas. O centro fica livre (o jogo coloca máquina, cestos e cartões por cima). Formato vertical 9:16, 1080×1920.

**F1-2 — `fase01/maquina.png`**
> A mesma máquina curiosa do Ep 01, sozinha, de frente, com uma janelinha na frente onde o cartão aparece, expressão curiosa e fofa, sem letras, sem números, sem telas com texto. Estilo 3D da série, luz quente. **Fundo transparente (PNG).** Formato 4:3, 1200×900.

**F1-3 — `fase01/cesto.png`**
> Um cesto raso de madeira clara, vazio, visto um pouco de cima, estilo 3D da série. **Fundo transparente (PNG).** Formato 4:3.

**F1-4 / F1-5 / F1-6 — cartões** (`fase01/cartao-maca.png`, `cartao-banana.png`, `cartao-dificil.png`)
> Cartão retangular de papel creme com cantos arredondados, na vertical, com o desenho simples e fofo de [uma maçã vermelha | uma banana amarela | uma maçã AMARELADA, quase da cor de banana], no mesmo estilo dos cartões do Ep 01. Sem letras nem números. **Fundo transparente (PNG).** Formato 3:4, 600×800.

Os três cartões precisam ter o **mesmo** papel e o **mesmo** estilo. Gere os três no mesmo chat.

### Fase 2 — O robô vê no escuro? (sem lanterna)

A fase segue a **versão corrigida** do `_qualidade/roteiro-ajustes.md`: sem lanterna e com o bloco de madeira como objeto de continuidade. O jogo escurece o quarto sozinho, então o cenário vem **com a luz acesa**.

**F2-1 — `fase02/cenario.png`**
> [CABEÇALHO FIXO] Sem a Zig nesta imagem. Chão do quarto de experiências do Ep 02 visto exatamente de cima, piso de madeira ou tapete macio, luz acesa e quente, alguns móveis só nas bordas. O centro fica vazio. Formato 3:5, 1080×1800.

**F2-2 — `fase02/robo.png`**
> O mesmo robô pequeno do Ep 02, visto exatamente de cima, frente virada para cima da imagem, olhos que brilham de leve, um sensor redondo na frente. Sem letras. **Fundo transparente (PNG).** Quadrado 1:1, 768×768.

**F2-3 — `fase02/bloco.png`**
> Um bloco de madeira de brinquedo visto exatamente de cima, cantos arredondados, madeira clara. **Fundo transparente (PNG).** Quadrado 1:1, 768×768.

**Clipes do Ep 02:** os clipes publicados usam lanterna, o que contradiz a lição. O jogo só usa `fase02/ep02-clipe*.mp4` se forem **refeitos** com as correções do Dia 02 em `roteiro-ajustes.md`. Enquanto isso, o jogo mostra o marcador e a Zig fala as mesmas frases.

### Fase 3 — Quem mora dentro da tela? (lupa e borboleta)

**F3-1 — `fase03/cenario.png`**
> [CABEÇALHO FIXO] Sem a Zig nesta imagem. O laboratório do Ep 03 com a tela grande apagada no centro, vista de frente, luz quente de fim de tarde. A tela fica preta e vazia (o jogo desenha a imagem dentro dela). Formato vertical 9:16, 1080×1920.

**F3-2 — `fase03/borboleta.png`**
> Uma borboleta colorida e alegre, de frente, com áreas grandes de **vermelho forte, verde forte e azul forte** nas asas, em fundo azul-escuro liso. Estilo 3D suave da série. Sem letras. Formato 3:4, 900×1200.

As três cores fortes importam: a criança procura o vermelho, o verde e o azul com a lupa.

**F3-3 — `fase03/lupa.png`**
> A mesma lupa do Ep 03, sozinha, com o vidro redondo no **alto à esquerda** e o cabo descendo para a direita, vidro transparente. **Fundo transparente (PNG).** Quadrado 1:1, 768×768.

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

Nos Ep 01 e Ep 03, recorte da mesma forma:

| Arquivo | Texto | De onde recortar |
|---|---|---|
| `fase01/voz-pergunta.mp3` | "Como a máquina sabe qual fruta apareceu? Vamos ensinar com exemplos!" | clipe 1 do Ep 01 |
| `fase01/voz-descoberta.mp3` | "Mostramos muitos exemplos. Ela procura pistas e também pode errar." | clipe 2 do Ep 01 |
| `fase01/voz-confere.mp3` | "Por isso, uma pessoa confere a resposta." | clipe 3 do Ep 01, 1ª frase |
| `fase01/voz-pista.mp3` | "Qual pista você viu?" | clipe 3 do Ep 01, 2ª frase |
| `fase03/voz-pergunta.mp3` | "Será que a imagem é feita de pontinhos minúsculos?" | clipe 1 do Ep 03 |
| `fase03/voz-pixels.mp3` | "Muitos pontinhos de luz, chamados pixels, formam o que vemos." | clipe 2 do Ep 03 |
| `fase03/voz-resposta.mp3` | "De perto são pontos; de longe, uma borboleta!" | clipe 3 do Ep 03 |

Se o áudio publicado não bater palavra por palavra com o texto, gere a fala de novo no Flow (prompt V abaixo).

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
| `fase01/voz-ensine.mp3` | "Mostre os cartões para a máquina: maçã num cesto, banana no outro!" |
| `fase01/voz-exemplo-errado.mp3` | "Hum… será que esse exemplo ensina certo?" |
| `fase01/voz-vez-maquina.mp3` | "Agora é a vez da máquina. Olha as pistas!" |
| `fase01/voz-acertou.mp3` | "Ela acertou sozinha!" |
| `fase01/voz-aprendeu-errado.mp3` | "Ops! Ela aprendeu com o exemplo errado." |
| `fase01/voz-corrija.mp3` | "Leve o cartão para o cesto certo!" |
| `fase01/voz-desafio.mp3` | "Com um adulto, separe frutas ou brinquedos em dois grupos e peça para alguém adivinhar a sua regra. Qual pista ajudou?" |
| `fase02/voz-pergunta.mp3` | "Está escuro! Como o robô vai perceber o caminho?" |
| `fase02/voz-teste.mp3` | "Vamos testar: o robô vai só com os olhos, ou com o sensor?" |
| `fase02/voz-bateu.mp3` | "Opa! No escuro, os olhos dele não viram o bloco." |
| `fase02/voz-eco.mp3` | "Ele manda um sinal que bate no bloco e volta, igual ao eco do morcego!" |
| `fase02/voz-mova-bloco.mp3` | "Mude o bloco de lugar e teste de novo!" |
| `fase02/voz-resposta.mp3` | "Ele não precisou adivinhar. O sensor ajudou a desviar!" |
| `fase02/voz-leve-robo.mp3` | "Agora leve o robô até a estrela, no escuro!" |
| `fase02/voz-luz.mp3` | "Olha o bloco que ele evitou!" |
| `fase02/voz-desafio.mp3` | "Com um adulto, feche os olhos e procure um brinquedo na mesa só com as mãos, bem devagar. Suas mãos foram o sensor!" |
| `fase03/voz-use-lupa.mp3` | "Pegue a lupa e olhe a tela bem de perto!" |
| `fase03/voz-cores.mp3` | "Olhe outras cores da borboleta!" |
| `fase03/voz-tres-cores.mp3` | "Só vermelho, verde e azul! Juntinhos, fazem todas as cores." |
| `fase03/voz-afaste.mp3` | "Agora afaste a lupa bem devagar." |
| `fase03/voz-desafio.mp3` | "Com um adulto, olhe a tela da TV ou do celular com uma lupa, bem de pertinho. Que cores você viu?" |
| `fase04/voz-testar.mp3` | "Vamos testar! Leve cada coisa até a tela, ou toque com o seu dedo." |
| `fase04/voz-leve-estrela.mp3` | "Leve a estrela até as amigas dela lá em cima!" |
| `fase04/voz-desafio.mp3` | "Com um adulto, toque a tela do celular com o dedo e depois com a ponta de madeira de um lápis. O que aconteceu?" |

As falas comuns servem para todas as fases. Cada fase nova precisa só das suas próprias.

---

## Arquivos que já existem no Drive (só copiar)

| Destino em `public/arte/` | Origem no Drive (PROFESSORA-ZIG) |
|---|---|
| `fase01/ep01-clipe1-pergunta.mp4` | `FOTOS/EPISODIO-01-como a IA aprende/pergunta.mp4` |
| `fase01/ep01-clipe2-descoberta.mp4` | `FOTOS/EPISODIO-01-como a IA aprende/raposa-faz-a-descoberta.mp4` |
| `fase01/ep01-clipe3-resposta.mp4` | `FOTOS/EPISODIO-01-como a IA aprende/raposa-exibe-cartoes-resposta.mp4` |
| `fase02/ep02-clipe{1,2,3}-*.mp4` | **refazer sem lanterna** (ver Fase 2 acima) |
| `fase03/ep03-clipe{1,2,3}-*.mp4` | clipes brutos no computador (`Tik-tok/professora-zig-ep-02/`, segundo o CONTEXTO-ZIG) |
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
