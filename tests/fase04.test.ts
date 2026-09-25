import { describe, expect, it } from "vitest";
import { GRID, OBJECT_IDS, TouchLab, fitsSlot, nearestNode } from "../src/phases/fase04/logic";

describe("Fase 4 — a tela sente o toque", () => {
  it("só o dedo acende a rede", () => {
    const lab = new TouchLab();
    expect(lab.touch("lapis")).toEqual({ lights: false, afterDiscovery: false });
    expect(lab.touch("luva").lights).toBe(false);
    expect(lab.touch("dedo")).toEqual({ lights: true, firstDiscovery: true });
    expect(lab.touch("dedo")).toEqual({ lights: true, firstDiscovery: false });
    expect(lab.touch("borracha")).toEqual({ lights: false, afterDiscovery: true });
  });

  it("a estrela extra pede todos os testes, inclusive os que não funcionam", () => {
    const lab = new TouchLab();
    lab.touch("dedo");
    expect(lab.discovered).toBe(true);
    expect(lab.allTried).toBe(false);
    for (const id of OBJECT_IDS) lab.touch(id);
    expect(lab.allTried).toBe(true);
  });

  it("acende o cruzamento da rede mais perto do toque, sem sair do vidro", () => {
    expect(nearestNode(14, 26)).toMatchObject({ x: 15, y: 25 });
    expect(nearestNode(-20, 999)).toMatchObject({ x: GRID.offset, y: 75 });
  });

  it("a estrela encaixa só perto do lugar vazio da constelação", () => {
    expect(fitsSlot(31, 25, { x: 30, y: 24 })).toBe(true);
    expect(fitsSlot(50, 50, { x: 30, y: 24 })).toBe(false);
  });
});
