// Tela inicial: a Zig, as estrelas da criança e as fases (ícones grandes).
import { FALAS } from "../content/falas";
import { PHASES, PLAYABLE_IDS, type PhaseInfo } from "../content/fases";
import { imageSlot } from "../core/assets";
import { h, iconButton } from "../core/dom";
import { isUnlocked, tailGlowLevel, totalStars, type Progress } from "../core/progress";
import { say } from "../core/voice";
import { captionBar } from "./caption";
import { muteButton } from "./mute";

export function renderHome(root: HTMLElement, progress: Progress, onPlay: (phase: PhaseInfo) => void): void {
  const stars = totalStars(progress);
  const glow = tailGlowLevel(progress);

  const collection = h("div", { class: "collection", label: `${stars} estrelas` });
  for (let i = 0; i < stars; i++) collection.append(h("span", { class: "collected-star", text: "⭐" }));
  for (let i = 0; i < glow; i++) collection.append(h("span", { class: "tail-glow", text: "✨" }));

  const list = h("div", { class: "phase-list" });
  for (const phase of PHASES) {
    const playable = Boolean(phase.script);
    const unlocked = playable && isUnlocked(progress, phase.id, PLAYABLE_IDS);
    const done = progress.phases[phase.id]?.discovery === true;
    const state = !playable ? "soon" : unlocked ? "open" : "locked";
    const badge = state === "soon" ? "🌙" : state === "locked" ? "🔒" : done ? "⭐" : "";
    const btn = iconButton(
      `<span class="phase-icon">${phase.icon}</span><span class="phase-badge">${badge}</span>`,
      phase.title,
      () => {
        if (state === "open") onPlay(phase);
        else void say(state === "soon" ? FALAS.emBreve : FALAS.trancada);
      },
      `phase-btn ${state}`,
    );
    list.append(btn);
  }

  const zig = imageSlot("zig-acenando", "home-zig", "zig-rosto");
  zig.addEventListener("click", () => void say(FALAS.comecar));

  root.replaceChildren(
    h("div", { class: "screen home" }, [
      h("header", { class: "top-bar" }, [collection, muteButton()]),
      h("h1", { class: "title", html: 'LABORATÓRIO <span class="cyan">DA ZIG</span>' }),
      zig,
      list,
      captionBar().el,
    ]),
  );
}

export function renderPause(root: HTMLElement, onDone: () => void): void {
  root.replaceChildren(
    h("div", { class: "screen pause" }, [
      imageSlot("zig-pensando", "home-zig", "zig-rosto"),
      h("span", { class: "challenge-icon", text: "🏠🔬" }),
      captionBar().el,
      iconButton("🏠", "Voltar para o início", onDone, "next-btn static"),
    ]),
  );
  void say(FALAS.pausa);
}
