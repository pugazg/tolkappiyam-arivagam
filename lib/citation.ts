import type { SutraRecord } from "./types.ts";

export function fullCitation(s: SutraRecord) {
  const iyal = s.iyalEditorialTamil ?? s.iyalTamil;
  return `தொல்காப்பியம், ${s.adhikaramTamil}, ${iyal}, நூற்பா ${s.displayNumber}. Project Madurai electronic text pmuni0100, accessed through தொல்காப்பிய அறிவகம் (Tolkāppiyam Grammar Lab).`;
}
export function compactCitation(s: SutraRecord) {
  return `தொல்காப்பியம் ${s.adhikaramTamil.replace("அதிகாரம்", "")} · ${s.iyalEditorialTamil ?? s.iyalTamil} · நூற்பா ${s.displayNumber} [${s.id}]`;
}
