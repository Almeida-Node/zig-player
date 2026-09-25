// Fase 5 — O mapa sabe onde estou? (Ep 05)
// A criança leva três satélites para o céu da cidade. Cada um "conta" a que
// distância o tablet está: um círculo de ondas ciano. Com um, o pontinho fica
// perdido; com dois, em dúvida; com três espalhados, os círculos se cruzam num
// ponto só e o pontinho azul acende. Na resposta, ela leva o tablet pela
// varanda e o pontinho anda junto; no fim, chega uma mensagem sem fio.

import { FALAS } from "../../content/falas";
import { imageSlot } from "../../core/assets";
import { h } from "../../core/dom";
import { isInside, makeDraggable } from "../../core/drag";
import type { PhaseContext, PhaseFlow, PhaseScript } from "../../game/types";
import { placeAt, speaker, starShape, svg, toViewBox, wait } from "../shared";
import { MAP, TABLET_AT, WALK_GOAL, distance, ghostsOnCircle, locate, type Fix, type Point } from "./logic";

export const fase05: PhaseScript = {
  testIds: ["um", "dois", "tres", "mover"],
  mount: (ctx) => mountFase05(ctx),
};

function mountFase05(ctx: PhaseContext): PhaseFlow {
  const zig = speaker(ctx.say);
  const scene = h("div", { class: "f5-scene" });
  const dock = h("div", { class: "f5-dock", label: "Satélites" });
  const tablet = h("div", { class: "f5-tablet" });
  const glassArea = h("div", { class: "f5-glass-area" });
  const layer = svg("svg", { viewBox: `0 0 ${MAP.width} ${MAP.height}`, class: "f5-layer" });
  const circles = svg("g", { class: "f5-circles" });
  const ghosts = svg("g", { class: "f5-ghosts" });
  const dot = svg("g", { class: "f5-dot" });
  dot.append(svg("circle", { r: 5, class: "f5-dot-ring" }), svg("circle", { r: 2.2, class: "f5-dot-core" }));
  layer.append(circles, ghosts, dot);
  glassArea.append(imageSlot("f4-mapa", "f5-map"), layer); // o MESMO mapa do Ep 04
  tablet.append(imageSlot("f4-tablet", "f5-tablet-img"), glassArea);
  scene.append(imageSlot("f5-cenario", "scene-bg"), dock, tablet);
  ctx.stage.append(scene);

  const placed = new Map<HTMLElement, Point>();
  let tabletAt: Point = { ...TABLET_AT };
  let fix: Fix = "perdido";
  let ghostPhase = 0;
  let exploring = false;

  /** Redesenha círculos, pontinhos em dúvida e o pontinho azul. */
  const draw = () => {
    const sats = [...placed.values()];
    circles.replaceChildren(
      ...sats.flatMap((s) => [
        svg("circle", { cx: s.x, cy: s.y, r: distance(s, tabletAt), class: "f5-circle" }),
        svg("circle", { cx: s.x, cy: s.y, r: 1, class: "f5-center" }),
      ]),
    );
    const result = locate(sats, tabletAt);
    fix = result.fix;
    ghosts.replaceChildren();
    if (fix === "perdido" && sats.length > 0) {
      const s = sats[0]!;
      for (const p of ghostsOnCircle(s, distance(s, tabletAt), 6, ghostPhase))
        ghosts.append(svg("circle", { cx: p.x, cy: p.y, r: 1.8, class: "f5-ghost" }));
    } else if (fix === "duvida") {
      // O outro lugar possível às vezes cai fora do mapa: ele pisca na borda, para a dúvida aparecer.
      for (const p of result.candidates) {
        const inside = p.x >= 0 && p.x <= MAP.width && p.y >= 0 && p.y <= MAP.height;
        const q = { x: clamp(p.x, 3, MAP.width - 3), y: clamp(p.y, 3, MAP.height - 3) };
        ghosts.append(svg("circle", { cx: q.x, cy: q.y, r: 2, class: inside ? "f5-ghost doubt" : "f5-ghost doubt edge" }));
      }
    }
    dot.classList.toggle("on", fix === "achou");
    dot.setAttribute("transform", `translate(${tabletAt.x} ${tabletAt.y})`);
  };

  // Os pontinhos perdidos passeiam pelo círculo: o tablet ainda não sabe onde está.
  const drift = setInterval(() => {
    if (fix !== "perdido" || placed.size === 0) return;
    ghostPhase += 0.35;
    draw();
  }, 300);
  ctx.signal.addEventListener("abort", () => clearInterval(drift));

  /** Um anel ciano que sai do satélite quando ele chega ao céu. */
  const pulse = (s: Point) => {
    const ring = svg("circle", { cx: s.x, cy: s.y, r: 1, class: "f5-pulse" });
    circles.append(ring);
    const r = distance(s, tabletAt);
    const t0 = performance.now();
    const frame = (t: number) => {
      const k = Math.min(1, (t - t0) / 700);
      ring.setAttribute("r", String(1 + k * r));
      ring.style.opacity = String(1 - k);
      if (k < 1) requestAnimationFrame(frame);
      else ring.remove();
    };
    requestAnimationFrame(frame);
  };

  let resolveDiscovery: () => void = () => undefined;
  const discovery = new Promise<void>((resolve) => (resolveDiscovery = resolve));
  let found = false;
  let movedAfterFound = false;
  let hintedSpread = false;

  const onPlaced = async (sat: HTMLElement, p: Point, wasPlaced: boolean) => {
    placed.set(sat, p);
    draw();
    pulse(p);
    const count = placed.size;
    if (count === 1) ctx.tried("um");
    if (count === 2) ctx.tried("dois");
    if (!exploring) return;

    if (fix === "achou") {
      ctx.tried("tres");
      if (!found) {
        found = true;
        void ctx.react("surpresa");
        resolveDiscovery(); // o clipe 2 explica: três sinais
        await wait(2200);
        await zig.ifFree(FALAS.f5Mova);
      } else if (wasPlaced && !movedAfterFound) {
        movedAfterFound = true;
        ctx.tried("mover");
        void ctx.react("comemora");
        await zig.ifFree(FALAS.f5MesmoLugar);
      }
    } else if (count === 1) {
      void ctx.react("hum");
      await zig.ifFree(FALAS.f5Um);
    } else if (count === 2 && !wasPlaced) {
      void ctx.react("hum");
      await zig.ifFree(FALAS.f5Dois);
    } else if (count === 3 && !hintedSpread) {
      hintedSpread = true;
      await zig.ifFree(FALAS.f5Espalhe);
    }
  };

  // Três satélites esperando no céu, em cima.
  for (let i = 0; i < 3; i++) {
    const sat = h("div", { class: "f5-sat", label: "Satélite" }, [imageSlot("f5-satelite")]);
    dock.append(sat);
    makeDraggable(sat, {
      onDrop: (x, y) => {
        if (!exploring || !isInside(glassArea, x, y)) return false;
        const p = toViewBox(glassArea, MAP.width, MAP.height, x, y);
        // No mapa, o satélite fica exatamente em cima do ponto onde foi solto.
        const wasPlaced = placed.has(sat);
        sat.classList.add("flying");
        void onPlaced(sat, p, wasPlaced);
        return true;
      },
    });
  }

  return {
    async question() {
      draw();
      await ctx.playClip("f5-clipe-pergunta", [FALAS.f5Pergunta]);
      await ctx.waitForNext();
    },

    async explore() {
      exploring = true;
      dock.classList.add("show");
      void ctx.react("aponta");
      await zig.now(FALAS.f5Arraste);
      await discovery;
      await ctx.waitForNext();
      exploring = false;
      await ctx.playClip("f5-clipe-descoberta", [FALAS.f5Descoberta]);
    },

    async answer() {
      await ctx.playClip("f5-clipe-resposta", [FALAS.f5Anda]);

      // Os três satélites continuam no céu; se a criança deixou menos, o jogo completa.
      const spots: Point[] = [
        { x: 8, y: 10 },
        { x: 54, y: 16 },
        { x: 12, y: 72 },
      ];
      [...dock.querySelectorAll<HTMLElement>(".f5-sat")].forEach((sat, i) => {
        if (fix !== "achou" || !placed.has(sat)) placed.set(sat, spots[i]!);
      });
      if (locate([...placed.values()], tabletAt).fix !== "achou") spots.forEach((p, i) => placed.set([...placed.keys()][i]!, p));
      dock.classList.add("parked");
      for (const p of placed.values()) {
        const mini = h("div", { class: "f5-sat-mini", label: "Satélite" }, [imageSlot("f5-satelite")]);
        placeAt(mini, p, MAP.width, MAP.height);
        glassArea.append(mini);
      }
      draw();

      // A criança leva o tablet (o 📱) até a estrela; o pontinho e os círculos acompanham.
      const goal = starShape(WALK_GOAL.x, WALK_GOAL.y, 3.4, "f5-goal");
      layer.append(goal);
      const walker = h("div", { class: "f5-walker", label: "Tablet da Zig", text: "📱" });
      placeAt(walker, tabletAt, MAP.width, MAP.height);
      glassArea.append(walker);

      const arrived = new Promise<void>((resolve) => {
        const stop = makeDraggable(walker, {
          onMove: (x, y) => {
            walker.style.transform = "";
            const p = toViewBox(glassArea, MAP.width, MAP.height, x, y);
            tabletAt = { x: clamp(p.x, 2, MAP.width - 2), y: clamp(p.y, 2, MAP.height - 2) };
            placeAt(walker, tabletAt, MAP.width, MAP.height);
            draw();
            if (distance(tabletAt, WALK_GOAL) < 6) {
              stop();
              resolve();
            }
          },
          onDrop: () => {
            walker.style.transform = "";
            return false;
          },
        });
      });
      void ctx.say(FALAS.f5LeveTablet);
      await arrived;

      goal.remove();
      walker.classList.add("done");
      void ctx.react("comemora");
      await wait(600);

      // Teaser do Ep 06: chega uma mensagem, sem nenhum fio.
      const envelope = h("div", { class: "f5-envelope", label: "Mensagem" });
      envelope.innerHTML = `<svg viewBox="0 0 24 18"><rect x="1" y="1" width="22" height="16" rx="2.5" /><path d="M2 3 L12 10 L22 3" /></svg>`;
      glassArea.append(envelope);
      void ctx.react("surpresa");
      await ctx.say(FALAS.f5Mensagem);
      await ctx.waitForNext();
    },
  };
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
