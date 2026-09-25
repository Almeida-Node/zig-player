// Utilidades de desenho da "camada da descoberta" (nunca da Zig).

const SVG_NS = "http://www.w3.org/2000/svg";

export function svg(tag: string, attrs: Record<string, string | number> = {}): SVGElement {
  const el = document.createElementNS(SVG_NS, tag) as SVGElement;
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
}

export function starPoints(cx: number, cy: number, r: number): string {
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : r * 0.45;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    points.push(`${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`);
  }
  return points.join(" ");
}

/** Estrela dourada da série, como grupo SVG. */
export function starShape(cx: number, cy: number, r: number, cls: string): SVGElement {
  const g = svg("g", { class: cls });
  g.append(svg("polygon", { points: starPoints(cx, cy, r) }));
  return g;
}

/** Estrela dourada como elemento HTML (para arrastar). */
export function starElement(cls: string, label = "Estrela"): HTMLElement {
  const el = document.createElement("div");
  el.className = cls;
  el.setAttribute("aria-label", label);
  el.innerHTML = `<svg viewBox="-5 -5 10 10"><polygon points="${starPoints(0, 0, 4.5)}" /></svg>`;
  return el;
}

/** Converte um ponto da tela para as unidades do viewBox de um SVG. */
export function toViewBox(el: Element, width: number, height: number, clientX: number, clientY: number) {
  const r = el.getBoundingClientRect();
  return { x: ((clientX - r.left) / r.width) * width, y: ((clientY - r.top) / r.height) * height };
}

/** Posiciona um elemento absoluto em % de uma área com viewBox width×height. */
export function placeAt(el: HTMLElement, p: { x: number; y: number }, width: number, height: number) {
  el.style.left = `${(p.x / width) * 100}%`;
  el.style.top = `${(p.y / height) * 100}%`;
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Uma fala por vez: toques rápidos não empilham falas. */
export function speaker(say: (line: import("../content/falas").Line) => Promise<void>) {
  let busy = false;
  return {
    get busy() {
      return busy;
    },
    /** Fala agora, interrompendo o que estiver tocando. */
    async now(line: import("../content/falas").Line) {
      busy = true;
      await say(line);
      busy = false;
    },
    /** Fala só se a Zig não estiver falando. */
    async ifFree(line: import("../content/falas").Line) {
      if (busy) return;
      await this.now(line);
    },
  };
}
