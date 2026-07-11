import fs from "node:fs";
import path from "node:path";
import type {
  AdhikaramRecord,
  AnalysisReport,
  GlossaryTerm,
  IyalRecord,
  ParsingReport,
  SutraRecord,
  WorkRecord,
} from "./types.ts";
import { searchSutraRecords, type SearchFilters } from "./search.ts";

const GEN = path.join(process.cwd(), "data", "generated");

function load<T>(file: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(path.join(GEN, file), "utf8")) as T;
  } catch {
    return fallback;
  }
}

const emptyWork: WorkRecord = {
  id: "tolkappiyam",
  titleTamil: "தொல்காப்பியம்",
  titleEnglish: "Tolkappiyam",
  projectTitleTamil: "தொல்காப்பிய அறிவகம்",
  projectTitleEnglish: "Tolkāppiyam Grammar Lab",
  tagline: "From நூற்பா to language intelligence",
  source: {
    publisher: "Project Madurai",
    sourceId: "pmuni0100",
    url: "https://www.projectmadurai.org/pm_etexts/utf8/pmuni0100.html",
    accessNote: "",
    attribution: "",
  },
  counts: { adhikarams: 0, iyals: 0, sutras: 0 },
  editorialPrinciples: [],
};

export const work = load<WorkRecord>("work.json", emptyWork);
export const sutras = load<SutraRecord[]>("sutras.json", []);
export const glossary = load<GlossaryTerm[]>("glossary.json", []);
export const parsingReport = load<ParsingReport>("parsing-report.json", {
  generatedAt: "", sourceUrl: "", sourceFile: "", totalAdhikaramsFound: 0,
  totalIyalsFound: 0, totalSutrasExtracted: 0, highConfidenceSutras: 0,
  mediumConfidenceSutras: 0, lowConfidenceSutras: 0, warnings: [],
});
export const analysis = load<AnalysisReport | null>("analysis.json", null);

const sections = load<{ adhikarams: AdhikaramRecord[]; iyals: IyalRecord[] }>(
  "sections.json",
  { adhikarams: [], iyals: [] },
);
export const adhikarams = sections.adhikarams;
export const iyals = sections.iyals;

const sutraById = new Map(sutras.map((s) => [s.id, s]));

export function getAdhikaram(id: string) {
  return adhikarams.find((a) => a.id === id) ?? null;
}
export function getIyal(id: string) {
  return iyals.find((i) => i.id === id) ?? null;
}
export function getIyalsFor(adhikaramId: string) {
  return iyals.filter((i) => i.adhikaramId === adhikaramId);
}
export function getIyalSutras(iyalId: string) {
  return sutras.filter((s) => s.iyalId === iyalId);
}
export function getAdhikaramSutras(adhikaramId: string) {
  return sutras.filter((s) => s.adhikaramId === adhikaramId);
}
export function getSutra(id: string) {
  return sutraById.get(id) ?? null;
}
export function getAdjacentSutras(id: string) {
  const i = sutras.findIndex((s) => s.id === id);
  if (i < 0) return { previous: null, next: null };
  return { previous: sutras[i - 1] ?? null, next: sutras[i + 1] ?? null };
}
export function getFeaturedSutra() {
  return getSutra("ezhuthu-noolmarabu-001") ?? sutras[0] ?? null;
}
export function getIyalPath(iyal: IyalRecord) {
  return `/adhikaram/${iyal.adhikaramId}/${iyal.id}`;
}
export function getSutraPath(id: string) {
  return `/sutra/${id}`;
}
export function searchSutras(query: string, filters: SearchFilters = {}) {
  return searchSutraRecords(query, sutras, filters);
}
export function getGlossaryTerm(id: string) {
  return glossary.find((g) => g.id === id) ?? null;
}
