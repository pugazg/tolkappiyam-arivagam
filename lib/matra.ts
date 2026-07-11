// மாத்திரை (mora / prosodic duration) analysis.
//
// Pipeline: raw input → NFC normalisation → Unicode grapheme segmentation
// (Intl.Segmenter) → Tamil-script classification → classical / extended
// inventory classification → vowel/consonant decomposition → nominal மாத்திரை
// → contextual rules → total.
//
// Integrity rule: NO recognised grapheme is silently discarded. Every grapheme
// is reported as one of: analysed (classical inventory), extended (Tamil-script
// / Grantha, modern extended model), unsupported, or punctuation/space. A
// definitive total is shown only when every meaningful grapheme is handled and
// no value is indeterminate.
//
// Nominal values (Tolkāppiyam நூல் மரபு; தமிழ் இலக்கண மரபு):
//   குறில் = 1, நெடில் = 2, தனி மெய் / ஆய்தம் = ½, word-initial ஐ/ஔ = 2.
// Extended (Grantha) values are a MODERN EXTENDED calculation, clearly labelled
// and never presented as source-grounded Tolkāppiyam grammar.

import { classifyTamilInput, type TamilClassification } from "./tamil.ts";

export type MatraConfidence = "high" | "medium" | "needs-review";
export type MatraStatus = "analysed" | "extended" | "unsupported" | "punctuation";

export type MatraPart = {
  grapheme: string;
  status: MatraStatus;
  baseConsonant: string | null;
  vowel: string | null;
  category: string;
  nominal: number | null;
  contextual: number | null;
  rule: string | null;
  ruleEnglish: string | null;
  confidence: MatraConfidence;
  note: string;
};

export type MatraAnalysis = {
  word: string;
  parts: MatraPart[];
  total: number | null;
  analyzable: boolean;
  message: string | null;
  // Integrity metadata — proves no grapheme was lost.
  inputGraphemeCount: number;
  analysedGraphemeCount: number;
  ignoredGraphemes: string[];
  unsupportedGraphemes: string[];
  hasExtended: boolean;
};

const NEEDS_ANALYSIS =
  "இந்தச் சொல்லின் மாத்திரை அமைப்புக்கு மேலும் இலக்கணச் சூழல் ஆய்வு தேவை.";
const INCOMPLETE =
  "இந்தச் சொல்லின் சில எழுத்துகளை தற்போதைய பகுப்பாய்வி முழுமையாகக் கையாளவில்லை.";
const EXTENDED_NOTE =
  "நவீன விரிவாக்கக் கணிப்பு; தொல்காப்பியத்தின் பதினெண் மெய்யெழுத்து வகைப்பாட்டின் பகுதி அல்ல.";

const CLASSICAL = new Set(["உயிரெழுத்து", "உயிர்மெய்", "மெய்யெழுத்து", "ஆய்த எழுத்து"]);

function segment(input: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const seg = new Intl.Segmenter("ta", { granularity: "grapheme" });
    return Array.from(seg.segment(input.normalize("NFC")), (s) => s.segment);
  }
  return Array.from(input.normalize("NFC"));
}

function nominalClassical(c: TamilClassification): number | null {
  if (c.category === "மெய்யெழுத்து" || c.category === "ஆய்த எழுத்து") return 0.5;
  if (c.category === "உயிரெழுத்து" || c.category === "உயிர்மெய்") {
    if (c.vowelComponent === "ஐ" || c.vowelComponent === "ஔ") return 2;
    if (c.vowelLength === "நெடில்") return 2;
    if (c.vowelLength === "குறில்") return 1;
  }
  return null;
}

// Modern extended model for Tamil-script / Grantha graphemes.
function nominalExtended(c: TamilClassification): number {
  if (!c.vowelComponent) return 0.5; // pure Grantha consonant, e.g. ஸ்
  if (c.vowelLength === "நெடில்") return 2; // e.g. ஸா
  return 1; // e.g. ஸ (inherent அ), ஸி
}

function kutriyalukaramSubtype(prev: TamilClassification | null) {
  if (!prev) return { ta: "குற்றியலுகரம்", en: "kuṟṟiyalukaram" };
  if (prev.category === "ஆய்த எழுத்து") return { ta: "ஆய்தத்தொடர்க் குற்றியலுகரம்", en: "āytat-toṭar kuṟṟiyalukaram" };
  if (prev.category === "மெய்யெழுத்து") {
    if (prev.consonantClass === "வல்லினம்") return { ta: "வன்றொடர்க் குற்றியலுகரம்", en: "vaṉṟoṭar kuṟṟiyalukaram" };
    if (prev.consonantClass === "மெல்லினம்") return { ta: "மென்றொடர்க் குற்றியலுகரம்", en: "meṉṟoṭar kuṟṟiyalukaram" };
    if (prev.consonantClass === "இடையினம்") return { ta: "இடைத்தொடர்க் குற்றியலுகரம்", en: "iṭaittoṭar kuṟṟiyalukaram" };
  }
  if (prev.category === "உயிரெழுத்து" || prev.category === "உயிர்மெய்") {
    if (prev.vowelLength === "நெடில்" || prev.vowelComponent === "ஐ" || prev.vowelComponent === "ஔ")
      return { ta: "நெடிற்றொடர்க் குற்றியலுகரம்", en: "neṭiṟṟoṭar kuṟṟiyalukaram" };
    return { ta: "உயிர்த்தொடர்க் குற்றியலுகரம்", en: "uyirttoṭar kuṟṟiyalukaram" };
  }
  return { ta: "குற்றியலுகரம்", en: "kuṟṟiyalukaram" };
}

