import { ASSETS, type AssetId } from "../content/assets";
import { h } from "./dom";

export function assetUrl(id: AssetId): string {
  return `${import.meta.env.BASE_URL}arte/${ASSETS[id].file}`;
}

/** Marcador neutro para arte que ainda não chegou. Nunca imita a Zig. */
export function placeholder(id: AssetId): HTMLElement {
  const spec = ASSETS[id];
  const icon = spec.kind === "video" ? "🎬" : spec.kind === "audio" ? "🔊" : "🖼️";
  return h("div", { class: "placeholder", label: spec.what }, [
    h("span", { class: "placeholder-icon", text: icon }),
    h("span", { class: "placeholder-file", text: spec.file }),
    h("span", { class: "placeholder-what", text: spec.what }),
  ]);
}

export function imageSlot(id: AssetId, className = ""): HTMLElement {
  const slot = h("div", { class: `slot ${className}`.trim() });
  slot.dataset.asset = id;
  const img = new Image();
  img.alt = "";
  img.draggable = false;
  img.onerror = () => {
    slot.classList.add("missing");
    slot.replaceChildren(placeholder(id));
  };
  img.src = assetUrl(id);
  slot.append(img);
  return slot;
}

export interface VideoSlot {
  el: HTMLElement;
  /** Toca até o fim. Resolve false se o vídeo não existe ou não pôde tocar. */
  play(muted: boolean): Promise<boolean>;
}

export function videoSlot(id: AssetId, className = ""): VideoSlot {
  const slot = h("div", { class: `slot video ${className}`.trim() });
  slot.dataset.asset = id;
  const video = document.createElement("video");
  video.playsInline = true;
  video.preload = "auto";
  let missing = false;
  const markMissing = () => {
    if (missing) return;
    missing = true;
    slot.classList.add("missing");
    slot.replaceChildren(placeholder(id));
  };
  video.onerror = markMissing;
  video.src = assetUrl(id);
  slot.append(video);

  return {
    el: slot,
    play(muted) {
      if (missing) return Promise.resolve(false);
      return new Promise((resolve) => {
        video.muted = muted;
        video.onended = () => resolve(true);
        video.onerror = () => {
          markMissing();
          resolve(false);
        };
        video.play().catch(() => {
          markMissing();
          resolve(false);
        });
      });
    },
  };
}
