// Regras da Fase 1: a máquina aprende com os exemplos que a criança mostra.
// Exemplo errado ensina errado — e uma pessoa confere a resposta.

export type Fruit = "maca" | "banana";
/** Cesto da esquerda = maçãs, da direita = bananas. */
export type Basket = Fruit;

export interface FruitCard {
  fruit: Fruit;
  /** O cartão difícil do episódio: maçã amarelada, que engana a máquina. */
  hard?: boolean;
}

/** Quantos exemplos a criança mostra antes da primeira vez da máquina. */
export const EXAMPLES_BEFORE_MACHINE = 4;

export class Learner {
  private readonly seen: Record<Fruit, Record<Basket, number>> = {
    maca: { maca: 0, banana: 0 },
    banana: { maca: 0, banana: 0 },
  };
  private total = 0;

  /** A criança coloca um cartão num cesto: vira um exemplo, certo ou errado. */
  teach(fruit: Fruit, basket: Basket): { correct: boolean } {
    this.seen[fruit][basket]++;
    this.total++;
    return { correct: fruit === basket };
  }

  get examples(): number {
    return this.total;
  }

  get readyToTry(): boolean {
    return this.total >= EXAMPLES_BEFORE_MACHINE;
  }

  /**
   * A máquina procura a pista mais parecida com o que viu. O cartão difícil
   * parece banana pela cor, então ela erra — é o momento da pessoa conferir.
   */
  predict(card: FruitCard): Basket {
    if (card.hard) return card.fruit === "maca" ? "banana" : "maca";
    const s = this.seen[card.fruit];
    if (s.maca === s.banana) return "maca";
    return s.maca > s.banana ? "maca" : "banana";
  }

  /** A máquina aprendeu errado alguma fruta? (mais exemplos errados que certos) */
  learnedWrong(fruit: Fruit): boolean {
    const s = this.seen[fruit];
    const other: Basket = fruit === "maca" ? "banana" : "maca";
    return s[other] > s[fruit];
  }
}

/** Baralho que alterna as frutas sem ficar previsível demais. */
export function* deck(): Generator<Fruit> {
  const pattern: Fruit[] = ["maca", "banana", "banana", "maca", "banana", "maca"];
  for (let i = 0; ; i++) yield pattern[i % pattern.length]!;
}
