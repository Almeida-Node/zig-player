// Lista de todo material oficial que o jogo usa. Os arquivos ficam em
// public/arte/<file>. Enquanto um arquivo não existe, o jogo mostra um
// marcador neutro com este nome: nunca uma Zig improvisada.
// Os prompts para gerar cada item estão em docs/prompts-artes-jogo.md.

export type AssetKind = "image" | "video" | "audio";

export interface AssetSpec {
  kind: AssetKind;
  file: string;
  /** O que a arte mostra, para quem for produzir. */
  what: string;
  /** De onde vem: prompt (docs/prompts-artes-jogo.md) ou arquivo do Drive. */
  source: string;
}

export const ASSETS = {
  // Zig (sempre da imagem de referência oficial)
  "zig-acenando": {
    kind: "image",
    file: "zig/zig-acenando.png",
    what: "Zig de corpo inteiro acenando, fundo transparente",
    source: "Prompt Z1",
  },
  "zig-comemorando": {
    kind: "image",
    file: "zig/zig-comemorando.png",
    what: "Zig comemorando, fundo transparente",
    source: "Prompt Z2",
  },
  "zig-pensando": {
    kind: "image",
    file: "zig/zig-pensando.png",
    what: "Zig curiosa, pata no queixo, fundo transparente",
    source: "Prompt Z3",
  },
  "zig-hum": {
    kind: "image",
    file: "zig/zig-hum.png",
    what: "Zig com cara de \"hum, vamos tentar outro?\", fundo transparente",
    source: "Prompt Z4",
  },

  // Movimentos da Zig: clipes curtos do Flow, mostrados na "bolha" redonda.
  // Todos começam e terminam na mesma POSE BASE para emendar sem pulo.
  "zig-mov-parada": {
    kind: "video",
    file: "zig/mov-parada.mp4",
    what: "Zig na pose base respirando e piscando, loop de 4 s",
    source: "Prompt M1 (Flow)",
  },
  "zig-mov-comemora": {
    kind: "video",
    file: "zig/mov-comemora.mp4",
    what: "Zig comemora e volta à pose base, 3 s",
    source: "Prompt M2 (Flow)",
  },
  "zig-mov-hum": {
    kind: "video",
    file: "zig/mov-hum.mp4",
    what: "Zig inclina a cabeça, \"hum\", e volta à pose base, 3 s",
    source: "Prompt M3 (Flow)",
  },
  "zig-mov-surpresa": {
    kind: "video",
    file: "zig/mov-surpresa.mp4",
    what: "Zig arregala os olhos, surpresa, e volta à pose base, 3 s",
    source: "Prompt M4 (Flow)",
  },
  "zig-mov-aponta": {
    kind: "video",
    file: "zig/mov-aponta.mp4",
    what: "Zig aponta para baixo (para a tela) e volta à pose base, 3 s",
    source: "Prompt M5 (Flow)",
  },

  // Comuns a todas as fases
  vinheta: {
    kind: "video",
    file: "comum/vinheta-final-zig.mp4",
    what: "Vinheta final de 4 s da série",
    source: "Drive: PROFESSORA-ZIG/_vinheta/vinheta-final-zig.mp4",
  },
  musica: {
    kind: "audio",
    file: "comum/musica-serie.mp3",
    what: "Faixa musical da série, em loop",
    source: "Mesma faixa usada na montagem dos episódios",
  },

  // Fase 4 — Por que a tela me escuta?
  "f4-cenario": {
    kind: "image",
    file: "fase04/cenario.png",
    what: "Laboratório da Zig no fim de tarde, mesa de madeira clara, SEM a Zig e SEM o tablet",
    source: "Prompt F4-1 (a partir de ep04-clipe1-ultimo-frame.png)",
  },
  "f4-tablet": {
    kind: "image",
    file: "fase04/tablet.png",
    what: "Tablet visto de cima, tela apagada e vazia, fundo transparente",
    source: "Prompt F4-2",
  },
  "f4-dedo": {
    kind: "image",
    file: "fase04/objeto-dedo.png",
    what: "Pata da Zig apontando com o dedinho, fundo transparente",
    source: "Prompt F4-3",
  },
  "f4-lapis": {
    kind: "image",
    file: "fase04/objeto-lapis.png",
    what: "Lápis de madeira da cena, ponta de madeira sem grafite à mostra, fundo transparente",
    source: "Prompt F4-4",
  },
  "f4-luva": {
    kind: "image",
    file: "fase04/objeto-luva.png",
    what: "Luva de lã, fundo transparente",
    source: "Prompt F4-5",
  },
  "f4-borracha": {
    kind: "image",
    file: "fase04/objeto-borracha.png",
    what: "Borracha escolar, fundo transparente",
    source: "Prompt F4-6",
  },
  "f4-mapa": {
    kind: "image",
    file: "fase04/mapa-cidade.png",
    what: "Mapa colorido de cidade visto de cima, sem letras nem números, formato 3:4",
    source: "Prompt F4-7",
  },
  "f4-clipe-pergunta": {
    kind: "video",
    file: "fase04/ep04-clipe1-pergunta.mp4",
    what: "Clipe 1 do Ep 04",
    source: "Drive: Ep-04-por-que-a-tela-me-escuta/producao-ep04/clipes/",
  },
  "f4-clipe-descoberta": {
    kind: "video",
    file: "fase04/ep04-clipe2-descoberta.mp4",
    what: "Clipe 2 do Ep 04",
    source: "Drive: Ep-04-por-que-a-tela-me-escuta/producao-ep04/clipes/",
  },
  "f4-clipe-resposta": {
    kind: "video",
    file: "fase04/ep04-clipe3-resposta.mp4",
    what: "Clipe 3 do Ep 04",
    source: "Drive: Ep-04-por-que-a-tela-me-escuta/producao-ep04/clipes/",
  },

  // Falas (mesmo Elemento de voz do Flow). Veja src/content/falas.ts.
  "voz-comecar": { kind: "audio", file: "comum/voz-comecar.mp3", what: "Fala: começar", source: "Prompt V (Flow)" },
  "voz-hum": { kind: "audio", file: "comum/voz-hum.mp3", what: "Fala: não foi dessa vez", source: "Prompt V (Flow)" },
  "voz-estrela": { kind: "audio", file: "comum/voz-estrela.mp3", what: "Fala: estrela de descoberta", source: "Prompt V (Flow)" },
  "voz-exploradora": { kind: "audio", file: "comum/voz-exploradora.mp3", what: "Fala: estrela extra", source: "Prompt V (Flow)" },
  "voz-amanha": { kind: "audio", file: "comum/voz-amanha.mp3", what: "Fala: convite para o episódio", source: "Prompt V (Flow)" },
  "voz-desafio": { kind: "audio", file: "comum/voz-desafio.mp3", what: "Fala: desafio em casa", source: "Prompt V (Flow)" },
  "voz-pausa": { kind: "audio", file: "comum/voz-pausa.mp3", what: "Fala: pausa depois de 3 fases", source: "Prompt V (Flow)" },
  "voz-trancada": { kind: "audio", file: "comum/voz-trancada.mp3", what: "Fala: fase trancada", source: "Prompt V (Flow)" },
  "voz-em-breve": { kind: "audio", file: "comum/voz-em-breve.mp3", what: "Fala: fase em breve", source: "Prompt V (Flow)" },
  "f4-voz-pergunta": { kind: "audio", file: "fase04/voz-pergunta.mp3", what: "Fala 1 do Ep 04", source: "Áudio do clipe 1 do Ep 04" },
  "f4-voz-testar": { kind: "audio", file: "fase04/voz-testar.mp3", what: "Fala: vamos testar", source: "Prompt V (Flow)" },
  "f4-voz-rede": { kind: "audio", file: "fase04/voz-rede.mp3", what: "Fala 2 do Ep 04, primeira parte", source: "Áudio do clipe 2 do Ep 04" },
  "f4-voz-lapis": { kind: "audio", file: "fase04/voz-lapis.mp3", what: "Fala 2 do Ep 04, segunda parte", source: "Áudio do clipe 2 do Ep 04" },
  "f4-voz-resposta": { kind: "audio", file: "fase04/voz-resposta.mp3", what: "Fala 3 do Ep 04, primeira parte", source: "Áudio do clipe 3 do Ep 04" },
  "f4-voz-leve-estrela": { kind: "audio", file: "fase04/voz-leve-estrela.mp3", what: "Fala: leve a estrela", source: "Prompt V (Flow)" },
  "f4-voz-desafio": { kind: "audio", file: "fase04/voz-desafio.mp3", what: "Fala: desafio em casa do Ep 04", source: "Comentário fixado do post do Ep 04 (Prompt V)" },
  "f4-voz-mapa": { kind: "audio", file: "fase04/voz-mapa.mp3", what: "Fala 3 do Ep 04, segunda parte", source: "Áudio do clipe 3 do Ep 04" },
} as const satisfies Record<string, AssetSpec>;

export type AssetId = keyof typeof ASSETS;
