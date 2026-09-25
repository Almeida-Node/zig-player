// Fase 4 — Por que a tela me escuta? (Ep 04)
// A criança leva dedo, lápis, luva e borracha até o tablet. Só o dedo faz a
// rede ciano embaixo do vidro acender no ponto tocado e surgir a estrela.

import { FALAS } from "../../content/falas";
import { imageSlot } from "../../core/assets";
import { h } from "../../core/dom";
import { isInside, makeDraggable } from "../../core/drag";
import type { PhaseContext, PhaseFlow, PhaseScript } from "../../game/types";
import { GRID, OBJECTS, OBJECT_IDS, TouchLab, fitsSlot, gridLines, nearestNode, type ObjectId } from "./logic";

const SVG_NS = "http://www.w3.org/2000/svg";
const CONSTELLATION = [
  { x: 10, y: 12 },
  { x: 22, y: 7 },
  { x: 38, y: 11 },
  { x: 50, y: 6 },
];
const SLOT = { x: 30, y: 24 };

export const fase04: PhaseScript = {
  testIds: OBJECT_IDS,
  mount: (ctx) => mountFase04(ctx),
};

function mountFase04(ctx: PhaseContext): PhaseFlow {
  const lab = new TouchLab();
  const scene = h("div", { class: "f4-scene" });
  const tablet = h("div", { class: "f4-tablet" });
  const glassArea = h("div", { class: "f4-glass-area" });
  const glass = svg("svg", { viewBox: `0 0 ${GRID.width} ${GRID.height}`, class: "f4-glass" });
  glassArea.append(glass);
  const tray = h("div", { class: "f4-tray" });
  scene.append(imageSlot("f4-cenario", "scene-bg"), tablet, tray);
  tablet.append(imageSlot("f4-tablet", "f4-tablet-img"), glassArea);
  ctx.stage.append(scene);

  // Rede embaixo do vidro: invisível, e acesa só perto do toque (máscara).
  const defs = svg("defs");
  const gradient = svg("radialGradient", { id: "f4-fade" });
  gradient.append(svg("stop", { offset: "0%", "stop-color": "#fff" }), svg("stop", { offset: "100%", "stop-color": "#000" }));
  const mask = svg("mask", { id: "f4-mask" });
  const spot = svg("circle", { cx: "-50", cy: "-50", r: "16", fill: "url(#f4-fade)" });
  mask.append(spot);
  defs.append(gradient, mask);
  const litGrid = svg("g", { class: "f4-grid-lit", mask: "url(#f4-mask)" });
  const { xs, ys } = gridLines();
  for (const x of xs) litGrid.append(svg("line", { x1: x, y1: 0, x2: x, y2: GRID.height }));
  for (const y of ys) litGrid.append(svg("line", { x1: 0, y1: y, x2: GRID.width, y2: y }));
  const effects = svg("g");
  glass.append(defs, litGrid, effects);

  let lastStar = { x: 30, y: 50 };
  let speaking = false;
  const speakIfFree = async (line: (typeof FALAS)[keyof typeof FALAS]) => {
    if (speaking) return;
    speaking = true;
    await ctx.say(line);
    speaking = false;
  };

  const toGlass = (clientX: number, clientY: number) => {
    const r = glass.getBoundingClientRect();
    return {
      x: ((clientX - r.left) / r.width) * GRID.width,
      y: ((clientY - r.top) / r.height) * GRID.height,
    };
  };

  const lightAt = (x: number, y: number) => {
    const node = nearestNode(x, y);
    spot.setAttribute("cx", String(node.x));
    spot.setAttribute("cy", String(node.y));
    litGrid.classList.add("on");
    return node;
  };

  const ripple = (x: number, y: number, cls: string) => {
    const ring = svg("circle", { cx: x, cy: y, r: 2, class: cls });
    effects.append(ring);
    setTimeout(() => ring.remove(), 900);
  };

  const touch = async (id: ObjectId, clientX: number, clientY: number) => {
    const p = toGlass(clientX, clientY);
    const outcome = lab.touch(id);
    ctx.tried(id);
    if (outcome.lights) {
      const node = lightAt(p.x, p.y);
      ripple(node.x, node.y, "f4-ripple");
      effects.append(starShape(node.x, node.y, 4, "f4-star pop"));
      lastStar = { x: node.x, y: node.y };
      if (outcome.firstDiscovery) {
        void ctx.react("surpresa");
        speaking = true;
        await ctx.say(FALAS.f4Rede);
        speaking = false;
        resolveDiscovery();
      } else {
        void ctx.react("comemora");
      }
    } else {
      litGrid.classList.remove("on");
      ripple(p.x, p.y, "f4-thud");
      void ctx.react("hum");
      await speakIfFree(outcome.afterDiscovery && id === "lapis" ? FALAS.f4Lapis : FALAS.hum);
    }
  };

  let resolveDiscovery: () => void = () => undefined;
  const discovery = new Promise<void>((resolve) => (resolveDiscovery = resolve));

  // Tocar o vidro com o próprio dedo também é o teste do dedo.
  const onGlassTap = (e: PointerEvent) => {
    if (!tablet.classList.contains("testing")) return;
    void touch("dedo", e.clientX, e.clientY);
  };
  glass.addEventListener("pointerdown", onGlassTap);

  const cleanups: (() => void)[] = [];
  for (const object of OBJECTS) {
    const item = h("div", { class: "f4-object", label: object.label });
    item.dataset.object = object.id;
    item.append(imageSlot(object.asset));
    tray.append(item);
    cleanups.push(
      makeDraggable(item, {
        onDrop: (x, y) => {
          if (isInside(glass, x, y)) void touch(object.id, x, y);
          return false; // o objeto sempre volta para a bandeja
        },
      }),
    );
  }

  return {
    async question() {
      await ctx.playClip("f4-clipe-pergunta", FALAS.f4Pergunta);
      await ctx.waitForNext();
    },

    async explore() {
      tablet.classList.add("testing");
      tray.classList.add("show");
      void ctx.react("aponta");
      speaking = true;
      await ctx.say(FALAS.f4Testar);
      speaking = false;
      await discovery;
      await ctx.waitForNext();
      tablet.classList.remove("testing");
      tray.classList.remove("show");
      cleanups.forEach((c) => c());
      await ctx.playClip("f4-clipe-descoberta", FALAS.f4Clipe2);
    },

    async answer() {
      await ctx.playClip("f4-clipe-resposta", FALAS.f4Clipe3);
      await ctx.say(FALAS.f4Resposta);

      // A criança repete o gesto: leva a estrela até a constelação.
      const sky = svg("g", { class: "f4-sky" });
      const all = [...CONSTELLATION, SLOT];
      for (let i = 0; i < all.length - 1; i++) {
        const a = all[i]!;
        const b = all[i + 1]!;
        sky.append(svg("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y }));
      }
      for (const s of CONSTELLATION) sky.append(starShape(s.x, s.y, 2.6, "f4-star"));
      sky.append(svg("circle", { cx: SLOT.x, cy: SLOT.y, r: 4, class: "f4-slot" }));
      effects.replaceChildren(sky);

      const star = h("div", { class: "f4-drag-star", label: "Estrela" });
      star.innerHTML = `<svg viewBox="-5 -5 10 10">${starPath(0, 0, 4.5)}</svg>`;
      placeInGlass(star, lastStar);
      glassArea.append(star);
      lightAt(lastStar.x, lastStar.y);
      void ctx.say(FALAS.f4LeveEstrela);

      await new Promise<void>((resolve) => {
        const stop = makeDraggable(star, {
          onMove: (x, y) => {
            const p = toGlass(x, y);
            lightAt(p.x, p.y); // a rede acende seguindo o dedo
          },
          onDrop: (x, y) => {
            const p = toGlass(x, y);
            if (!fitsSlot(p.x, p.y, SLOT)) return false;
            stop();
            star.style.transition = "none";
            star.style.transform = "";
            placeInGlass(star, SLOT);
            resolve();
            return true;
          },
        });
      });

      sky.classList.add("joined");
      void ctx.react("comemora");
      await wait(1200);
      litGrid.classList.remove("on");
      star.remove();
      const map = h("div", { class: "f4-map" });
      map.append(imageSlot("f4-mapa"), h("div", { class: "f4-blue-dot" }));
      glassArea.append(map);
      void ctx.react("surpresa");
      await ctx.say(FALAS.f4Mapa);
      await ctx.waitForNext();
    },
  };
}

function placeInGlass(el: HTMLElement, p: { x: number; y: number }) {
  el.style.left = `${(p.x / GRID.width) * 100}%`;
  el.style.top = `${(p.y / GRID.height) * 100}%`;
}

function starPath(cx: number, cy: number, r: number): string {
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : r * 0.45;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    points.push(`${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`);
  }
  return `<polygon points="${points.join(" ")}" />`;
}

function starShape(cx: number, cy: number, r: number, cls: string): SVGElement {
  const g = svg("g", { class: cls });
  g.innerHTML = starPath(cx, cy, r);
  return g;
}

function svg(tag: string, attrs: Record<string, string | number> = {}): SVGElement {
  const el = document.createElementNS(SVG_NS, tag) as SVGElement;
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
