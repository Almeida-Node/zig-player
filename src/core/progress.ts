// Progresso fica só neste aparelho (localStorage). Nada é enviado para fora:
// o jogo não coleta dados da criança.

export interface PhaseStars {
  /** Estrela de descoberta: a criança chegou à resposta da fase. */
  discovery: boolean;
  /** Estrela extra: a criança fez todos os testes, inclusive os que "não funcionam". */
  explorer: boolean;
}

export interface Progress {
  phases: Record<number, PhaseStars>;
}

export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const STORAGE_KEY = "laboratorio-da-zig:progresso:v1";

export const STARS_PER_GLOW = 5;

export function emptyProgress(): Progress {
  return { phases: {} };
}

export function loadProgress(store: KeyValueStore | undefined = safeLocalStorage()): Progress {
  if (!store) return emptyProgress();
  try {
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<Progress>;
    if (!parsed || typeof parsed.phases !== "object" || parsed.phases === null) return emptyProgress();
    return { phases: { ...parsed.phases } };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress: Progress, store: KeyValueStore | undefined = safeLocalStorage()): void {
  if (!store) return;
  try {
    store.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Sem armazenamento (aba anônima, cota cheia): o jogo continua funcionando.
  }
}

/** Registra o fim de uma fase. Estrelas nunca são tiradas. */
export function recordPhase(progress: Progress, phaseId: number, allTestsTried: boolean): Progress {
  const previous = progress.phases[phaseId] ?? { discovery: false, explorer: false };
  return {
    phases: {
      ...progress.phases,
      [phaseId]: { discovery: true, explorer: previous.explorer || allTestsTried },
    },
  };
}

export function totalStars(progress: Progress): number {
  return Object.values(progress.phases).reduce(
    (sum, p) => sum + (p.discovery ? 1 : 0) + (p.explorer ? 1 : 0),
    0,
  );
}

/** Quantos brilhos a cauda da Zig já ganhou (um a cada 5 estrelas). */
export function tailGlowLevel(progress: Progress): number {
  return Math.floor(totalStars(progress) / STARS_PER_GLOW);
}

/**
 * Uma fase jogável fica aberta quando todas as fases jogáveis anteriores já
 * têm a estrela de descoberta. Fases ainda não publicadas não bloqueiam.
 */
export function isUnlocked(progress: Progress, phaseId: number, playableIds: readonly number[]): boolean {
  return playableIds
    .filter((id) => id < phaseId)
    .every((id) => progress.phases[id]?.discovery === true);
}

function safeLocalStorage(): KeyValueStore | undefined {
  try {
    return typeof window !== "undefined" ? window.localStorage : undefined;
  } catch {
    return undefined;
  }
}
