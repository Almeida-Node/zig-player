import type { PhaseScript } from "../game/types";
import { fase01 } from "../phases/fase01";
import { fase02 } from "../phases/fase02";
import { fase03 } from "../phases/fase03";
import { fase04 } from "../phases/fase04";
import type { Line } from "./falas";
import { FALAS } from "./falas";

export interface PhaseInfo {
  id: number;
  /** Pergunta do episódio, em MAIÚSCULAS com acentos (é também o teaser "AMANHÃ:"). */
  title: string;
  /** Ícone do menu, para quem ainda não lê. */
  icon: string;
  /** Desafio em casa: o mesmo experimento do comentário fixado do post. */
  challenge?: Line;
  /** Sem script, a fase aparece como "em breve". */
  script?: PhaseScript;
}

// Fases 7 a 30 entram conforme os episódios forem publicados.
export const PHASES: readonly PhaseInfo[] = [
  { id: 1, title: "COMO A IA APRENDE?", icon: "🍎", challenge: FALAS.f1Desafio, script: fase01 },
  { id: 2, title: "O ROBÔ VÊ NO ESCURO?", icon: "🤖", challenge: FALAS.f2Desafio, script: fase02 },
  { id: 3, title: "QUEM MORA DENTRO DA TELA?", icon: "🦋", challenge: FALAS.f3Desafio, script: fase03 },
  { id: 4, title: "POR QUE A TELA ME ESCUTA?", icon: "👆", challenge: FALAS.f4Desafio, script: fase04 },
  { id: 5, title: "O MAPA SABE ONDE ESTOU?", icon: "🛰️" },
  { id: 6, title: "O WI-FI É INVISÍVEL?", icon: "📶" },
];

export const PLAYABLE_IDS: readonly number[] = PHASES.filter((p) => p.script).map((p) => p.id);

export function nextPhase(id: number): PhaseInfo | undefined {
  return PHASES.find((p) => p.id === id + 1);
}
