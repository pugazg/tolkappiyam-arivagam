import type { SutraRecord } from "./types.ts";

export type SearchFilters = {
  adhikaramId?: string | null;
  iyalId?: string | null;
  editorialStatus?: string | null;
  exact?: boolean;
};

export type SearchHit = {
  sutra: SutraRecord;
  score: number;
  matchedIn: string[];
};

function norm(v: string) {
  return v.normalize("NFC").toLocaleLowerCase("ta");
}

export function searchSutraRecords(
  query: string,
  records: SutraRecord[],
  filters: SearchFilters = {},
): SearchHit[] {
  let pool = records;
  if (filters.adhikaramId) pool = pool.filter((s) => s.adhikaramId === filters.adhikaramId);
  if (filters.iyalId) pool = pool.filter((s) => s.iyalId === filters.iyalId);
  if (filters.editorialStatus) pool = pool.filter((s) => s.editorialStatus === filters.editorialStatus);

  const q = norm(query.trim());
  if (!q) return pool.map((sutra) => ({ sutra, score: 0, matchedIn: [] }));

  const terms = filters.exact ? [q] : q.split(/\s+/).filter(Boolean);
  const hits: SearchHit[] = [];

  for (const sutra of pool) {
    const fields: [string, string, number][] = [
      ["id", norm(sutra.id), 3],
      ["displayNumber", norm(sutra.displayNumber), 2],
      ["மூலம்", norm(sutra.originalText), 5],
      ["அதிகாரம்", norm(sutra.adhikaramTamil + " " + sutra.adhikaramEnglish), 2],
      ["இயல்", norm([sutra.iyalTamil, sutra.iyalEditorialTamil, sutra.iyalEnglish].filter(Boolean).join(" ")), 2],
      ["கருத்துகள்", norm([...sutra.keywords, ...sutra.concepts].join(" ")), 3],
    ];
    let score = 0;
    const matchedIn = new Set<string>();
    for (const term of terms) {
      for (const [label, hay, weight] of fields) {
        if (hay.includes(term)) {
          score += weight;
          matchedIn.add(label);
        }
      }
    }
    const allMatched = filters.exact
      ? fields.some(([, hay]) => hay.includes(q))
      : terms.every((t) => fields.some(([, hay]) => hay.includes(t)));
    if (score > 0 && allMatched) hits.push({ sutra, score, matchedIn: [...matchedIn] });
  }
  hits.sort((a, b) => b.score - a.score || a.sutra.sourceSequence - b.sutra.sourceSequence);
  return hits;
}

// Split a source string into segments around the first match of any term,
// so the UI can highlight without dangerouslySetInnerHTML.
export function highlightSegments(text: string, query: string) {
  const q = query.trim();
  if (!q) return [{ text, match: false }];
  const terms = q.split(/\s+/).filter((t) => t.length > 0).map((t) => t.normalize("NFC"));
  if (!terms.length) return [{ text, match: false }];
  const lower = text.normalize("NFC").toLocaleLowerCase("ta");
  const out: { text: string; match: boolean }[] = [];
  let i = 0;
  while (i < text.length) {
    let best = -1;
    let bestLen = 0;
    for (const term of terms) {
      const idx = lower.indexOf(term.toLocaleLowerCase("ta"), i);
      if (idx !== -1 && (best === -1 || idx < best)) {
        best = idx;
        bestLen = term.length;
      }
    }
    if (best === -1) {
      out.push({ text: text.slice(i), match: false });
      break;
    }
    if (best > i) out.push({ text: text.slice(i, best), match: false });
    out.push({ text: text.slice(best, best + bestLen), match: true });
    i = best + bestLen;
  }
  return out;
}
