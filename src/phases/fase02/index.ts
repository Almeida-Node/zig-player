// Fase 2 — O robô vê no escuro? (Ep 02, versão corrigida: sem lanterna)
// No quarto escuro, a criança testa o robô só com os olhos (ele esbarra) e
// com o sensor: ondas ciano saem do robô, batem no bloco e voltam (eco), e ele
// desvia. Na resposta, a criança leva o robô pelo escuro e a luz acende no fim.

import { FALAS } from "../../content/falas";
import { imageSlot } from "../../core/assets";
import { h, iconButton } from "../../core/dom";
import { makeDraggable } from "../../core/drag";
import type { PhaseContext, PhaseFlow, PhaseScript } from "../../game/types";
import { placeAt, speaker, starShape, svg, toViewBox, wait } from "../shared";
import {
  COLS,
  DEFAULT_BLOCK,
  GOAL,
  ROWS,
  START,
  canEnter,
  clampBlock,
  drive,
  echoDistance,
  same,
  type Cell,
  type Mode,
} from "./logic";

const CELL = 10; // unidades do SVG por casa
const W = COLS * CELL;
const H = ROWS * CELL;
const STEP_MS = 420;

export const fase02: PhaseScript = {
  testIds: ["olhos", "sensor", "bloco"],
  mount: (ctx) => mountFase02(ctx),
};

const center = (c: Cell) => ({ x: c.col * CELL + CELL / 2, y: c.row * CELL + CELL / 2 });

