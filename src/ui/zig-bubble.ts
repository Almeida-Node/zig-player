// A "bolha" da Zig: uma janelinha redonda no canto da cena, como a câmera de
// quem apresenta. Ela toca o loop da pose base e, a cada reação, um clipe
// curto do Flow que começa e termina na mesma pose, então nada pula.
// Não há animação da Zig por código.

import type { AssetId } from "../content/assets";
import { assetUrl, placeholder } from "../core/assets";
import { h } from "../core/dom";

export type Reaction = "comemora" | "hum" | "surpresa" | "aponta";

const IDLE: AssetId = "zig-mov-parada";
const REACTIONS: Record<Reaction, AssetId> = {
  comemora: "zig-mov-comemora",
  hum: "zig-mov-hum",
  surpresa: "zig-mov-surpresa",
  aponta: "zig-mov-aponta",
};

export interface ZigBubble {
  el: HTMLElement;
  react(reaction: Reaction): Promise<void>;
}

export function createZigBubble(): ZigBubble {
  const el = h("div", { class: "zig-bubble", label: "Professora Zig" });
  const video = document.createElement("video");
  video.playsInline = true;
  video.muted = true; // as reações não têm fala; a voz vem das falas
  const label = h("div", { class: "zig-bubble-reaction" });
  el.append(video, label);

  let showingPlaceholder = false;
  const showPlaceholder = (id: AssetId) => {
    showingPlaceholder = true;
    el.classList.add("missing");
    el.replaceChildren(placeholder(id), label);
  };

  const playIdle = () => {
    if (showingPlaceholder) return;
    video.loop = true;
    video.onerror = () => showPlaceholder(IDLE);
    video.src = assetUrl(IDLE);
    video.play().catch(() => undefined);
  };
  playIdle();

  return {
    el,
    react(reaction) {
      const id = REACTIONS[reaction];
      // Sem os clipes, o marcador mostra qual reação entraria aqui.
      label.textContent = reaction;
      el.dataset.reaction = reaction;
      if (showingPlaceholder) return pause(900);
      return new Promise((resolve) => {
        const back = () => {
          playIdle();
          resolve();
        };
        video.loop = false;
        video.onended = back;
        video.onerror = back;
        video.src = assetUrl(id);
        video.play().catch(back);
      });
    },
  };
}

function pause(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
