// Unicode-aware Tamil letter utilities. Modern pedagogical classification is
// kept explicitly separate from anything attributed to the source text.

export type TamilLetterCategory =
  | "உயிரெழுத்து"
  | "மெய்யெழுத்து"
  | "ஆய்த எழுத்து"
  | "உயிர்மெய்"
  | "தமிழ் எண்"
  | "தமிழ் குறியீடு"
  | "Grantha"
  | "அறியப்படாதது";

export type TamilClassification = {
  input: string;
  graphemes: string[];
  recognizedTamil: boolean;
  codePoints: string[];
  category: TamilLetterCategory;
  baseLetter?: string | null;
  vowelComponent?: string | null;
  consonantComponent?: string | null;
  vowelLength?: "குறில்" | "நெடில்" | null;
  consonantClass?: "வல்லினம்" | "மெல்லினம்" | "இடையினம்" | null;
  note: string;
};

export const UYIR = ["அ","ஆ","இ","ஈ","உ","ஊ","எ","ஏ","ஐ","ஒ","ஓ","ஔ"];
export const KURIL = ["அ","இ","உ","எ","ஒ"];
export const NEDIL = ["ஆ","ஈ","ஊ","ஏ","ஐ","ஓ","ஔ"];
export const MEY = ["க்","ங்","ச்","ஞ்","ட்","ண்","த்","ந்","ப்","ம்","ய்","ர்","ல்","வ்","ழ்","ள்","ற்","ன்"];
export const VALLINAM = ["க்","ச்","ட்","த்","ப்","ற்"];
export const MELLINAM = ["ங்","ஞ்","ண்","ந்","ம்","ன்"];
export const IDAIYINAM = ["ய்","ர்","ல்","வ்","ழ்","ள்"];
export const AYTHAM = "ஃ";

const consonantBases: Record<string, string> = {
  "க":"க்","ங":"ங்","ச":"ச்","ஞ":"ஞ்","ட":"ட்","ண":"ண்","த":"த்","ந":"ந்",
  "ப":"ப்","ம":"ம்","ய":"ய்","ர":"ர்","ல":"ல்","வ":"வ்","ழ":"ழ்","ள":"ள்","ற":"ற்","ன":"ன்",
};

const vowelSigns: Record<string, { vowel: string; length: "குறில்" | "நெடில்" }> = {
  "": { vowel: "அ", length: "குறில்" },
  "ா": { vowel: "ஆ", length: "நெடில்" },
  "ி": { vowel: "இ", length: "குறில்" },
  "ீ": { vowel: "ஈ", length: "நெடில்" },
  "ு": { vowel: "உ", length: "குறில்" },
  "ூ": { vowel: "ஊ", length: "நெடில்" },
  "ெ": { vowel: "எ", length: "குறில்" },
  "ே": { vowel: "ஏ", length: "நெடில்" },
  "ை": { vowel: "ஐ", length: "நெடில்" },
  "ொ": { vowel: "ஒ", length: "குறில்" },
  "ோ": { vowel: "ஓ", length: "நெடில்" },
  "ௌ": { vowel: "ஔ", length: "நெடில்" },
};

const tamilRange = /[\u0B80-\u0BFF]/u;
const granthaLetters = new Set(["ஜ","ஷ","ஸ","ஹ","ஶ"]);

function graphemeSplit(input: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const seg = new Intl.Segmenter("ta", { granularity: "grapheme" });
    return Array.from(seg.segment(input), (i) => i.segment);
  }
  return Array.from(input.normalize("NFC"));
}

export function codePointLabel(v: string) {
  return Array.from(v)
    .map((c) => `U+${c.codePointAt(0)?.toString(16).toUpperCase().padStart(4, "0")}`)
    .join(" ");
}

export function getConsonantClass(mey: string) {
  if (VALLINAM.includes(mey)) return "வல்லினம்";
  if (MELLINAM.includes(mey)) return "மெல்லினம்";
  if (IDAIYINAM.includes(mey)) return "இடையினம்";
  return null;
}

