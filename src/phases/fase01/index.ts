// Fase 1 — Como a IA aprende? (Ep 01)
// A criança ensina a máquina curiosa colocando cartões de maçã e banana nos
// cestos. Depois de alguns exemplos, a máquina tenta sozinha, procurando
// pistas (feixe ciano). Exemplo errado ensina errado; uma pessoa confere.

import type { AssetId } from "../../content/assets";
import { FALAS } from "../../content/falas";
import { imageSlot } from "../../core/assets";
import { h } from "../../core/dom";
import { isInside, makeDraggable } from "../../core/drag";
import type { PhaseContext, PhaseFlow, PhaseScript } from "../../game/types";
import { speaker, wait } from "../shared";
import { EXAMPLES_BEFORE_MACHINE, Learner, deck, type Basket, type Fruit, type FruitCard } from "./logic";

const CARD: Record<Fruit, AssetId> = { maca: "f1-cartao-maca", banana: "f1-cartao-banana" };

export const fase01: PhaseScript = {
  testIds: ["maca", "banana", "errado"],
  mount: (ctx) => mountFase01(ctx),
};

function mountFase01(ctx: PhaseContext): PhaseFlow {
  const learner = new Learner();
  const cards = deck();
  const zig = speaker(ctx.say);

  const scene = h("div", { class: "f1-scene" });
  const machine = h("div", { class: "f1-machine" });
  const lights = h("div", { class: "f1-lights", label: "O que a máquina já aprendeu" });
  for (let i = 0; i < EXAMPLES_BEFORE_MACHINE; i++) lights.append(h("span", { class: "f1-light" }));
  const scanner = h("div", { class: "f1-scanner" });
  machine.append(imageSlot("f1-maquina", "f1-machine-img"), lights, scanner);

  const baskets = {} as Record<Basket, { el: HTMLElement; pile: HTMLElement }>;
  const basketRow = h("div", { class: "f1-baskets" });
  for (const fruit of ["maca", "banana"] as const) {
    const pile = h("div", { class: "f1-pile" });
    const el = h("div", { class: `f1-basket ${fruit}`, label: fruit === "maca" ? "Cesto das maçãs" : "Cesto das bananas" }, [
      imageSlot("f1-cesto", "f1-basket-img"),
      imageSlot(CARD[fruit], "f1-basket-tag"),
      pile,
    ]);
    baskets[fruit] = { el, pile };
    basketRow.append(el);
  }
  const deckArea = h("div", { class: "f1-deck" });
  scene.append(imageSlot("f1-cenario", "scene-bg"), machine, basketRow, deckArea);
  ctx.stage.append(scene);

  const basketAt = (x: number, y: number): Basket | null => {
    for (const fruit of ["maca", "banana"] as const) if (isInside(baskets[fruit].el, x, y, 12)) return fruit;
    return null;
  };

  const drop = (fruit: Fruit, basket: Basket, hard = false) => {
    const mini = imageSlot(hard ? "f1-cartao-dificil" : CARD[fruit], "f1-mini");
    baskets[basket].pile.append(mini);
    return mini;
  };

  const updateLights = () =>
    [...lights.children].forEach((l, i) => l.classList.toggle("on", i < learner.examples));

  /** A vez da máquina: o cartão aparece, o feixe ciano procura pistas e ela escolhe. */
  const machineTurn = async (card: FruitCard) => {
    const shown = imageSlot(card.hard ? "f1-cartao-dificil" : CARD[card.fruit], "f1-scan-card");
    scanner.replaceChildren(shown, h("div", { class: "f1-beam" }));
    scanner.classList.add("on");
    await wait(1600);
    const choice = learner.predict(card);
    scanner.classList.remove("on");
    scanner.replaceChildren();
    const mini = drop(card.fruit, choice, card.hard);
    return { choice, correct: choice === card.fruit, mini };
  };

  let resolveDiscovery: () => void = () => undefined;
  const discovery = new Promise<void>((resolve) => (resolveDiscovery = resolve));
  let teaching = false;
  let machineTurns = 0;

  const dealCard = () => {
    if (!teaching) return;
    const fruit = cards.next().value as Fruit;
    const card = h("div", { class: "f1-card", label: fruit === "maca" ? "Cartão de maçã" : "Cartão de banana" });
    card.append(imageSlot(CARD[fruit]));
    deckArea.replaceChildren(card);
    const stop = makeDraggable(card, {
      onDrop: (x, y) => {
        const basket = basketAt(x, y);
        if (!basket) return false;
        stop();
        card.remove();
        void teach(fruit, basket);
        return true;
      },
    });
  };

  const teach = async (fruit: Fruit, basket: Basket) => {
    const { correct } = learner.teach(fruit, basket);
    drop(fruit, basket);
    updateLights();
    ctx.tried(fruit);
    if (!correct) {
      ctx.tried("errado");
      void ctx.react("hum");
      await zig.ifFree(FALAS.f1ExemploErrado);
    }
    if (!learner.readyToTry) return dealCard();

    // A máquina tenta sozinha com um cartão novo.
    await zig.now(FALAS.f1VezMaquina);
    const fruitForMachine = cards.next().value as Fruit;
    const result = await machineTurn({ fruit: fruitForMachine });
    machineTurns++;
    if (result.correct) {
      void ctx.react(machineTurns === 1 ? "surpresa" : "comemora");
      await zig.now(FALAS.f1Acertou);
    } else {
      result.mini.classList.add("wrong");
      void ctx.react("hum");
      await zig.now(FALAS.f1AprendeuErrado);
    }
    if (machineTurns === 1) resolveDiscovery(); // o clipe 2 explica a descoberta
    dealCard();
  };

  return {
    async question() {
      await ctx.playClip("f1-clipe-pergunta", [FALAS.f1Pergunta]);
      await ctx.waitForNext();
    },

    async explore() {
      scene.classList.add("teaching");
      void ctx.react("aponta");
      await zig.now(FALAS.f1Ensine);
      teaching = true;
      dealCard();
      await discovery;
      await ctx.waitForNext();
      teaching = false;
      deckArea.replaceChildren();
      scene.classList.remove("teaching");
      await ctx.playClip("f1-clipe-descoberta", [FALAS.f1Descoberta]);
    },

    async answer() {
      await ctx.playClip("f1-clipe-resposta", [FALAS.f1Confere]);

      // O cartão difícil: a máquina erra, e a criança confere e corrige.
      const { mini } = await machineTurn({ fruit: "maca", hard: true });
      mini.remove();
      const hard = h("div", { class: "f1-card hard", label: "Cartão difícil" });
      hard.append(imageSlot("f1-cartao-dificil"));
      baskets.banana.el.append(hard);
      void ctx.react("hum");
      const fixed = new Promise<void>((resolve) => {
        const stop = makeDraggable(hard, {
          onDrop: (x, y) => {
            if (basketAt(x, y) !== "maca") return false;
            stop();
            hard.remove();
            drop("maca", "maca", true).classList.add("fixed");
            resolve();
            return true;
          },
        });
      });
      void ctx.say(FALAS.f1Corrija); // o cartão já pode ser arrastado enquanto ela fala
      await fixed;

      void ctx.react("comemora");
      await ctx.say(FALAS.f1Pista);
      await ctx.waitForNext();
    },
  };
}
