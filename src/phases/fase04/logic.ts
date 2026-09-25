// Regras da Fase 4, sem tela: fáceis de testar.
import type { AssetId } from "../../content/assets";

export type ObjectId = "dedo" | "lapis" | "luva" | "borracha";

export interface TouchObject {
  id: ObjectId;
  asset: AssetId;
  label: string;
  /** Conduz a eletricidade do corpo? Só assim a rede da tela sente. */
  conducts: boolean;
}

export const OBJECTS: readonly TouchObject[] = [
  { id: "dedo", asset: "f4-dedo", label: "Dedo", conducts: true },
  { id: "lapis", asset: "f4-lapis", label: "Ponta de madeira do lápis", conducts: false },
  { id: "luva", asset: "f4-luva", label: "Luva de lã", conducts: false },
  { id: "borracha", asset: "f4-borracha", label: "Borracha", conducts: false },
];

export const OBJECT_IDS: readonly ObjectId[] = OBJECTS.map((o) => o.id);

/** Rede embaixo do vidro, em unidades do SVG do tablet (viewBox 0 0 60 80). */
export const GRID = { width: 60, height: 80, step: 10, offset: 5 } as const;

export interface GridNode {
  col: number;
  row: number;
  x: number;
  y: number;
}

export function gridLines(): { xs: number[]; ys: number[] } {
  const xs: number[] = [];
  const ys: number[] = [];
  for (let x = GRID.offset; x < GRID.width; x += GRID.step) xs.push(x);
  for (let y = GRID.offset; y < GRID.height; y += GRID.step) ys.push(y);
  return { xs, ys };
}

/** Cruzamento da rede mais perto do ponto tocado. */
export function nearestNode(x: number, y: number): GridNode {
  const { xs, ys } = gridLines();
  const col = clamp(Math.round((x - GRID.offset) / GRID.step), 0, xs.length - 1);
  const row = clamp(Math.round((y - GRID.offset) / GRID.step), 0, ys.length - 1);
  return { col, row, x: xs[col]!, y: ys[row]! };
}

export type TouchOutcome =
  | { lights: true; firstDiscovery: boolean }
  | { lights: false; afterDiscovery: boolean };

/** Guarda o que a criança já testou. Errar nunca tira nada. */
export class TouchLab {
  private readonly tried = new Set<ObjectId>();
  private found = false;

  touch(id: ObjectId): TouchOutcome {
    this.tried.add(id);
    const object = OBJECTS.find((o) => o.id === id);
    if (object?.conducts) {
      const firstDiscovery = !this.found;
      this.found = true;
      return { lights: true, firstDiscovery };
    }
    return { lights: false, afterDiscovery: this.found };
  }

  get discovered(): boolean {
    return this.found;
  }

  get allTried(): boolean {
    return OBJECT_IDS.every((id) => this.tried.has(id));
  }

  hasTried(id: ObjectId): boolean {
    return this.tried.has(id);
  }
}

/** A estrela encaixa na constelação quando chega perto o bastante do lugar vazio. */
export function fitsSlot(x: number, y: number, slot: { x: number; y: number }, radius = 9): boolean {
  return Math.hypot(x - slot.x, y - slot.y) <= radius;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
