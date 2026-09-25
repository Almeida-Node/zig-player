// Regras da Fase 2: no escuro, os olhos do robô não bastam; o sensor manda um
// sinal que bate no bloco e volta (eco) e o robô desvia. Sem lanterna: a luz
// não é a resposta (_qualidade/roteiro-ajustes.md).

export interface Cell {
  col: number;
  row: number;
}

export type Mode = "olhos" | "sensor";

export const COLS = 3;
export const ROWS = 5;
export const START: Cell = { col: 1, row: 4 };
export const GOAL: Cell = { col: 1, row: 0 };
export const DEFAULT_BLOCK: Cell = { col: 1, row: 2 };
/** Linhas onde a criança pode colocar o bloco. */
export const BLOCK_ROWS = [1, 2, 3] as const;

export type DriveStep =
  | { type: "move"; to: Cell }
  | { type: "ping"; from: Cell; distance: number }
  | { type: "bump"; at: Cell }
  | { type: "goal" };

export function same(a: Cell, b: Cell): boolean {
  return a.col === b.col && a.row === b.row;
}

/** Quantas casas até o bloco à frente (para cima), ou Infinity se o caminho está livre. */
export function echoDistance(robot: Cell, block: Cell): number {
  if (robot.col !== block.col || block.row >= robot.row) return Infinity;
  return robot.row - block.row;
}

export function canEnter(cell: Cell, block: Cell): boolean {
  return cell.col >= 0 && cell.col < COLS && cell.row >= 0 && cell.row < ROWS && !same(cell, block);
}

export function clampBlock(cell: Cell): Cell {
  const row = Math.min(BLOCK_ROWS[BLOCK_ROWS.length - 1], Math.max(BLOCK_ROWS[0], cell.row));
  const col = Math.min(COLS - 1, Math.max(0, cell.col));
  return { col, row };
}

/** O passeio do robô do início até a estrela, no modo escolhido. */
export function drive(mode: Mode, block: Cell, start: Cell = START, goal: Cell = GOAL): DriveStep[] {
  const steps: DriveStep[] = [];
  let at = { ...start };
  let guard = 0;
  while (!same(at, goal) && guard++ < 30) {
    if (at.row > goal.row) {
      const ahead = { col: at.col, row: at.row - 1 };
      if (mode === "sensor") {
        const distance = echoDistance(at, block);
        steps.push({ type: "ping", from: { ...at }, distance });
        if (distance === 1) {
          const side = canEnter({ col: at.col + 1, row: at.row }, block) && at.col + 1 < COLS ? at.col + 1 : at.col - 1;
          at = { col: side, row: at.row };
          steps.push({ type: "move", to: { ...at } });
          continue;
        }
      } else if (!canEnter(ahead, block)) {
        steps.push({ type: "bump", at: { ...at } });
        return steps; // no escuro, só com os olhos, ele esbarra
      }
      at = ahead;
    } else {
      at = { col: at.col + Math.sign(goal.col - at.col), row: at.row };
    }
    steps.push({ type: "move", to: { ...at } });
  }
  steps.push({ type: "goal" });
  return steps;
}
