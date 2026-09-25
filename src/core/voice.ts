// Voz da Zig. Cada fala tenta primeiro o áudio gravado com a voz oficial
// (src/content/assets.ts); se ele ainda não existe, usa a voz do aparelho em
// português como provisória. Toda fala também vira legenda em MAIÚSCULAS.

import type { Line } from "../content/falas";
import type { AssetId } from "../content/assets";
import { assetUrl } from "./assets";

export interface Caption {
  text: string;
  highlight?: string;
}

type SubtitleListener = (caption: Caption | null) => void;

let muted = false;
let currentAudio: HTMLAudioElement | null = null;
let music: HTMLAudioElement | null = null;
const missingAudio = new Set<string>();
const listeners = new Set<SubtitleListener>();

export function onSubtitle(listener: SubtitleListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function showCaption(line: Line | null): void {
  const caption = line ? { text: toCaption(line.text), highlight: line.highlight && toCaption(line.highlight) } : null;
  listeners.forEach((l) => l(caption));
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(value: boolean): void {
  muted = value;
  if (muted) stopSpeaking();
  if (music) music.muted = muted;
}

export function toCaption(text: string): string {
  return text.toLocaleUpperCase("pt-BR");
}

/** Fala a linha e resolve quando termina. */
export async function say(line: Line): Promise<void> {
  showCaption(line);
  if (muted) return wait(readingTimeMs(line.text));
  if (line.audio && (await playRecorded(line.audio))) return;
  await speakWithDevice(line.text);
}

export function stopSpeaking(): void {
  currentAudio?.pause();
  currentAudio = null;
  synth()?.cancel();
}

/** Música da série baixinha, em loop. Só começa depois de um toque. */
export function startMusic(id: AssetId): void {
  if (music || missingAudio.has(id)) return;
  const audio = new Audio(assetUrl(id));
  audio.loop = true;
  audio.volume = 0.15;
  audio.muted = muted;
  audio.onerror = () => {
    missingAudio.add(id);
    music = null;
  };
  music = audio;
  audio.play().catch(() => {
    music = null;
  });
}

export function readingTimeMs(text: string): number {
  return Math.min(900 + text.length * 55, 5000);
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function playRecorded(id: AssetId): Promise<boolean> {
  if (missingAudio.has(id) || typeof Audio === "undefined") return Promise.resolve(false);
  return new Promise((resolve) => {
    let done = false;
    const finish = (ok: boolean) => {
      if (done) return;
      done = true;
      if (!ok) missingAudio.add(id);
      resolve(ok);
    };
    stopSpeaking();
    const audio = new Audio(assetUrl(id));
    currentAudio = audio;
    audio.onended = () => finish(true);
    audio.onerror = () => finish(false);
    audio.play().catch(() => finish(false));
  });
}

function speakWithDevice(text: string): Promise<void> {
  const speech = synth();
  if (!speech) return wait(readingTimeMs(text));
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve();
    };
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    const voice = speech.getVoices().find((v) => v.lang.toLowerCase().startsWith("pt"));
    if (voice) utterance.voice = voice;
    utterance.onend = finish;
    utterance.onerror = finish;
    speech.cancel();
    speech.speak(utterance);
    // Alguns navegadores não disparam onend; o jogo não pode travar.
    setTimeout(finish, readingTimeMs(text) * 2);
  });
}

function synth(): SpeechSynthesis | undefined {
  return typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : undefined;
}
