// Mantido para compatibilidade: o hero agora usa o motor das demos.
import { DEMOS, tocar } from "./demos.js";
export function startHero(canvas) { return tocar(canvas, DEMOS.ilha, { abertura: false }); }
