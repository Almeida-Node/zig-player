import { describe, expect, it } from "vitest";
import { ASSETS } from "../src/content/assets";
import { FALAS } from "../src/content/falas";
import { PHASES, nextPhase } from "../src/content/fases";
import { render } from "../src/ui/caption";

describe("conteúdo", () => {
  it("cada arte tem um arquivo próprio", () => {
    const files = Object.values(ASSETS).map((a) => a.file);
    expect(new Set(files).size).toBe(files.length);
  });

  it("títulos das fases em MAIÚSCULAS com acentos, terminando em pergunta", () => {
    for (const p of PHASES) {
      expect(p.title).toBe(p.title.toLocaleUpperCase("pt-BR"));
      expect(p.title.endsWith("?")).toBe(true);
    }
  });

  it("o teaser da Fase 4 é o título do Ep 05", () => {
    expect(nextPhase(4)?.title).toBe("O MAPA SABE ONDE ESTOU?");
  });

  it("a palavra destacada existe na fala", () => {
    for (const line of Object.values(FALAS)) {
      if ("highlight" in line) expect(line.text).toContain(line.highlight);
    }
  });

  it("legenda em MAIÚSCULAS com a palavra em ciano", () => {
    const el = document.createElement("div");
    render(el, { text: "O LÁPIS, ELA NÃO SENTE!", highlight: "LÁPIS" });
    expect(el.textContent).toBe("O LÁPIS, ELA NÃO SENTE!");
    expect(el.querySelector(".cyan")?.textContent).toBe("LÁPIS");
  });
});
