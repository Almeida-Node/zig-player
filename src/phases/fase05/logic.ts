// Regras da Fase 5: o mapa não "vê" ninguém. Cada satélite manda um sinal; o
// tablet sabe a que distância está de cada um, e isso vira um círculo. Com um
// círculo o pontinho fica perdido, com dois fica em dúvida (dois cruzamentos),
// com três espalhados só sobra um lugar: é ali que o tablet está.

export interface Point {
  x: number;
  y: number;
}

export type Fix = "perdido" | "duvida" | "achou";

/** Área do mapa, em unidades do SVG do tablet (igual à Fase 4). */
export const MAP = { width: 60, height: 80 } as const;
/** Onde o tablet da Zig está no começo (o jogo nunca mostra isso antes da hora). */
export const TABLET_AT: Point = { x: 38, y: 52 };
/** Para onde a criança leva o tablet na resposta. */
export const WALK_GOAL: Point = { x: 16, y: 18 };

const EPS = 0.6;

export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Pontos onde dois círculos se cruzam (0, 1 ou 2). */
export function circleIntersections(c1: Point, r1: number, c2: Point, r2: number): Point[] {
  const d = distance(c1, c2);
  if (d < 1e-6 || d > r1 + r2 + EPS || d < Math.abs(r1 - r2) - EPS) return [];
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, r1 * r1 - a * a));
  const mx = c1.x + (a * (c2.x - c1.x)) / d;
  const my = c1.y + (a * (c2.y - c1.y)) / d;
  const ox = (h * (c2.y - c1.y)) / d;
  const oy = (h * (c2.x - c1.x)) / d;
  const p1 = { x: mx + ox, y: my - oy };
  const p2 = { x: mx - ox, y: my + oy };
  return distance(p1, p2) < EPS ? [p1] : [p1, p2];
}

/**
 * O que o tablet consegue calcular com os satélites que está escutando.
 * Os raios são as distâncias até o tablet (é o que o sinal "conta").
 */
export function locate(satellites: readonly Point[], tablet: Point): { fix: Fix; candidates: Point[] } {
  if (satellites.length === 0) return { fix: "perdido", candidates: [] };
  const circles = satellites.map((s) => ({ c: s, r: distance(s, tablet) }));
  if (circles.length === 1) return { fix: "perdido", candidates: [] };

  // Satélites quase no mesmo lugar não ajudam: é como escutar um só.
  const [a, b] = pickSpread(circles);
  if (!a || !b) return { fix: "perdido", candidates: [] };
  if (circles.length === 2) return { fix: "duvida", candidates: circleIntersections(a.c, a.r, b.c, b.r) };

  // Cruzamentos de todos os pares, do que melhor encaixa em todos os círculos ao pior.
  const misfit = (p: Point) => Math.max(...circles.map(({ c, r }) => Math.abs(distance(c, p) - r)));
  const cross: Point[] = [];
  for (let i = 0; i < circles.length; i++)
    for (let j = i + 1; j < circles.length; j++)
      if (distance(circles[i]!.c, circles[j]!.c) > 3)
        cross.push(...circleIntersections(circles[i]!.c, circles[i]!.r, circles[j]!.c, circles[j]!.r));
  const fitting = cross.filter((p) => misfit(p) < TIE).sort((p, q) => misfit(p) - misfit(q));
  const best = fitting[0];
  if (!best) return { fix: "duvida", candidates: cross };
  // O lugar certo encaixa em todos. Só há dúvida se OUTRO lugar, longe dele, também encaixa
  // (satélites em fila). Dois cruzamentos colados no desenho são o mesmo lugar.
  const rival = fitting.find((p) => distance(p, best) > TIE * 3);
  if (rival) return { fix: "duvida", candidates: [best, rival] };
  return { fix: "achou", candidates: [best] };
}

/** Abaixo disso, os dois cruzamentos parecem igualmente certos no desenho. */
const TIE = 1;

function pickSpread<T extends { c: Point }>(circles: T[]): [T | undefined, T | undefined] {
  let best: [T | undefined, T | undefined] = [undefined, undefined];
  let bestD = 3; // abaixo disso, estão praticamente juntos
  for (let i = 0; i < circles.length; i++)
    for (let j = i + 1; j < circles.length; j++) {
      const d = distance(circles[i]!.c, circles[j]!.c);
      if (d > bestD) {
        bestD = d;
        best = [circles[i], circles[j]];
      }
    }
  return best;
}

/** Pontinhos "perdidos" espalhados pelo único círculo, para mostrar a dúvida. */
export function ghostsOnCircle(center: Point, r: number, count = 6, phase = 0): Point[] {
  return Array.from({ length: count }, (_, i) => {
    const t = phase + (i / count) * Math.PI * 2;
    return { x: center.x + r * Math.cos(t), y: center.y + r * Math.sin(t) };
  });
}
