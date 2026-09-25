import "@fontsource/montserrat/900.css";
import "./styles.css";
import type { PhaseInfo } from "./content/fases";
import { loadProgress, recordPhase, saveProgress } from "./core/progress";
import { startMusic } from "./core/voice";
import { runPhase } from "./game/runner";
import { renderHome, renderPause } from "./ui/home";

/** Depois de 3 fases seguidas, a Zig sugere uma pausa para o experimento de verdade. */
const PHASES_BEFORE_PAUSE = 3;

const root = document.getElementById("app")!;
let progress = loadProgress();
let phasesThisSession = 0;

function home(): void {
  renderHome(root, progress, play);
}

function play(phase: PhaseInfo): void {
  startMusic("musica"); // navegadores só tocam som depois de um toque
  runPhase(root, phase, (result) => {
    if (!result) return home();
    progress = recordPhase(progress, phase.id, result.allTestsTried);
    saveProgress(progress);
    phasesThisSession++;
    if (phasesThisSession % PHASES_BEFORE_PAUSE === 0) renderPause(root, home);
    else home();
  });
}

home();
