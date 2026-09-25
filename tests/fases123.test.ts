import { describe, expect, it } from "vitest";
import { Learner, deck } from "../src/phases/fase01/logic";
import { BLOCK_ROWS, DEFAULT_BLOCK, GOAL, canEnter, drive, echoDistance, clampBlock } from "../src/phases/fase02/logic";
import { Magnifier, dominantChannel, pixelSize } from "../src/phases/fase03/logic";

describe("Fase 1 — a IA aprende com exemplos", () => {
  it("depois de exemplos certos, a máquina acerta sozinha", () => {
    const m = new Learner();
    m.teach("maca", "maca");
    m.teach("banana", "banana");
    expect(m.predict({ fruit: "maca" })).toBe("maca");
    expect(m.predict({ fruit: "banana" })).toBe("banana");
  });

  it("exemplos errados ensinam errado", () => {
    const m = new Learner();
    m.teach("banana", "maca");
    m.teach("banana", "maca");
    m.teach("banana", "banana");
    expect(m.learnedWrong("banana")).toBe(true);
    expect(m.predict({ fruit: "banana" })).toBe("maca");
  });

  it("o cartão difícil engana a máquina: uma pessoa confere", () => {
    const m = new Learner();
    for (let i = 0; i < 4; i++) m.teach("maca", "maca");
    expect(m.predict({ fruit: "maca", hard: true })).toBe("banana");
  });

  it("a máquina tenta depois de 4 exemplos, e o baralho alterna as frutas", () => {
    const m = new Learner();
    const d = deck();
    for (let i = 0; i < 4; i++) m.teach(d.next().value as "maca", "maca");
    expect(m.readyToTry).toBe(true);
    const next = [d.next().value, d.next().value];
    expect(next).toContain("banana");
  });
});

describe("Fase 2 — o robô no escuro", () => {
  it("só com os olhos, no escuro, ele esbarra no bloco", () => {
    const steps = drive("olhos", DEFAULT_BLOCK);
    expect(steps.at(-1)).toMatchObject({ type: "bump" });
  });

  it("com o sensor, o eco avisa e ele desvia até a estrela", () => {
    const steps = drive("sensor", DEFAULT_BLOCK);
    expect(steps.some((s) => s.type === "ping" && s.distance === 1)).toBe(true);
    expect(steps.at(-1)).toEqual({ type: "goal" });
    const moves = steps.filter((s) => s.type === "move").map((s) => (s as { to: object }).to);
    expect(moves).not.toContainEqual(DEFAULT_BLOCK);
    expect(moves.at(-1)).toEqual(GOAL);
  });

  it("funciona com o bloco em qualquer lugar permitido", () => {
    for (const col of [0, 1, 2])
      for (const row of BLOCK_ROWS) expect(drive("sensor", { col, row }).at(-1)).toEqual({ type: "goal" });
  });

  it("o eco mede a distância até o bloco à frente", () => {
    expect(echoDistance({ col: 1, row: 4 }, { col: 1, row: 2 })).toBe(2);
    expect(echoDistance({ col: 0, row: 4 }, { col: 1, row: 2 })).toBe(Infinity);
    expect(canEnter(DEFAULT_BLOCK, DEFAULT_BLOCK)).toBe(false);
    expect(clampBlock({ col: 9, row: 0 })).toEqual({ col: 2, row: 1 });
  });
});

describe("Fase 3 — pixels", () => {
  it("cada pixel tem uma luz que brilha mais", () => {
    expect(dominantChannel(220, 40, 30)).toBe("vermelho");
    expect(dominantChannel(20, 200, 60)).toBe("verde");
    expect(dominantChannel(30, 60, 230)).toBe("azul");
  });

  it("a estrela extra pede as três cores de perto", () => {
    const lupa = new Magnifier();
    expect(lupa.look(255, 0, 0)).toEqual({ channel: "vermelho", first: true, newColor: true });
    expect(lupa.look(250, 10, 0).newColor).toBe(false);
    lupa.look(0, 255, 0);
    expect(lupa.allColors).toBe(false);
    lupa.look(0, 0, 255);
    expect(lupa.allColors).toBe(true);
  });

  it("afastando a lupa, os pixels diminuem até a imagem aparecer", () => {
    expect(pixelSize(0)).toBe(24);
    expect(pixelSize(1)).toBe(1);
    expect(pixelSize(0.5)).toBeLessThan(pixelSize(0.2));
  });
});
