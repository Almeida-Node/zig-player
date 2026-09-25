// Conduz uma fase pelos 5 momentos do docs/game.md:
// 1 Pergunta → 2 Testes → 3 Resposta (vêm da fase) → 4 Estrela + teaser → 5 Desafio em casa.

import { FALAS, type Line } from "../content/falas";
import { nextPhase, type PhaseInfo } from "../content/fases";
import { videoSlot } from "../core/assets";
import { h, iconButton } from "../core/dom";
import { isMuted, say, showCaption, stopSpeaking } from "../core/voice";
import { createZigBubble } from "../ui/zig-bubble";
import { captionBar } from "../ui/caption";
import { muteButton } from "../ui/mute";
import type { PhaseContext } from "./types";

export interface PhaseResult {
  allTestsTried: boolean;
}

export function runPhase(
  root: HTMLElement,
  phase: PhaseInfo,
  onFinish: (result: PhaseResult | null) => void,
): void {
  const script = phase.script;
  if (!script) throw new Error(`Fase ${phase.id} ainda não tem script`);

  const controller = new AbortController();
  const { signal } = controller;
  const tried = new Set<string>();

  const exit = () => {
    controller.abort();
    stopSpeaking();
    showCaption(null);
    onFinish(null);
  };

  const dots = h("div", { class: "moments", label: "Momentos da fase" });
  for (let i = 0; i < 5; i++) dots.append(h("span", { class: "dot" }));
  const setMoment = (n: number) =>
    [...dots.children].forEach((d, i) => d.classList.toggle("on", i <= n));

  const header = h("header", { class: "top-bar" }, [iconButton("🏠", "Voltar para o início", exit), dots, muteButton()]);
  const stage = h("div", { class: "stage" });
  const bubble = createZigBubble();
  const next = iconButton("▶", "Continuar", () => undefined, "next-btn");
  next.hidden = true;
  const overlay = h("div", { class: "overlay" });
  overlay.hidden = true;
  const caption = captionBar();
  const screen = h("div", { class: "screen phase" }, [header, stage, bubble.el, caption.el, next, overlay]);
  root.replaceChildren(screen);

  // Promessas de uma fase cancelada ficam pendentes para sempre: nada roda depois de sair.
  const guard = <T>(p: Promise<T>): Promise<T> => (signal.aborted ? new Promise<T>(() => undefined) : p.then((v) => (signal.aborted ? new Promise<T>(() => undefined) : v)));

  const playClip = async (id: Parameters<PhaseContext["playClip"]>[0], lines: readonly Line[]) => {
    const clip = videoSlot(id, "clip");
    overlay.replaceChildren(clip.el);
    overlay.hidden = false;
    const joined: Line = { text: lines.map((l) => l.text).join(" "), highlight: lines[0]?.highlight };
    showCaption(joined);
    const played = await clip.play(isMuted());
    if (!played) for (const line of lines) await say(line); // sem o clipe: marcador + as mesmas falas
    showCaption(null);
    overlay.hidden = true;
    overlay.replaceChildren();
  };

  const waitForNext = () =>
    new Promise<void>((resolve) => {
      next.hidden = false;
      next.onclick = () => {
        next.hidden = true;
        next.onclick = null;
        resolve();
      };
    });

  const ctx: PhaseContext = {
    stage,
    signal,
    say: (line) => guard(say(line)),
    playClip: (id, lines) => guard(playClip(id, lines)),
    react: (r) => guard(bubble.react(r)),
    waitForNext: () => guard(waitForNext()),
    hideNext: () => (next.hidden = true),
    tried: (id) => tried.add(id),
  };

  const flow = script.mount(ctx);

  void (async () => {
    setMoment(0);
    await flow.question();
    setMoment(1);
    await flow.explore();
    setMoment(2);
    await flow.answer();

    // 4. Estrela de descoberta (+ estrela extra por testar tudo) e teaser.
    setMoment(3);
    const allTestsTried = script.testIds.every((id) => tried.has(id));
    const stars = h("div", { class: "reward" });
    stars.append(h("span", { class: "reward-star", text: "⭐" }));
    overlay.replaceChildren(stars);
    overlay.hidden = false;
    void ctx.react("comemora");
    await ctx.say(FALAS.estrela);
    if (allTestsTried) {
      stars.append(h("span", { class: "reward-star extra", text: "🌟" }));
      await ctx.say(FALAS.exploradora);
    }
    await ctx.waitForNext();

    const upcoming = nextPhase(phase.id);
    if (upcoming) {
      // A vinheta entra sem som: o jogo não convida a criança a seguir perfis.
      const vinheta = videoSlot("vinheta", "clip");
      overlay.replaceChildren(
        vinheta.el,
        h("div", { class: "teaser" }, [h("span", { class: "teaser-label", text: "AMANHÃ:" }), h("span", { class: "teaser-title", text: upcoming.title })]),
      );
      void vinheta.play(true);
      await ctx.say({ text: `Amanhã: ${upcoming.title.toLocaleLowerCase("pt-BR")}` });
      await ctx.say(FALAS.amanha);
      await ctx.waitForNext();
    }

    // 5. Desafio em casa, sempre com um adulto.
    setMoment(4);
    overlay.replaceChildren(
      h("div", { class: "challenge" }, [
        h("span", { class: "challenge-icon", text: "🏠🔬" }),
        h("p", { class: "challenge-text", text: (phase.challenge?.text ?? "").toLocaleUpperCase("pt-BR") }),
      ]),
    );
    await ctx.say(FALAS.desafio);
    if (phase.challenge) await ctx.say(phase.challenge);
    await ctx.waitForNext();

    if (signal.aborted) return;
    showCaption(null);
    onFinish({ allTestsTried });
  })();
}
