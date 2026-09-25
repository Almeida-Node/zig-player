// Fase 3 — Quem mora dentro da tela? (Ep 03)
// A criança leva a lupa até a tela da borboleta: de perto, a imagem vira
// pontinhos vermelhos, verdes e azuis (pixels). Na resposta, afasta a lupa
// devagar e os pontos se juntam até a borboleta aparecer inteira.

import { FALAS } from "../../content/falas";
import { assetUrl, imageSlot } from "../../core/assets";
import { h } from "../../core/dom";
import { isInside, makeDraggable } from "../../core/drag";
import type { PhaseContext, PhaseFlow, PhaseScript } from "../../game/types";
import { speaker, wait } from "../shared";
import { CHANNELS, Magnifier, pixelSize, subpixels } from "./logic";

/** Resolução da imagem na tela: cada célula vira um pixel com 3 pontinhos. */
const SCREEN_W = 48;
const SCREEN_H = 64;
/** Quantos pixels aparecem dentro da lupa (de lado a lado). */
const LENS_PIXELS = 5;
/** Tamanho do pixel no começo da resposta (a tela bem de perto). */
const CLOSEST = 8;

export const fase03: PhaseScript = {
  testIds: CHANNELS,
  mount: (ctx) => mountFase03(ctx),
};

function mountFase03(ctx: PhaseContext): PhaseFlow {
  const zig = speaker(ctx.say);
  const lupa = new Magnifier();

  const scene = h("div", { class: "f3-scene" });
  const screen = h("div", { class: "f3-screen" });
  const view = document.createElement("canvas");
  view.className = "f3-view";
  view.width = SCREEN_W * 6;
  view.height = SCREEN_H * 6;
  screen.append(view);
  const lens = document.createElement("canvas");
  lens.className = "f3-lens";
  lens.width = lens.height = 200;
  const tool = h("div", { class: "f3-tool", label: "Lupa" }, [imageSlot("f3-lupa")]);
  scene.append(imageSlot("f3-cenario", "scene-bg"), screen, lens, tool);
  ctx.stage.append(scene);

  // Pixels da imagem: a arte oficial, ou um padrão neutro enquanto ela não chega.
  const source = document.createElement("canvas");
  source.width = SCREEN_W;
  source.height = SCREEN_H;
  const src = source.getContext("2d", { willReadFrequently: true });
  let pixels: Uint8ClampedArray = new Uint8ClampedArray(SCREEN_W * SCREEN_H * 4);

  const readPixels = () => {
    if (src) pixels = src.getImageData(0, 0, SCREEN_W, SCREEN_H).data;
  };
  const drawFallback = () => {
    if (!src) return;
    src.fillStyle = "#101530";
    src.fillRect(0, 0, SCREEN_W, SCREEN_H);
    const blobs: [number, number, number, string][] = [
      [14, 22, 11, "#e8322a"],
      [34, 22, 11, "#2ecc55"],
      [24, 44, 12, "#2f6bff"],
    ];
    for (const [x, y, r, c] of blobs) {
      src.fillStyle = c;
      src.beginPath();
      src.arc(x, y, r, 0, Math.PI * 2);
      src.fill();
    }
    screen.classList.add("missing");
    screen.dataset.marker = "fase03/borboleta.png";
    readPixels();
    render(1);
  };
  const img = new Image();
  img.onload = () => {
    src?.drawImage(img, 0, 0, SCREEN_W, SCREEN_H);
    readPixels();
    render(1);
  };
  img.onerror = drawFallback;
  img.src = assetUrl("f3-borboleta");

  const colorAt = (px: number, py: number): [number, number, number] => {
    const x = Math.min(SCREEN_W - 1, Math.max(0, Math.floor(px)));
    const y = Math.min(SCREEN_H - 1, Math.max(0, Math.floor(py)));
    const i = (y * SCREEN_W + x) * 4;
    return [pixels[i] ?? 0, pixels[i + 1] ?? 0, pixels[i + 2] ?? 0];
  };

  /** Desenha a tela com pixels do tamanho pedido (1 = imagem inteira, lisa). */
  function render(size: number) {
    const g = view.getContext("2d");
    if (!g) return;
    g.imageSmoothingEnabled = size <= 1;
    g.fillStyle = "#000";
    g.fillRect(0, 0, view.width, view.height);
    if (size <= 1) {
      g.drawImage(source, 0, 0, view.width, view.height);
      return;
    }
    const cell = (view.width / SCREEN_W) * size;
    for (let y = 0; y < SCREEN_H; y += size)
      for (let x = 0; x < SCREEN_W; x += size) {
        const rgb = colorAt(x + size / 2, y + size / 2);
        const left = (x / SCREEN_W) * view.width;
        const top = (y / SCREEN_H) * view.height;
        if (size >= 4) drawSubpixels(g, rgb, left, top, cell);
        else {
          g.fillStyle = `rgb(${rgb.join(",")})`;
          g.fillRect(left, top, cell, cell);
        }
      }
  }

  /** Dentro da lupa: cada pixel vira três pontinhos de luz, vermelho, verde e azul. */
  const renderLens = (px: number, py: number) => {
    const g = lens.getContext("2d");
    if (!g) return;
    const cell = lens.width / LENS_PIXELS;
    g.fillStyle = "#05060d";
    g.fillRect(0, 0, lens.width, lens.height);
    const x0 = Math.floor(px - LENS_PIXELS / 2);
    const y0 = Math.floor(py - LENS_PIXELS / 2);
    for (let j = 0; j < LENS_PIXELS; j++)
      for (let i = 0; i < LENS_PIXELS; i++) drawSubpixels(g, colorAt(x0 + i, y0 + j), i * cell, j * cell, cell);
  };

  /** Ponto da tela sob o vidro da lupa (o vidro fica no alto-esquerda da arte). */
  const glassPoint = () => {
    const r = tool.getBoundingClientRect();
    return { x: r.left + r.width * 0.38, y: r.top + r.height * 0.38 };
  };

  const showLens = (clientX: number, clientY: number) => {
    const sr = screen.getBoundingClientRect();
    const scr = scene.getBoundingClientRect();
    lens.style.left = `${clientX - scr.left}px`;
    lens.style.top = `${clientY - scr.top}px`;
    if (!isInside(screen, clientX, clientY)) {
      lens.classList.remove("on");
      return null;
    }
    const px = ((clientX - sr.left) / sr.width) * SCREEN_W;
    const py = ((clientY - sr.top) / sr.height) * SCREEN_H;
    renderLens(px, py);
    lens.classList.add("on");
    return colorAt(px, py);
  };

  let exploring = false;
  let resolveDiscovery: () => void = () => undefined;
  const discovery = new Promise<void>((resolve) => (resolveDiscovery = resolve));
  let hinted = false;
  let praised = false;

  const look = async () => {
    const p = glassPoint();
    const rgb = showLens(p.x, p.y);
    if (!rgb || !exploring) return;
    const { channel, first, newColor } = lupa.look(...rgb);
    if (newColor) ctx.tried(channel);
    if (first) {
      void ctx.react("surpresa");
      resolveDiscovery(); // o clipe 2 diz o nome: pixels
      await wait(2500);
      if (!hinted && !lupa.allColors) {
        hinted = true;
        await zig.ifFree(FALAS.f3Cores);
      }
    } else if (lupa.allColors && !praised) {
      praised = true;
      void ctx.react("comemora");
      await zig.ifFree(FALAS.f3TresCores);
    }
  };

  let lastLook = 0;
  const stopDrag = makeDraggable(tool, {
    onMove: () => {
      const now = performance.now();
      if (now - lastLook < 60) return;
      lastLook = now;
      void look();
    },
    onDrop: () => {
      void look();
      return true; // a lupa fica onde a criança deixou
    },
  });

  return {
    async question() {
      await ctx.playClip("f3-clipe-pergunta", [FALAS.f3Pergunta]);
      await ctx.waitForNext();
    },

    async explore() {
      exploring = true;
      tool.classList.add("show");
      void ctx.react("aponta");
      await zig.now(FALAS.f3UseLupa);
      await discovery;
      await ctx.waitForNext();
      exploring = false;
      stopDrag();
      tool.classList.remove("show");
      lens.classList.remove("on");
      await ctx.playClip("f3-clipe-descoberta", [FALAS.f3Pixels]);
    },

    async answer() {
      // De perto: a tela inteira em pixels grandes. A criança afasta a lupa devagar.
      render(pixelSize(0, CLOSEST));
      const grip = h("div", { class: "f3-tool away", label: "Lupa" }, [imageSlot("f3-lupa")]);
      scene.append(grip);
      const apart = new Promise<void>((resolve) => {
        let startY: number | null = null;
        const stop = makeDraggable(grip, {
          onMove: (_x, y) => {
            startY ??= y;
            const progress = (y - startY) / (screen.getBoundingClientRect().height * 0.6);
            render(pixelSize(progress, CLOSEST));
            if (progress >= 1) {
              stop();
              resolve();
            }
          },
          onDrop: () => true,
        });
      });
      void ctx.say(FALAS.f3Afaste);
      await apart;

      render(1);
      screen.classList.add("reveal");
      void ctx.react("comemora");
      await ctx.playClip("f3-clipe-resposta", [FALAS.f3Resposta]);
      await ctx.waitForNext();
    },
  };
}

/** Um pixel de perto: três pontinhos de luz, vermelho, verde e azul. */
function drawSubpixels(
  g: CanvasRenderingContext2D,
  rgb: [number, number, number],
  left: number,
  top: number,
  cell: number,
) {
  const [r, gg, b] = subpixels(...rgb);
  const bar = cell / 3;
  const colors: [string, number][] = [
    ["255,40,40", r],
    ["40,255,80", gg],
    ["60,110,255", b],
  ];
  g.fillStyle = "#05060d";
  g.fillRect(left, top, cell, cell);
  colors.forEach(([color, a], k) => {
    g.fillStyle = `rgba(${color},${0.08 + a * 0.92})`;
    g.beginPath();
    g.roundRect(left + k * bar + bar * 0.18, top + cell * 0.12, bar * 0.64, cell * 0.76, bar * 0.3);
    g.fill();
  });
}
