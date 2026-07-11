// மாத்திரை (mora / prosodic duration) analysis.
//
// This module distinguishes NOMINAL (grapheme-level, isolated) மாத்திரை from
// CONTEXTUAL (word-level) மாத்திரை, because Tamil prosodic duration is
// context-sensitive. It implements the well-grounded rules only, and returns an
// explicit "needs further analysis" result for forms whose value is not
// deterministic in the tradition (e.g. ஐகாரக்/ஔகாரக் குறுக்கம், whose value is
// documented as "1 or 1½"). See docs/matra.md for the grammatical sources.
//
// Nominal values (Tolkāppiyam நூல் மரபு; தமிழ் இலக்கண மரபு):
//   குறில் உயிர் / உயிர்மெய்      = 1
//   நெடில் உயிர் / உயிர்மெய்      = 2   (ஆ ஈ ஊ ஏ ஓ; ஐ ஔ handled specially)
//   தனி மெய் (ஒற்று)             = ½
//   ஆய்தம்                       = ½
//
// Contextual rules implemented:
//   • குற்றியலுகரம் — a வல்லினம்+உ (கு சு டு து பு று) that is the FINAL letter
//     of a multi-letter word shortens to ½. Subtype named from what precedes it
//     (நெடிற்றொடர் / வன்றொடர் / மென்றொடர் / இடைத்தொடர் / உயிர்த்தொடர் /
//     ஆய்தத்தொடர்).
//   • Word-initial ஐ / ஔ = 2 (full).
// Explicitly NOT resolved (returns needs-analysis):
//   • Non-initial ஐ / ஔ (ஐகாரக்/ஔகாரக் குறுக்கம் = 1 or 1½ — indeterminate).
//   • குற்றியலிகரம், அளபெடை, மகர/ஆய்தக் குறுக்கம், and other context forms.

import { classifyTamilInput } from "./tamil.ts";

export type MatraConfidence = "high" | "medium" | "needs-review";

export type MatraPart = {
  grapheme: string;
  baseConsonant: string | null;
  vowel: string | null;
  category: string;
  nominal: number | null; // grapheme-level (isolated) value
  contextual: number | null; // word-level value; null = indeterminate
  rule: string | null; // detected contextual rule (Tamil)
  ruleEnglish: string | null;
  confidence: MatraConfidence;
  note: string;
};

export type MatraAnalysis = {
  word: string;
  parts: MatraPart[];
  total: number | null; // null when the word cannot be reliably totalled
  analyzable: boolean;
  message: string | null; // Tamil message when not analyzable
};

const NEEDS_ANALYSIS =
  "இந்தச் சொல்லின் மாத்திரை அமைப்புக்கு மேலும் இலக்கணச் சூழல் ஆய்வு தேவை.";

function segment(input: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const seg = new Intl.Segmenter("ta", { granularity: "grapheme" });
    return Array.from(seg.segment(input.normalize("NFC")), (s) => s.segment);
  }
  return Array.from(input.normalize("NFC"));
}

function nominalValue(c: ReturnType<typeof classifyTamilInput>): number | null {
  if (c.category === "மெய்யெழுத்து") return 0.5;
  if (c.category === "ஆய்த எழுத்து") return 0.5;
  if (c.category === "உயிரெழுத்து" || c.category === "உயிர்மெய்") {
    if (c.vowelComponent === "ஐ" || c.vowelComponent === "ஔ") return 2; // nominal full
    if (c.vowelLength === "நெடில்") return 2;
    if (c.vowelLength === "குறில்") return 1;
  }
  return null;
}

