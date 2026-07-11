import {
  ADHIKARAMS,
  buildSutraId,
  getAdhikaramByNumber,
  getIyalByNumbers,
  GLOSSARY_SEED,
  IYALS,
  normalizeTamilLabel,
  SOURCE_ACCESS_NOTE,
  SOURCE_ATTRIBUTION,
  SOURCE_ID,
  SOURCE_URL,
} from "./structure.ts";
import type {
  GlossaryTerm,
  IyalRecord,
  ParsingReport,
  ParsingWarning,
  SutraRecord,
  WorkRecord,
} from "./types.ts";

export type ParserOutput = {
  work: WorkRecord;
  sections: { adhikarams: typeof ADHIKARAMS; iyals: IyalRecord[] };
  sutras: SutraRecord[];
  glossary: GlossaryTerm[];
  report: ParsingReport;
};

type CurrentSection = {
  adhikaramNumber: number;
  iyalNumber: number;
  iyal: IyalRecord;
  sourceTamil: string;
  expectedNextSutra: number;
};

const sourcePublisher = {
  publisher: "Project Madurai" as const,
  sourceId: SOURCE_ID,
  url: SOURCE_URL,
  accessNote: SOURCE_ACCESS_NOTE,
  attribution: SOURCE_ATTRIBUTION,
};

function decodeEntities(v: string) {
  return v
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&copy;/gi, "©");
}

export function htmlToTextLines(html: string): string[] {
  return decodeEntities(
    html
      .normalize("NFC")
      .replace(/\r\n?/g, "\n")
      .replace(/<\s*br\s*\/?>/gi, "\n")
      .replace(/<hr\b[^>]*>/gi, "\n----------\n")
      .replace(/<\/(h[1-6]|p|div|center|strong|body|html)>/gi, "\n")
      .replace(/<[^>]+>/g, ""),
  )
    .split("\n")
    .map((line) => line.replace(/ /g, " ").replace(/[ \t]+$/g, "").trimStart());
}

