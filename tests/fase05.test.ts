import { describe, expect, it } from "vitest";
import { TABLET_AT, circleIntersections, distance, locate } from "../src/phases/fase05/logic";

const near = (a: { x: number; y: number }, b: { x: number; y: number }) => distance(a, b) < 0.5;

describe("Fase 5 — o mapa calcula onde está", () => {
  it("com um satélite, o pontinho fica perdido", () => {
    expect(locate([{ x: 10, y: 10 }], TABLET_AT).fix).toBe("perdido");
  });

  it("com dois, fica em dúvida entre dois lugares (um deles é o certo)", () => {
    const r = locate([{ x: 10, y: 10 }, { x: 50, y: 20 }], TABLET_AT);
    expect(r.fix).toBe("duvida");
    expect(r.candidates).toHaveLength(2);
    expect(r.candidates.some((p) => near(p, TABLET_AT))).toBe(true);
  });

  it("com três espalhados, os círculos se cruzam num lugar só: o tablet", () => {
    const r = locate([{ x: 10, y: 10 }, { x: 50, y: 20 }, { x: 15, y: 70 }], TABLET_AT);
    expect(r.fix).toBe("achou");
    expect(near(r.candidates[0]!, TABLET_AT)).toBe(true);
  });

  it("três satélites em fila ainda deixam dúvida: é preciso espalhar", () => {
    const r = locate([{ x: 5, y: 10 }, { x: 30, y: 10 }, { x: 55, y: 10 }], TABLET_AT);
    expect(r.fix).toBe("duvida");
  });

  it("satélites no mesmo lugar valem por um só", () => {
    expect(locate([{ x: 20, y: 20 }, { x: 21, y: 20 }], TABLET_AT).fix).toBe("perdido");
  });

  it("o outro cruzamento quase encostando no terceiro círculo não confunde", () => {
    // caso real do teste no navegador: antes dava "dúvida"
    const r = locate([{ x: 10, y: 10 }, { x: 50, y: 20 }, { x: 52, y: 74 }], TABLET_AT);
    expect(r.fix).toBe("achou");
    expect(near(r.candidates[0]!, TABLET_AT)).toBe(true);
  });

  it("mudar um satélite de lugar não muda onde o tablet está", () => {
    const a = locate([{ x: 10, y: 10 }, { x: 50, y: 20 }, { x: 15, y: 70 }], TABLET_AT);
    const b = locate([{ x: 10, y: 10 }, { x: 50, y: 20 }, { x: 55, y: 75 }], TABLET_AT);
    expect(near(a.candidates[0]!, b.candidates[0]!)).toBe(true);
  });

  it("círculos que não se tocam não se cruzam", () => {
    expect(circleIntersections({ x: 0, y: 0 }, 2, { x: 10, y: 0 }, 2)).toEqual([]);
  });
});
