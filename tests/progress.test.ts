import { describe, expect, it } from "vitest";
import {
  emptyProgress,
  isUnlocked,
  loadProgress,
  recordPhase,
  saveProgress,
  tailGlowLevel,
  totalStars,
  type KeyValueStore,
} from "../src/core/progress";

function memoryStore(): KeyValueStore {
  const data = new Map<string, string>();
  return { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => void data.set(k, v) };
}

describe("progresso", () => {
  it("dá a estrela de descoberta e a extra só quando todos os testes foram feitos", () => {
    let p = recordPhase(emptyProgress(), 4, false);
    expect(totalStars(p)).toBe(1);
    p = recordPhase(p, 4, true);
    expect(totalStars(p)).toBe(2);
  });

  it("nunca tira estrelas ao repetir a fase", () => {
    const p = recordPhase(recordPhase(emptyProgress(), 4, true), 4, false);
    expect(p.phases[4]).toEqual({ discovery: true, explorer: true });
  });

  it("a cauda ganha um brilho a cada 5 estrelas", () => {
    let p = emptyProgress();
    for (const id of [1, 2]) p = recordPhase(p, id, true);
    expect(tailGlowLevel(p)).toBe(0);
    p = recordPhase(p, 3, false);
    expect(tailGlowLevel(p)).toBe(1);
  });

  it("abre uma fase quando as fases jogáveis anteriores já foram descobertas", () => {
    const playable = [1, 4, 5];
    expect(isUnlocked(emptyProgress(), 1, playable)).toBe(true);
    expect(isUnlocked(emptyProgress(), 4, playable)).toBe(false);
    expect(isUnlocked(recordPhase(emptyProgress(), 1, false), 4, playable)).toBe(true);
    // fases ainda não publicadas não bloqueiam
    expect(isUnlocked(emptyProgress(), 4, [4])).toBe(true);
  });

  it("salva e carrega; dados estragados voltam ao início sem quebrar", () => {
    const store = memoryStore();
    saveProgress(recordPhase(emptyProgress(), 4, true), store);
    expect(totalStars(loadProgress(store))).toBe(2);
    store.setItem("laboratorio-da-zig:progresso:v1", "{nada");
    expect(loadProgress(store)).toEqual(emptyProgress());
  });
});