function cleanHeading(v: string) {
  return v.replace(/[\u200B-\u200D\uFEFF*#]/g, "").replace(/\s+/g, " ").trim();
}
function isSeparator(v: string) {
  return /^-+$/.test(v.trim());
}
function parseIyalHeading(line: string) {
  const m = cleanHeading(line).match(/^([123])\.\s*([1-9])\.\s*(.+?)\s*$/u);
  if (!m) return null;
  return {
    adhikaramNumber: Number(m[1]),
    iyalNumber: Number(m[2]),
    sourceTamil: cleanHeading(m[3]),
  };
}
function parseAdhikaramHeading(line: string) {
  const n = normalizeTamilLabel(line);
  if (n.includes("எழுத்ததிகாரம்") && n.includes("முதல்பாகம்")) return 1;
  if (n.includes("சொல்லதிகாரம்") && n.includes("இரண்டாம்பாகம்")) return 2;
  if (n.includes("பொருளதிகாரம்") && n.includes("மூன்றாம்பாகம்")) return 3;
  return null;
}
function parseNumberedEnding(line: string) {
  const m = line.match(/^(.*?)[\t ]*([0-9]+)\s*$/u);
  if (!m) return null;
  const text = m[1].trimEnd();
  const number = Number(m[2]);
  if (!text || Number.isNaN(number)) return null;
  return { text, number, hasWhitespaceBeforeNumber: /[\t ][0-9]+\s*$/u.test(line) };
}
export function tokenizeTamilText(v: string): string[] {
  return v.normalize("NFC").match(/[\u0B80-\u0BFF]+/gu) ?? [];
}
export function containsGlossaryTerm(text: string, term: string) {
  const termTokens = tokenizeTamilText(term);
  if (!termTokens.length) return false;
  const textTokens = tokenizeTamilText(text);
  return textTokens.some((_, i) =>
    termTokens.every((t, j) => textTokens[i + j] === t),
  );
}

function pushWarning(
  warnings: ParsingWarning[],
  severity: ParsingWarning["severity"],
  scope: ParsingWarning["scope"],
  message: string,
  relatedId?: string | null,
  sourceLine?: number | null,
) {
  warnings.push({
    id: `warn-${String(warnings.length + 1).padStart(4, "0")}`,
    severity,
    scope,
    message,
    relatedId: relatedId ?? null,
    sourceLine: sourceLine ?? null,
  });
}

function extractHeaderText(lines: string[]) {
  const endIndex = lines.findIndex((l) =>
    normalizeTamilLabel(l).includes("தொல்காப்பியம்-சிறப்புப்பாயிரம்"),
  );
  const headerLines = lines
    .slice(0, endIndex > -1 ? endIndex : 80)
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !isSeparator(l));
  const ackStart = headerLines.findIndex((l) => /^Acknowledgements:/i.test(l));
  const acknowledgementText =
    ackStart >= 0 ? headerLines.slice(ackStart, ackStart + 9).join("\n") : "";
  return { headerText: headerLines.join("\n"), acknowledgementText };
}

function createSutraRecord({
  section,
  sutraNumber,
  originalLines,
  sourceSequence,
  notes,
}: {
  section: CurrentSection;
  sutraNumber: number;
  originalLines: string[];
  sourceSequence: number;
  notes: string[];
}): SutraRecord {
  const adhikaram = getAdhikaramByNumber(section.adhikaramNumber);
  if (!adhikaram) throw new Error(`Missing adhikaram ${section.adhikaramNumber}`);
  const normalizedText = originalLines.join(" ").replace(/\s+/g, " ").trim();
  const keywords = GLOSSARY_SEED.filter((t) =>
    containsGlossaryTerm(normalizedText, t.tamil),
  ).map((t) => t.tamil);
  const id = buildSutraId(section.iyal.id, sutraNumber);
  const parsingConfidence = notes.length === 0 ? "high" : "medium";
  const wordCount = tokenizeTamilText(normalizedText).length;
  return {
    id,
    work: "தொல்காப்பியம்",
    adhikaramId: adhikaram.id,
    adhikaramTamil: adhikaram.tamil,
    adhikaramEnglish: adhikaram.english,
    iyalId: section.iyal.id,
    iyalTamil: section.sourceTamil,
    iyalEditorialTamil:
      section.sourceTamil === section.iyal.tamil ? undefined : section.iyal.tamil,
    iyalEnglish: section.iyal.english,
    sourceSequence,
    traditionalNumber: sutraNumber,
    displayNumber: String(sutraNumber),
    originalText: originalLines.join("\n"),
    originalLines,
    normalizedText,
    lineCount: originalLines.length,
    wordCount,
    wordSeparatedText: null,
    transliteration: null,
    simpleTamilExplanation: null,
    detailedTamilExplanation: null,
    englishExplanation: null,
    concepts: keywords,
    keywords,
    commentaryReferences: [],
    examples: [],
    relatedSutras: [],
    editorialStatus: "segmented",
    source: sourcePublisher,
    parsingConfidence,
    parsingNotes: notes.length ? notes : undefined,
  };
}

function buildGlossary(sutras: SutraRecord[]): GlossaryTerm[] {
  return GLOSSARY_SEED.map((seed) => {
    const related = sutras.filter((s) =>
      containsGlossaryTerm(s.normalizedText, seed.tamil),
    );
    const occurrences = sutras.reduce(
      (c, s) =>
        c +
        tokenizeTamilText(s.normalizedText).filter((t) => t === seed.tamil).length,
      0,
    );
    const relatedSutras = related.slice(0, 30).map((s) => s.id);
    return { ...seed, occurrences, relatedSutras, sourceReferences: relatedSutras };
  });
}

// Relate sutras within an iyal by shared salient vocabulary (source-derived,
// not an interpretive claim — purely lexical co-occurrence).
function attachRelatedSutras(sutras: SutraRecord[]) {
  const byIyal = new Map<string, SutraRecord[]>();
  for (const s of sutras) {
    if (!byIyal.has(s.iyalId)) byIyal.set(s.iyalId, []);
    byIyal.get(s.iyalId)!.push(s);
  }
  const stop = new Set(["என்ப", "என்", "என்னும்", "ஆகும்", "என", "முன்", "இயல்"]);
  for (const group of byIyal.values()) {
    const tokenSets = group.map(
      (s) =>
        new Set(
          tokenizeTamilText(s.normalizedText).filter(
            (t) => t.length >= 3 && !stop.has(t),
          ),
        ),
    );
    group.forEach((s, i) => {
      const scores: { id: string; score: number }[] = [];
      group.forEach((o, j) => {
        if (i === j) return;
        let shared = 0;
        for (const t of tokenSets[i]) if (tokenSets[j].has(t)) shared++;
        if (shared >= 2) scores.push({ id: o.id, score: shared });
      });
      scores.sort((a, b) => b.score - a.score);
      s.relatedSutras = scores.slice(0, 5).map((x) => x.id);
    });
  }
}

export function parseProjectMaduraiHtml(
  html: string,
  sourceFile = "data/source/project-madurai-pmuni0100.html",
): ParserOutput {
  const lines = htmlToTextLines(html);
  const { headerText, acknowledgementText } = extractHeaderText(lines);
  const warnings: ParsingWarning[] = [];
  const sutras: SutraRecord[] = [];
  const foundIyalIds = new Set<string>();
  const foundAdhikaramNumbers = new Set<number>();
  const sectionsById = new Map<string, IyalRecord>(
    IYALS.map((i) => [i.id, { ...i, parsingNotes: [] }]),
  );

  let currentAdhikaramNumber: number | null = null;
  let currentSection: CurrentSection | null = null;
  let currentLines: string[] = [];
  let sourceSequence = 0;
  let contentStarted = false;

  function flushUnnumbered(reason: string, sourceLine?: number) {
    if (!currentLines.length || !currentSection) return;
    pushWarning(
      warnings,
      "needs-review",
      "iyal",
      `${reason}: preserved ${currentLines.length} unnumbered line(s) before continuing.`,
      currentSection.iyal.id,
      sourceLine,
    );
    currentLines = [];
  }

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (!line) return;

    const adhikaramHeading = parseAdhikaramHeading(line);
    if (adhikaramHeading) {
      contentStarted = true;
      flushUnnumbered("Unnumbered text before adhikaram heading", index + 1);
      currentAdhikaramNumber = adhikaramHeading;
      currentSection = null;
      foundAdhikaramNumbers.add(adhikaramHeading);
      return;
    }
    if (!contentStarted) return;

    if (isSeparator(line)) {
      flushUnnumbered("Unnumbered text before source separator", index + 1);
      return;
    }

    const iyalHeading = parseIyalHeading(line);
    if (iyalHeading) {
      flushUnnumbered("Unnumbered text before iyal heading", index + 1);
      const iyal = getIyalByNumbers(iyalHeading.adhikaramNumber, iyalHeading.iyalNumber);
      if (!iyal) {
        pushWarning(warnings, "needs-review", "iyal", `Unrecognised iyal heading: ${line}`, null, index + 1);
        currentSection = null;
        return;
      }
      if (currentAdhikaramNumber !== null && currentAdhikaramNumber !== iyalHeading.adhikaramNumber) {
        pushWarning(warnings, "warning", "iyal", `Iyal heading ${line} appeared while adhikaram ${currentAdhikaramNumber} was active.`, iyal.id, index + 1);
      }
      const existing = sectionsById.get(iyal.id);
      if (existing) {
        existing.sourceTamil = iyalHeading.sourceTamil;
        existing.parsingConfidence = "medium";
        existing.editorialStatus = "source-only";
        if (iyalHeading.sourceTamil !== iyal.tamil) {
          const note = `Source heading "${iyalHeading.sourceTamil}" differs from editorial display label "${iyal.tamil}".`;
          existing.parsingNotes.push(note);
          pushWarning(warnings, "info", "iyal", note, iyal.id, index + 1);
        }
      }
      foundIyalIds.add(iyal.id);
      currentSection = {
        adhikaramNumber: iyalHeading.adhikaramNumber,
        iyalNumber: iyalHeading.iyalNumber,
        iyal,
        sourceTamil: iyalHeading.sourceTamil,
        expectedNextSutra: 1,
      };
      currentLines = [];
      return;
    }

    if (/முற்றிற்று/u.test(line)) {
      flushUnnumbered("Unnumbered closing text", index + 1);
      currentSection = null;
      currentAdhikaramNumber = null;
      return;
    }

    if (!currentSection) return;

    const numbered = parseNumberedEnding(line);
    if (numbered) {
      const notes: string[] = [];
      if (!numbered.hasWhitespaceBeforeNumber) {
        notes.push("The source number is attached without a separating space or tab.");
        pushWarning(warnings, "warning", "sutra", `Number ${numbered.number} is attached directly to text.`, currentSection.iyal.id, index + 1);
      }
      if (numbered.number !== currentSection.expectedNextSutra) {
        notes.push(`Expected section number ${currentSection.expectedNextSutra}, found ${numbered.number}.`);
        pushWarning(warnings, "needs-review", "sutra", `Number sequence mismatch in ${currentSection.iyal.id}: expected ${currentSection.expectedNextSutra}, found ${numbered.number}.`, currentSection.iyal.id, index + 1);
      }
      currentLines.push(numbered.text);
      sourceSequence += 1;
      sutras.push(
        createSutraRecord({
          section: currentSection,
          sutraNumber: numbered.number,
          originalLines: currentLines.filter(Boolean),
          sourceSequence,
          notes,
        }),
      );
      currentSection.expectedNextSutra = numbered.number + 1;
      currentLines = [];
      return;
    }
    currentLines.push(line);
  });

  flushUnnumbered("Unnumbered text at end of source");
  attachRelatedSutras(sutras);

  for (const a of ADHIKARAMS)
    if (!foundAdhikaramNumbers.has(a.number))
      pushWarning(warnings, "needs-review", "adhikaram", `Expected adhikaram heading was not found: ${a.tamil}`, a.id);
  for (const i of IYALS)
    if (!foundIyalIds.has(i.id))
      pushWarning(warnings, "needs-review", "iyal", `Expected iyal heading was not found: ${i.tamil}`, i.id);

  const iyals = IYALS.map((iyal) => {
    const sourceAware = sectionsById.get(iyal.id) ?? iyal;
    const s = sutras.filter((x) => x.iyalId === iyal.id);
    const low = s.some((x) => x.parsingConfidence === "low");
    const med = s.some((x) => x.parsingConfidence === "medium");
    return {
      ...sourceAware,
      sutraCount: s.length,
      firstSutraId: s[0]?.id ?? null,
      lastSutraId: s.at(-1)?.id ?? null,
      editorialStatus: s.length ? "segmented" : "source-only",
      parsingConfidence: low ? "low" : med ? "medium" : "high",
    } satisfies IyalRecord;
  });

  const glossary = buildGlossary(sutras);
  const report: ParsingReport = {
    generatedAt: new Date().toISOString(),
    sourceUrl: SOURCE_URL,
    sourceFile,
    totalAdhikaramsFound: foundAdhikaramNumbers.size,
    totalIyalsFound: foundIyalIds.size,
    totalSutrasExtracted: sutras.length,
    highConfidenceSutras: sutras.filter((s) => s.parsingConfidence === "high").length,
    mediumConfidenceSutras: sutras.filter((s) => s.parsingConfidence === "medium").length,
    lowConfidenceSutras: sutras.filter((s) => s.parsingConfidence === "low").length,
    warnings,
  };

  return {
    work: {
      id: "tolkappiyam",
      titleTamil: "தொல்காப்பியம்",
      titleEnglish: "Tolkappiyam",
      projectTitleTamil: "தொல்காப்பிய அறிவகம்",
      projectTitleEnglish: "Tolkāppiyam Grammar Lab",
      tagline: "From நூற்பா to language intelligence",
      source: { ...sourcePublisher, headerText, acknowledgementText },
      counts: { adhikarams: ADHIKARAMS.length, iyals: IYALS.length, sutras: sutras.length },
      editorialPrinciples: [
        "Uncertainty must be preserved, not silently corrected.",
        "Source text, editorial annotation, and modern teaching material must remain visibly distinct.",
        "Commentary, translation, and explanation layers require human editorial verification.",
      ],
    },
    sections: { adhikarams: ADHIKARAMS, iyals },
    sutras,
    glossary,
    report,
  };
}
