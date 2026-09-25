// Voz da Zig. Enquanto as falas gravadas da série não entram no jogo, usamos a
// síntese de voz do aparelho em português. Toda fala também vira legenda em
// MAIÚSCULAS, para quem já lê acompanhar.

type SubtitleListener = (text: string) => void;

let muted = false;
const listeners = new Set<SubtitleListener>();

export function onSubtitle(listener: SubtitleListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(value: boolean): void {
  muted = value;
  if (muted) synth()?.cancel();
}

export function toCaption(text: string): string {
  return text.toLocaleUpperCase("pt-BR");
}

/** Fala o texto e resolve quando termina (ou depois de um tempo estimado). */
export function say(text: string): Promise<void> {
  listeners.forEach((l) => l(toCaption(text)));
  const estimateMs = 900 + text.length * 70;
  const speech = synth();
  if (muted || !speech) return wait(Math.min(estimateMs, 2500));

  return new Promise((resolve) => {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      resolve();
    };
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 0.95;
    utterance.pitch = 1.25;
    const voice = speech.getVoices().find((v) => v.lang.toLowerCase().startsWith("pt"));
    if (voice) utterance.voice = voice;
    utterance.onend = finish;
    utterance.onerror = finish;
    speech.cancel();
    speech.speak(utterance);
    // Alguns navegadores não disparam onend; não deixamos o jogo travar.
    setTimeout(finish, estimateMs * 1.6);
  });
}

export function stopSpeaking(): void {
  synth()?.cancel();
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function synth(): SpeechSynthesis | undefined {
  return typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : undefined;
}