function statusOf(g: string, c: TamilClassification): MatraStatus {
  if (/^\s+$/u.test(g)) return "punctuation";
  if (/^[\p{P}\p{S}]+$/u.test(g)) return "punctuation";
  if (CLASSICAL.has(c.category)) return "analysed";
  if (c.category === "Grantha") return "extended";
  return "unsupported"; // numerals, Latin, emoji, unclassified Tamil symbols
}

export function analyzeMatra(input: string): MatraAnalysis {
  const graphemes = segment((input ?? "").trim());
  const entries = graphemes.map((g) => {
    const c = classifyTamilInput(g);
    return { g, c, status: statusOf(g, c) };
  });

  // Letters that carry மாத்திரை, in order (classical + extended).
  const letters = entries.filter((e) => e.status === "analysed" || e.status === "extended");
  const L = letters.length;
  const partOf = new Map<(typeof entries)[number], MatraPart>();
  let indeterminate = false;

  letters.forEach((e, k) => {
    const c = e.c;
    if (e.status === "extended") {
      const nominal = nominalExtended(c);
      partOf.set(e, {
        grapheme: e.g,
        status: "extended",
        baseConsonant: c.consonantComponent ?? c.baseLetter ?? null,
        vowel: c.vowelComponent ?? null,
        category: "Tamil-script extended / Grantha",
        nominal,
        contextual: nominal,
        rule: "நவீன விரிவாக்கக் கணிப்பு",
        ruleEnglish: "modern extended calculation",
        confidence: "medium",
        note: EXTENDED_NOTE,
      });
      return;
    }
    const nominal = nominalClassical(c);
    let contextual = nominal;
    let rule: string | null = null;
    let ruleEnglish: string | null = null;
    let confidence: MatraConfidence = "high";
    let note = c.note;
    const isFinal = k === L - 1;
    const isVallinamU = c.category === "உயிர்மெய்" && c.consonantClass === "வல்லினம்" && c.vowelComponent === "உ";
    if (isFinal && isVallinamU && L >= 2) {
      const prev = letters[k - 1]?.c ?? null;
      const sub = kutriyalukaramSubtype(prev);
      contextual = 0.5;
      rule = sub.ta;
      ruleEnglish = sub.en;
      confidence = "high";
      note = "சொல்லிறுதியில் வல்லின உகரம் குறுகி அரை மாத்திரையாகிறது.";
    }
    if ((c.vowelComponent === "ஐ" || c.vowelComponent === "ஔ") && k > 0) {
      contextual = null;
      rule = c.vowelComponent === "ஐ" ? "ஐகாரக் குறுக்கம்" : "ஔகாரக் குறுக்கம்";
      ruleEnglish = c.vowelComponent === "ஐ" ? "aikārak kuṟukkam" : "aukārak kuṟukkam";
      confidence = "needs-review";
      note = "சொல்முதல் அல்லாத ஐ/ஔ 1 அல்லது 1½ மாத்திரையாகக் குறுகும் — மதிப்பு உறுதியற்றது.";
      indeterminate = true;
    }
    partOf.set(e, {
      grapheme: e.g,
      status: "analysed",
      baseConsonant: c.consonantComponent ?? null,
      vowel: c.vowelComponent ?? null,
      category: c.category,
      nominal,
      contextual,
      rule,
      ruleEnglish,
      confidence,
      note,
    });
  });

  const ignoredGraphemes: string[] = [];
  const unsupportedGraphemes: string[] = [];
  const parts: MatraPart[] = entries.map((e) => {
    if (e.status === "analysed" || e.status === "extended") return partOf.get(e)!;
    if (e.status === "punctuation") ignoredGraphemes.push(e.g);
    else unsupportedGraphemes.push(e.g);
    return {
      grapheme: e.g,
      status: e.status,
      baseConsonant: null,
      vowel: null,
      category: e.status === "punctuation" ? "punctuation / space" : e.c.category,
      nominal: null,
      contextual: null,
      rule: null,
      ruleEnglish: null,
      confidence: "needs-review",
      note:
        e.status === "punctuation"
          ? "இடைவெளி/நிறுத்தக்குறி — மாத்திரை கணக்கில் சேர்க்கப்படவில்லை."
          : "இந்த எழுத்தை பகுப்பாய்வி இன்னும் கையாளவில்லை.",
    };
  });

  const inputGraphemeCount = entries.length;
  const analysedGraphemeCount = letters.length;
  const meaningfulCount = entries.filter((e) => e.status !== "punctuation").length;
  const hasExtended = letters.some((e) => e.status === "extended");
  const base = {
    word: input,
    parts,
    inputGraphemeCount,
    analysedGraphemeCount,
    ignoredGraphemes,
    unsupportedGraphemes,
    hasExtended,
  };

  if (!letters.length) return { ...base, total: null, analyzable: false, message: "தமிழ் எழுத்து இல்லை." };
  // Never total after dropping a meaningful grapheme.
  if (unsupportedGraphemes.length > 0 || analysedGraphemeCount < meaningfulCount)
    return { ...base, total: null, analyzable: false, message: INCOMPLETE };
  if (indeterminate || letters.some((e) => partOf.get(e)!.contextual === null))
    return { ...base, total: null, analyzable: false, message: NEEDS_ANALYSIS };

  const total = letters.reduce((s, e) => s + (partOf.get(e)!.contextual ?? 0), 0);
  return { ...base, total, analyzable: true, message: null };
}

// Format a மாத்திரை number with the traditional vulgar fractions.
export function formatMatra(value: number | null): string {
  if (value === null) return "—";
  const whole = Math.floor(value);
  const frac = value - whole;
  const fracStr = frac === 0.25 ? "¼" : frac === 0.5 ? "½" : frac === 0.75 ? "¾" : "";
  if (whole === 0 && fracStr) return fracStr;
  return `${whole}${fracStr}`;
}
