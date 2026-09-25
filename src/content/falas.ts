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

  // Fase 1 — falas literais do Ep 01 (roteiro mestre, Dia 01)
  f1Pergunta: {
    text: "Como a máquina sabe qual fruta apareceu? Vamos ensinar com exemplos!",
    highlight: "exemplos",
    audio: "f1-voz-pergunta",
  },
  f1Ensine: {
    text: "Mostre os cartões para a máquina: maçã num cesto, banana no outro!",
    highlight: "cartões",
    audio: "f1-voz-ensine",
  },
  f1ExemploErrado: { text: "Hum… será que esse exemplo ensina certo?", highlight: "exemplo", audio: "f1-voz-exemplo-errado" },
  f1VezMaquina: { text: "Agora é a vez da máquina. Olha as pistas!", highlight: "pistas", audio: "f1-voz-vez-maquina" },
  f1Acertou: { text: "Ela acertou sozinha!", highlight: "sozinha", audio: "f1-voz-acertou" },
  f1AprendeuErrado: {
    text: "Ops! Ela aprendeu com o exemplo errado.",
    highlight: "errado",
    audio: "f1-voz-aprendeu-errado",
  },
  f1Descoberta: {
    text: "Mostramos muitos exemplos. Ela procura pistas e também pode errar.",
    highlight: "exemplos",
    audio: "f1-voz-descoberta",
  },
  f1Confere: { text: "Por isso, uma pessoa confere a resposta.", highlight: "confere", audio: "f1-voz-confere" },
  f1Corrija: { text: "Leve o cartão para o cesto certo!", highlight: "certo", audio: "f1-voz-corrija" },
  f1Pista: { text: "Qual pista você viu?", highlight: "pista", audio: "f1-voz-pista" },
  f1Desafio: {
    text: "Com um adulto, separe frutas ou brinquedos em dois grupos e peça para alguém adivinhar a sua regra. Qual pista ajudou?",
    highlight: "pista",
    audio: "f1-voz-desafio",
  },

  // Fase 2 — O robô vê no escuro? (versão corrigida em roteiro-ajustes.md: eco, sem lanterna)
  f2Pergunta: { text: "Está escuro! Como o robô vai perceber o caminho?", highlight: "escuro", audio: "f2-voz-pergunta" },
  f2Teste: {
    text: "Vamos testar: o robô vai só com os olhos, ou com o sensor?",
    highlight: "sensor",
    audio: "f2-voz-teste",
  },
  f2Bateu: { text: "Opa! No escuro, os olhos dele não viram o bloco.", highlight: "bloco", audio: "f2-voz-bateu" },
  f2Eco: {
    text: "Ele manda um sinal que bate no bloco e volta, igual ao eco do morcego!",
    highlight: "eco",
    audio: "f2-voz-eco",
  },
  f2MovaBloco: { text: "Mude o bloco de lugar e teste de novo!", highlight: "bloco", audio: "f2-voz-mova-bloco" },
  f2Resposta: {
    text: "Ele não precisou adivinhar. O sensor ajudou a desviar!",
    highlight: "sensor",
    audio: "f2-voz-resposta",
  },
  f2LeveRobo: { text: "Agora leve o robô até a estrela, no escuro!", highlight: "estrela", audio: "f2-voz-leve-robo" },
  f2Luz: { text: "Olha o bloco que ele evitou!", highlight: "bloco", audio: "f2-voz-luz" },
  f2Desafio: {
    text: "Com um adulto, feche os olhos e procure um brinquedo na mesa só com as mãos, bem devagar. Suas mãos foram o sensor!",
    highlight: "sensor",
    audio: "f2-voz-desafio",
  },

  // Fase 3 — falas literais do Ep 03 (roteiro mestre, Dia 03)
  f3Pergunta: {
    text: "Será que a imagem é feita de pontinhos minúsculos?",
    highlight: "pontinhos",
    audio: "f3-voz-pergunta",
  },
  f3UseLupa: { text: "Pegue a lupa e olhe a tela bem de perto!", highlight: "lupa", audio: "f3-voz-use-lupa" },
  f3Pixels: {
    text: "Muitos pontinhos de luz, chamados pixels, formam o que vemos.",
    highlight: "pixels",
    audio: "f3-voz-pixels",
  },
  f3Cores: { text: "Olhe outras cores da borboleta!", highlight: "cores", audio: "f3-voz-cores" },
  f3TresCores: {
    text: "Só vermelho, verde e azul! Juntinhos, fazem todas as cores.",
    highlight: "azul",
    audio: "f3-voz-tres-cores",
  },
  f3Afaste: { text: "Agora afaste a lupa bem devagar.", highlight: "afaste", audio: "f3-voz-afaste" },
  f3Resposta: { text: "De perto são pontos; de longe, uma borboleta!", highlight: "borboleta", audio: "f3-voz-resposta" },
  f3Desafio: {
    text: "Com um adulto, olhe a tela da TV ou do celular com uma lupa, bem de pertinho. Que cores você viu?",
    highlight: "lupa",
    audio: "f3-voz-desafio",
  },

  // Fase 5 — falas literais do Ep 05 (producao-ep05/01-roteiro.md)
  f5Pergunta: {
    text: "O pontinho azul sou eu! Mas como o mapa sabe onde eu estou?",
    highlight: "pontinho",
    audio: "f5-voz-pergunta",
  },
  f5Arraste: { text: "Leve os satélites para o céu da cidade!", highlight: "satélites", audio: "f5-voz-arraste" },
  f5Um: { text: "Com um satélite só, o pontinho fica perdido.", highlight: "perdido", audio: "f5-voz-um" },
  f5Dois: { text: "Com dois, ele ainda fica em dúvida…", highlight: "dúvida", audio: "f5-voz-dois" },
  f5Espalhe: { text: "Hum… tente espalhar mais os satélites!", highlight: "espalhar", audio: "f5-voz-espalhe" },
  f5Mova: { text: "Mude um satélite de lugar!", highlight: "satélite", audio: "f5-voz-mova" },
  f5MesmoLugar: {
    text: "Os círculos mudam, mas o pontinho não sai do lugar: é onde o tablet está!",
    highlight: "tablet",
    audio: "f5-voz-mesmo-lugar",
  },
  f5Descoberta: {
    text: "Lá no céu, satélites mandam sinais. O tablet escuta três deles e descobre onde eu estou!",
    highlight: "três",
    audio: "f5-voz-descoberta",
  },
  f5Anda: { text: "Eu ando, e o pontinho anda comigo!", highlight: "anda", audio: "f5-voz-anda" },
  f5LeveTablet: { text: "Agora leve o tablet até a estrela!", highlight: "tablet", audio: "f5-voz-leve-tablet" },
  f5Mensagem: { text: "Ué… e essa mensagem chegou sem fio?", highlight: "fio", audio: "f5-voz-mensagem" },
  f5Desafio: {
    text: "Com um adulto, abram o mapa no celular e deem uma volta no quintal ou na calçada. O pontinho azul andou junto com vocês?",
    highlight: "pontinho",
    audio: "f5-voz-desafio",
  },

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
  f4Desafio: {
    text: "Com um adulto, toque a tela do celular com o dedo e depois com a ponta de madeira de um lápis. O que aconteceu?",
    highlight: "lápis",
    audio: "f4-voz-desafio",
  },
} as const satisfies Record<string, Line>;
