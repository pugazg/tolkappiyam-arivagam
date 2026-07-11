import type {
  AdhikaramRecord,
  AnalysisReport,
  IyalRecord,
  SutraRecord,
  WordFrequency,
} from "./types.ts";

function tokens(v: string): string[] {
  return v.normalize("NFC").match(/[\u0B80-\u0BFF]+/gu) ?? [];
}
function letters(v: string): string[] {
  const seg = typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter("ta", { granularity: "grapheme" })
    : null;
  const src = (v.match(/[\u0B80-\u0BFF]+/gu) ?? []).join("");
  if (seg) return Array.from(seg.segment(src), (s) => s.segment);
  return Array.from(src);
}

const STOP = new Set([
  "என்ப","என","என்","என்னும்","ஆகும்","முன்","முன்னர்","இயல்","அவற்றுள்",
  "என்மனார்","புலவர்","வரின்","வரு","அதன்","ஆயின்","அல்","அவை","அவைதாம்","ஓரற்றே","உரித்தே",
]);

// Build-time analysis over the source records. Everything here is a mechanical
// count of the source text — no interpretive claims.
export function buildAnalysis(
  sutras: SutraRecord[],
  adhikarams: AdhikaramRecord[],
  iyals: IyalRecord[],
): AnalysisReport {
  const allWords: string[] = [];
  const wordCounts = new Map<string, number>();
  const letterCounts = new Map<string, number>();
  let totalLetters = 0;
  let totalLines = 0;
  let longest = sutras[0];
  let shortest = sutras[0];

  for (const s of sutras) {
    totalLines += s.lineCount;
    if (s.wordCount > (longest?.wordCount ?? 0)) longest = s;
    if (s.wordCount < (shortest?.wordCount ?? Infinity)) shortest = s;
    for (const w of tokens(s.normalizedText)) {
      allWords.push(w);
      wordCounts.set(w, (wordCounts.get(w) ?? 0) + 1);
    }
    for (const ch of letters(s.normalizedText)) {
      totalLetters++;
      letterCounts.set(ch, (letterCounts.get(ch) ?? 0) + 1);
    }
  }

  const topWords: WordFrequency[] = [...wordCounts.entries()]
    .filter(([w]) => w.length >= 2 && !STOP.has(w))
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 40);

  const letterFrequency: WordFrequency[] = [...letterCounts.entries()]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 60);

  const perAdhikaram = adhikarams.map((a) => {
    const list = sutras.filter((s) => s.adhikaramId === a.id);
    const uniq = new Set<string>();
    let words = 0;
    for (const s of list) for (const w of tokens(s.normalizedText)) { uniq.add(w); words++; }
    return {
      id: a.id,
      tamil: a.tamil,
      sutras: list.length,
      words,
      uniqueWords: uniq.size,
      averageWordsPerSutra: list.length ? Math.round((words / list.length) * 10) / 10 : 0,
    };
  });

  const perIyal = iyals.map((i) => {
    const list = sutras.filter((s) => s.iyalId === i.id);
    let words = 0;
    for (const s of list) words += tokens(s.normalizedText).length;
    return { id: i.id, tamil: i.tamil, adhikaramId: i.adhikaramId, sutras: list.length, words };
  });

  const totalWords = allWords.length;
  return {
    generatedAt: new Date().toISOString(),
    totalSutras: sutras.length,
    totalWords,
    uniqueWords: wordCounts.size,
    totalTamilLetters: totalLetters,
    averageWordsPerSutra: sutras.length ? Math.round((totalWords / sutras.length) * 10) / 10 : 0,
    averageLinesPerSutra: sutras.length ? Math.round((totalLines / sutras.length) * 10) / 10 : 0,
    longestSutraId: longest?.id ?? "",
    shortestSutraId: shortest?.id ?? "",
    perAdhikaram,
    perIyal,
    topWords,
    letterFrequency,
  };
}
