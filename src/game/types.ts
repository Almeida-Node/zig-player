import type { AssetId } from "../content/assets";
import type { Line } from "../content/falas";
import type { Reaction } from "../ui/zig-bubble";

/** O que o jogo oferece para cada fase. */
export interface PhaseContext {
  /** Área 9:16 onde a fase monta a cena. */
  stage: HTMLElement;
  /** A Zig fala (áudio oficial ou voz provisória) com legenda. */
  say(line: Line): Promise<void>;
  /** Toca um clipe do episódio com a legenda da fala; sem o clipe, mostra o marcador e fala. */
  playClip(video: AssetId, line: Line): Promise<void>;
  /** A Zig reage na bolha com um clipe curto do Flow. */
  react(reaction: Reaction): Promise<void>;
  /** Mostra o botão ▶ e espera a criança tocar. */
  waitForNext(): Promise<void>;
  /** Some com o botão ▶, se estiver na tela. */
  hideNext(): void;
  /** Registra um teste feito (conta para a estrela extra). */
  tried(testId: string): void;
  /** Cancelado quando a criança volta para o início no meio da fase. */
  signal: AbortSignal;
}

/** Os três primeiros momentos de cada fase. Estrela, teaser e desafio são do jogo. */
export interface PhaseFlow {
  /** 1. Pergunta: a Zig mostra o mistério (clipe 1). */
  question(): Promise<void>;
  /** 2. Testes: a criança testa até o conceito aparecer na imagem (clipe 2). */
  explore(): Promise<void>;
  /** 3. Resposta: a Zig explica e a criança repete o gesto (clipe 3). */
  answer(): Promise<void>;
}

export interface PhaseScript {
  /** Todos os testes possíveis, inclusive os que "não funcionam". */
  testIds: readonly string[];
  mount(ctx: PhaseContext): PhaseFlow;
}
