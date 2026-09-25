import type { AssetId } from "./assets";

export interface Line {
  /** Texto falado (e legenda, que o jogo passa para MAIÚSCULAS). */
  text: string;
  /** Palavra da legenda destacada em ciano, como nas legendas "ZIG". */
  highlight?: string;
  /** Áudio gravado com a voz da Zig. Sem ele, usamos a voz do aparelho. */
  audio?: AssetId;
}

export const FALAS = {
  comecar: { text: "Oi! Eu sou a Professora Zig. Vamos descobrir juntos?", highlight: "descobrir", audio: "voz-comecar" },
  hum: { text: "Hum, não foi dessa vez. Vamos tentar outro?", highlight: "tentar", audio: "voz-hum" },
  estrela: { text: "Você descobriu! Ganhou uma estrela de descoberta!", highlight: "estrela", audio: "voz-estrela" },
  exploradora: {
    text: "E você testou tudo, até o que não funciona! Ganhou mais uma estrela!",
    highlight: "testou",
    audio: "voz-exploradora",
  },
  amanha: { text: "Amanhã tem mistério novo. Assista ao episódio de hoje!", highlight: "Amanhã", audio: "voz-amanha" },
  desafio: { text: "Agora é com você: chame um adulto e faça o teste de verdade!", highlight: "adulto", audio: "voz-desafio" },
  pausa: {
    text: "Que tal uma pausa? Chame um adulto e faça um experimento de verdade!",
    highlight: "pausa",
    audio: "voz-pausa",
  },
  trancada: { text: "Essa fase abre quando você terminar a anterior!", highlight: "anterior", audio: "voz-trancada" },
  emBreve: { text: "Essa fase chega junto com o episódio!", highlight: "episódio", audio: "voz-em-breve" },

  // Fase 4 — falas literais do Ep 04 (EP04-guia-de-producao.md)
  f4Pergunta: {
    text: "Eu toquei aqui e a estrela apareceu! Como a tela sabe onde eu toquei?",
    highlight: "tela",
    audio: "f4-voz-pergunta",
  },
  f4Testar: {
    text: "Vamos testar! Leve cada coisa até a tela, ou toque com o seu dedo.",
    highlight: "testar",
    audio: "f4-voz-testar",
  },
  f4Rede: {
    text: "Embaixo do vidro tem uma rede que sente a energia do meu toque.",
    highlight: "rede",
    audio: "f4-voz-rede",
  },
  f4Lapis: { text: "O lápis, ela não sente!", highlight: "lápis", audio: "f4-voz-lapis" },
  f4Resposta: {
    text: "A rede avisa onde foi o toque, e a tela responde.",
    highlight: "rede",
    audio: "f4-voz-resposta",
  },
  f4LeveEstrela: {
    text: "Leve a estrela até as amigas dela lá em cima!",
    highlight: "estrela",
    audio: "f4-voz-leve-estrela",
  },
  f4Mapa: { text: "Ué… e esse pontinho no mapa?", highlight: "mapa", audio: "f4-voz-mapa" },
  // Legendas dos clipes (o áudio já está no próprio clipe)
  f4Clipe2: {
    text: "Embaixo do vidro tem uma rede que sente a energia do meu toque. O lápis, ela não sente!",
    highlight: "rede",
  },
  f4Clipe3: {
    text: "A rede avisa onde foi o toque, e a tela responde. Ué… e esse pontinho no mapa?",
    highlight: "responde",
  },
  f4Desafio: {
    text: "Com um adulto, toque a tela do celular com o dedo e depois com a ponta de madeira de um lápis. O que aconteceu?",
    highlight: "lápis",
    audio: "f4-voz-desafio",
  },
} as const satisfies Record<string, Line>;
