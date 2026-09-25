// Regras da Fase 3: a imagem da tela é feita de pontinhos de luz (pixels),
// cada um com um pontinho vermelho, um verde e um azul.

export type Channel = "vermelho" | "verde" | "azul";
export const CHANNELS: readonly Channel[] = ["vermelho", "verde", "azul"];

/** Qual das três luzes brilha mais neste pixel. */
export function dominantChannel(r: number, g: number, b: number): Channel {
  if (r >= g && r >= b) return "vermelho";
  if (g >= b) return "verde";
  return "azul";
}

/** Brilho de cada pontinho (0 a 1) para desenhar o pixel de perto. */
export function subpixels(r: number, g: number, b: number): [number, number, number] {
  return [r / 255, g / 255, b / 255];
}

/** Na resposta, quanto mais a criança afasta a lupa, menores ficam os pixels. */
export function pixelSize(progress: number, largest = 24): number {
  const p = Math.min(1, Math.max(0, progress));
  return Math.max(1, Math.round(largest * (1 - p) ** 2));
}

/** Guarda as cores que a criança já viu de perto com a lupa. */
export class Magnifier {
  private readonly seen = new Set<Channel>();
  private found = false;

  look(r: number, g: number, b: number): { channel: Channel; first: boolean; newColor: boolean } {
    const channel = dominantChannel(r, g, b);
    const first = !this.found;
    this.found = true;
    const newColor = !this.seen.has(channel);
    this.seen.add(channel);
    return { channel, first, newColor };
  }

  get discovered(): boolean {
    return this.found;
  }

  get allColors(): boolean {
    return CHANNELS.every((c) => this.seen.has(c));
  }
}
