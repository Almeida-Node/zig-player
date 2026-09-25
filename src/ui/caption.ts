// Legenda no estilo "ZIG": branca, contorno preto, uma palavra em ciano.
import { h } from "../core/dom";
import { onSubtitle, type Caption } from "../core/voice";

export function captionBar(): { el: HTMLElement } {
  const el = h("div", { class: "caption" });
  el.setAttribute("aria-live", "polite");
  const off = onSubtitle((caption) => {
    if (!el.isConnected) return off(); // tela antiga: para de ouvir
    render(el, caption);
  });
  return { el };
}

export function render(el: HTMLElement, caption: Caption | null): void {
  el.replaceChildren();
  el.hidden = !caption;
  el.classList.toggle("empty", !caption);
  if (!caption) return;
  const { text, highlight } = caption;
  const at = highlight ? text.indexOf(highlight) : -1;
  if (!highlight || at < 0) {
    el.append(text);
    return;
  }
  el.append(text.slice(0, at), h("span", { class: "cyan", text: highlight }), text.slice(at + highlight.length));
}
