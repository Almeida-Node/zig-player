import { iconButton } from "../core/dom";
import { isMuted, setMuted } from "../core/voice";

export function muteButton(): HTMLButtonElement {
  const btn = iconButton(isMuted() ? "🔇" : "🔊", "Ligar ou desligar o som", () => {
    setMuted(!isMuted());
    btn.innerHTML = isMuted() ? "🔇" : "🔊";
  });
  return btn;
}