export function classifyTamilInput(inputValue: string): TamilClassification {
  const input = inputValue.normalize("NFC").trim();
  const graphemes = graphemeSplit(input);
  const codePoints = graphemes.map(codePointLabel);

  if (!input)
    return { input, graphemes: [], recognizedTamil: false, codePoints: [], category: "அறியப்படாதது", note: "ஒரு தமிழ் எழுத்தை உள்ளிடவும்." };

  if (graphemes.length !== 1)
    return { input, graphemes, recognizedTamil: graphemes.some((g) => tamilRange.test(g)), codePoints, category: "அறியப்படாதது", note: "இக்கருவி ஒரே ஒரு எழுத்தை (grapheme) வகைப்படுத்தும். பல எழுத்துகளைத் தனித்தனியே சோதிக்கவும்." };

  const value = graphemes[0];
  if (!tamilRange.test(value))
    return { input, graphemes, recognizedTamil: false, codePoints, category: "அறியப்படாதது", note: "இது தமிழ் Unicode வரம்பில் இல்லை (Latin, emoji அல்லது பிற எழுத்து)." };

  if (value === AYTHAM)
    return { input, graphemes, recognizedTamil: true, codePoints, category: "ஆய்த எழுத்து", note: "ஆய்தம் — மூன்று சிறப்பெழுத்துகளுள் ஒன்று. Source-linked explanation is under editorial review." };

  if (UYIR.includes(value))
    return { input, graphemes, recognizedTamil: true, codePoints, category: "உயிரெழுத்து", vowelComponent: value, vowelLength: KURIL.includes(value) ? "குறில்" : "நெடில்", note: "Modern pedagogical classification; source relation shown only where verified." };

  if (MEY.includes(value))
    return { input, graphemes, recognizedTamil: true, codePoints, category: "மெய்யெழுத்து", baseLetter: value.replace("்", ""), consonantComponent: value, consonantClass: getConsonantClass(value), note: "Modern pedagogical classification; detailed source explanation under editorial review." };

  const base = Array.from(value)[0];
  const sign = value.slice(base.length);
  const consonantComponent = consonantBases[base];
  const vowel = vowelSigns[sign];

  if (granthaLetters.has(base) || granthaLetters.has(value))
    return { input, graphemes, recognizedTamil: true, codePoints, category: "Grantha", baseLetter: base, note: "Grantha-derived character in the Tamil block. Not counted among the core Tolkāppiyam letters here." };

  if (consonantComponent && vowel)
    return { input, graphemes, recognizedTamil: true, codePoints, category: "உயிர்மெய்", baseLetter: base, consonantComponent, vowelComponent: vowel.vowel, vowelLength: vowel.length, consonantClass: getConsonantClass(consonantComponent), note: "Computed from Unicode composition for this educational tool." };

  if (/[\u0BE6-\u0BEF]/u.test(value))
    return { input, graphemes, recognizedTamil: true, codePoints, category: "தமிழ் எண்", note: "தமிழ் எண் (numeral); not a letter category." };

  return { input, graphemes, recognizedTamil: true, codePoints, category: "தமிழ் குறியீடு", note: "Tamil Unicode character, not classified as a core letter in this prototype." };
}

export function buildUyirmeiGrid() {
  const bases = Object.keys(consonantBases);
  const signs = Object.entries(vowelSigns);
  return bases.map((base) => ({
    base,
    mey: consonantBases[base],
    consonantClass: getConsonantClass(consonantBases[base]),
    letters: signs.map(([sign, vowel]) => ({
      letter: `${base}${sign}`,
      vowel: vowel.vowel,
      length: vowel.length,
    })),
  }));
}

export function calculateBasicMatra(inputValue: string) {
  const graphemes = graphemeSplit(inputValue.normalize("NFC").trim());
  return graphemes.map((letter) => {
    const c = classifyTamilInput(letter);
    let matra: number | null = null;
    if (c.vowelLength === "குறில்") matra = 1;
    if (c.vowelLength === "நெடில்") matra = 2;
    if (c.category === "மெய்யெழுத்து") matra = 0.5;
    return {
      letter,
      category: c.category,
      matra,
      note:
        matra === null
          ? "Not encoded in this first-release calculator."
          : "Educational prototype value for basic encoded patterns.",
    };
  });
}