function mountFase02(ctx: PhaseContext): PhaseFlow {
  const zig = speaker(ctx.say);
  const scene = h("div", { class: "f2-scene" });
  const room = h("div", { class: "f2-room" });
  const waves = svg("svg", { viewBox: `0 0 ${W} ${H}`, class: "f2-waves" });
  const dark = h("div", { class: "f2-dark" });
  const robot = h("div", { class: "f2-robot", label: "Robô" }, [imageSlot("f2-robo")]);
  const block = h("div", { class: "f2-block", label: "Bloco de madeira" }, [imageSlot("f2-bloco")]);
  waves.append(starShape(center(GOAL).x, center(GOAL).y, 3.2, "f2-goal"));
  // O escuro cobre o chão e o bloco; o robô aparece só pelo brilho dos olhos.
  room.append(imageSlot("f2-cenario", "f2-floor"), block, dark, robot, waves);

  const eyesBtn = iconButton("👀", "Só com os olhos", () => void run("olhos"), "f2-mode");
  const sensorBtn = iconButton("📡", "Com o sensor", () => void run("sensor"), "f2-mode sensor");
  const controls = h("div", { class: "f2-controls" }, [eyesBtn, sensorBtn]);
  scene.append(room, controls);
  ctx.stage.append(scene);

  let robotAt: Cell = { ...START };
  let blockAt: Cell = { ...DEFAULT_BLOCK };
  const place = (el: HTMLElement, c: Cell) => placeAt(el, center(c), W, H);
  place(robot, robotAt);
  place(block, blockAt);

  /** Um arco ciano que cresce: para cima saindo do robô, ou para baixo voltando do bloco. */
  const arc = (from: { x: number; y: number }, reach: number, up: boolean, ms: number) =>
    new Promise<void>((resolve) => {
      const path = svg("path", { class: up ? "f2-wave" : "f2-wave echo" });
      waves.append(path);
      const t0 = performance.now();
      const frame = (t: number) => {
        const k = Math.min(1, (t - t0) / ms);
        const r = 2 + k * reach;
        const sweep = up ? 1 : 0;
        path.setAttribute("d", `M ${from.x - r * 0.9} ${from.y} A ${r} ${r} 0 0 ${sweep} ${from.x + r * 0.9} ${from.y}`);
        path.style.opacity = String(1 - k * 0.7);
        if (k < 1) requestAnimationFrame(frame);
        else {
          path.remove();
          resolve();
        }
      };
      requestAnimationFrame(frame);
    });

  /** O sensor manda o sinal; se há bloco à frente, ele bate e volta (eco). */
  const ping = async (from: Cell) => {
    const d = echoDistance(from, blockAt);
    const origin = center(from);
    if (!Number.isFinite(d)) return arc(origin, CELL * 1.6, true, 380);
    const reach = d * CELL - CELL / 2;
    await arc(origin, reach, true, 120 * d);
    const hit = center(blockAt);
    const dot = svg("circle", { cx: hit.x, cy: hit.y + CELL * 0.45, r: 1.2, class: "f2-hit" });
    waves.append(dot);
    setTimeout(() => dot.remove(), 900);
    await arc({ x: hit.x, y: hit.y + CELL / 2 }, reach, false, 120 * d);
  };

  let running = false;
  let answering = false;
  let resolveDiscovery: () => void = () => undefined;
  const discovery = new Promise<void>((resolve) => (resolveDiscovery = resolve));
  let sensorWins = 0;

  const moveRobot = async (c: Cell) => {
    robotAt = c;
    place(robot, c);
    await wait(STEP_MS);
  };

  const run = async (mode: Mode) => {
    if (running || answering) return;
    running = true;
    controls.classList.add("busy");
    ctx.tried(mode);
    const blockMoved = !same(blockAt, DEFAULT_BLOCK);
    if (mode === "sensor" && blockMoved) ctx.tried("bloco");
    for (const step of drive(mode, blockAt, START, GOAL)) {
      if (step.type === "move") await moveRobot(step.to);
      else if (step.type === "ping") await ping(step.from);
      else if (step.type === "bump") {
        robot.classList.add("bump");
        await wait(500);
        robot.classList.remove("bump");
        void ctx.react("hum");
        await zig.now(FALAS.f2Bateu);
      } else {
        robot.classList.add("happy");
        await wait(400);
        robot.classList.remove("happy");
        sensorWins++;
        void ctx.react(sensorWins === 1 ? "surpresa" : "comemora");
        if (sensorWins === 1) resolveDiscovery();
        else if (!blockMoved) await zig.ifFree(FALAS.f2MovaBloco);
      }
    }
    await wait(300);
    robot.style.transition = "none";
    await moveRobot({ ...START });
    robot.style.transition = "";
    controls.classList.remove("busy");
    running = false;
  };

  // O bloco pode mudar de lugar (nas linhas do meio), para testar de novo.
  makeDraggable(block, {
    onDrop: (x, y) => {
      if (running || answering) return false;
      const p = toViewBox(room, W, H, x, y);
      const cell = clampBlock({ col: Math.floor(p.x / CELL), row: Math.floor(p.y / CELL) });
      if (same(cell, robotAt) || same(cell, GOAL)) return false;
      blockAt = cell;
      block.style.transition = "none";
      block.style.transform = "";
      place(block, cell);
      return false; // a posição nova vem do place(); o arrasto volta a zero
    },
  });

  return {
    async question() {
      await ctx.playClip("f2-clipe-pergunta", [FALAS.f2Pergunta]);
      await ctx.waitForNext();
    },

    async explore() {
      scene.classList.add("night");
      controls.classList.add("show");
      void ctx.react("aponta");
      await zig.now(FALAS.f2Teste);
      await discovery;
      await ctx.waitForNext();
      controls.classList.remove("show");
      await ctx.playClip("f2-clipe-descoberta", [FALAS.f2Eco]);
    },

    async answer() {
      answering = true;
      await ctx.playClip("f2-clipe-resposta", [FALAS.f2Resposta]);
      robot.classList.add("steer");

      // A criança leva o robô casa por casa; o sensor avisa quando o bloco está à frente.
      const arrived = new Promise<void>((resolve) => {
        let lastPing = 0;
        const follow = (x: number, y: number) => {
          robot.style.transform = ""; // o robô anda casa por casa, não gruda no dedo
          const p = toViewBox(room, W, H, x, y);
          const target = { col: Math.floor(p.x / CELL), row: Math.floor(p.y / CELL) };
          const dc = Math.sign(target.col - robotAt.col);
          const dr = Math.sign(target.row - robotAt.row);
          const next = dc !== 0 ? { col: robotAt.col + dc, row: robotAt.row } : { col: robotAt.col, row: robotAt.row + dr };
          if (same(next, robotAt)) return;
          if (!canEnter(next, blockAt)) {
            const now = performance.now();
            if (now - lastPing > 700 && same(next, blockAt)) {
              lastPing = now;
              void ping(robotAt);
            }
            return;
          }
          robotAt = next;
          place(robot, next);
          if (same(next, GOAL)) {
            stop();
            resolve();
          }
        };
        const stop = makeDraggable(robot, {
          onMove: follow,
          onDrop: () => {
            robot.style.transform = "";
            return false;
          },
        });
      });
      void ctx.say(FALAS.f2LeveRobo);
      await arrived;

      robot.classList.remove("steer");
      scene.classList.remove("night"); // só no fim a luz acende e mostra o bloco
      void ctx.react("comemora");
      await ctx.say(FALAS.f2Luz);
      await ctx.waitForNext();
    },
  };
}