// Name the குற்றியலுகரம் subtype from the preceding part.
function kutriyalukaramSubtype(prev: ReturnType<typeof classifyTamilInput> | null): {
  ta: string;
  en: string;
} {
  if (!prev) return { ta: "குற்றியலுகரம்", en: "kuṟṟiyalukaram" };
  if (prev.category === "ஆய்த எழுத்து")
    return { ta: "ஆய்தத்தொடர்க் குற்றியலுகரம்", en: "āytat-toṭar kuṟṟiyalukaram" };
  if (prev.category === "மெய்யெழுத்து") {
    if (prev.consonantClass === "வல்லினம்")
      return { ta: "வன்றொடர்க் குற்றியலுகரம்", en: "vaṉṟoṭar kuṟṟiyalukaram" };
    if (prev.consonantClass === "மெல்லினம்")
      return { ta: "மென்றொடர்க் குற்றியலுகரம்", en: "meṉṟoṭar kuṟṟiyalukaram" };
    if (prev.consonantClass === "இடையினம்")
      return { ta: "இடைத்தொடர்க் குற்றியலுகரம்", en: "iṭaittoṭar kuṟṟiyalukaram" };
  }
  if (prev.category === "உயிரெழுத்து" || prev.category === "உயிர்மெய்") {
    if (prev.vowelLength === "நெடில்" || prev.vowelComponent === "ஐ" || prev.vowelComponent === "ஔ")
      return { ta: "நெடிற்றொடர்க் குற்றியலுகரம்", en: "neṭiṟṟoṭar kuṟṟiyalukaram" };
    return { ta: "உயிர்த்தொடர்க் குற்றியலுகரம்", en: "uyirttoṭar kuṟṟiyalukaram" };
  }
  return { ta: "குற்றியலுகரம்", en: "kuṟṟiyalukaram" };
}

export function analyzeMatra(input: string): MatraAnalysis {
  const graphemes = segment((input ?? "").trim());
  const classified = graphemes.map((g) => ({ g, c: classifyTamilInput(g) }));
  // Keep only recognised Tamil letters for prosodic analysis.
  const letters = classified.filter(
    ({ c }) =>
      c.category === "உயிரெழுத்து" ||
      c.category === "உயிர்மெய்" ||
      c.category === "மெய்யெழுத்து" ||
      c.category === "ஆய்த எழுத்து",
  );
  const n = letters.length;
  const parts: MatraPart[] = [];
  let indeterminate = false;

  letters.forEach(({ g, c }, i) => {
    const nominal = nominalValue(c);
    let contextual = nominal;
    let rule: string | null = null;
    let ruleEnglish: string | null = null;
    let confidence: MatraConfidence = "high";
    let note = c.note;

    const isFinal = i === n - 1;
    const isVallinamU =
      c.category === "உயிர்மெய்" && c.consonantClass === "வல்லினம்" && c.vowelComponent === "உ";

    // Rule 1: word-final வல்லினம்+உ in a multi-letter word → குற்றியலுகரம் (½).
    if (isFinal && isVallinamU && n >= 2) {
      const prev = letters[i - 1]?.c ?? null;
      const sub = kutriyalukaramSubtype(prev);
      contextual = 0.5;
      rule = sub.ta;
      ruleEnglish = sub.en;
      confidence = "high";
      note = "சொல்லிறுதியில் வல்லின உகரம் குறுகி அரை மாத்திரையாகிறது.";
    } else if (isVallinamU && n === 1) {
      // Isolated வல்லினம்+உ: report the nominal குறில் உயிர்மெய் value only,
      // with NO word-final contextual rule applied (it is not a word).
      note = "தனி எழுத்தாக இது குறில் உயிர்மெய்; சொல்லிறுதி விதி எதுவும் பொருந்தாது.";
    }

    // Rule 2: non-initial ஐ / ஔ → ஐகாரக்/ஔகாரக் குறுக்கம் = 1 or 1½ (indeterminate).
    if ((c.vowelComponent === "ஐ" || c.vowelComponent === "ஔ") && i > 0) {
      contextual = null;
      rule = c.vowelComponent === "ஐ" ? "ஐகாரக் குறுக்கம்" : "ஔகாரக் குறுக்கம்";
      ruleEnglish = c.vowelComponent === "ஐ" ? "aikārak kuṟukkam" : "aukārak kuṟukkam";
      confidence = "needs-review";
      note = "சொல்முதல் அல்லாத ஐ/ஔ 1 அல்லது 1½ மாத்திரையாகக் குறுகும் — மதிப்பு உறுதியற்றது.";
      indeterminate = true;
    }

    if (contextual === null && !indeterminate) indeterminate = true;

    parts.push({
      grapheme: g,
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

  if (!parts.length) {
    return { word: input, parts, total: null, analyzable: false, message: "தமிழ் எழுத்து இல்லை." };
  }
  if (indeterminate || parts.some((p) => p.contextual === null)) {
    return { word: input, parts, total: null, analyzable: false, message: NEEDS_ANALYSIS };
  }
  const total = parts.reduce((s, p) => s + (p.contextual ?? 0), 0);
  return { word: input, parts, total, analyzable: true, message: null };
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
