// Lightweight romanized-Tamil → Tamil-script transliteration for the typing
// helpers. It is a deterministic, documented educational scheme (not a full
// IME): lowercase = dental/alveolar/short, UPPERCASE = retroflex/long.
//
// Convention highlights:
//   n → ன   nh → ந   N → ண
//   r → ர   R → ற
//   l → ல   L → ள   z / zh → ழ
//   t / th → த   T / d → ட   k / g → க
//   a அ  aa/A ஆ  i இ  ii/I/ee ஈ  u உ  uu/U/oo ஊ  e எ  E ஏ  ai ஐ  o ஒ  O ஓ  au ஔ

type VowelDef = { independent: string; sign: string };

const VOWELS: Record<string, VowelDef> = {
  a: { independent: "அ", sign: "" },
  aa: { independent: "ஆ", sign: "ா" },
  A: { independent: "ஆ", sign: "ா" },
  i: { independent: "இ", sign: "ி" },
  ii: { independent: "ஈ", sign: "ீ" },
  I: { independent: "ஈ", sign: "ீ" },
  ee: { independent: "ஈ", sign: "ீ" },
  u: { independent: "உ", sign: "ு" },
  uu: { independent: "ஊ", sign: "ூ" },
  U: { independent: "ஊ", sign: "ூ" },
  oo: { independent: "ஊ", sign: "ூ" },
  e: { independent: "எ", sign: "ெ" },
  E: { independent: "ஏ", sign: "ே" },
  ai: { independent: "ஐ", sign: "ை" },
  o: { independent: "ஒ", sign: "ொ" },
  O: { independent: "ஓ", sign: "ோ" },
  au: { independent: "ஔ", sign: "ௌ" },
  ou: { independent: "ஔ", sign: "ௌ" },
};

// Consonant base letters (without the pulli / virama).
const CONSONANTS: Record<string, string> = {
  ksh: "க்ஷ",
  ng: "ங",
  nj: "ஞ",
  ch: "ச",
  sh: "ஷ",
  th: "த",
  zh: "ழ",
  nh: "ந",
  k: "க", g: "க",
  c: "ச", s: "ச", j: "ஜ",
  T: "ட", d: "ட",
  N: "ண",
  t: "த",
  n: "ன",
  p: "ப", b: "ப",
  m: "ம",
  y: "ய",
  r: "ர", R: "ற",
  l: "ல", L: "ள", z: "ழ",
  v: "வ", w: "வ",
  S: "ஸ", h: "ஹ",
};

const PULLI = "்";
const AYTHAM = "ஃ";

const consonantKeys = Object.keys(CONSONANTS).sort((a, b) => b.length - a.length);
const vowelKeys = Object.keys(VOWELS).sort((a, b) => b.length - a.length);

function matchAt(input: string, i: number, keys: string[]): string | null {
  for (const k of keys) if (input.startsWith(k, i)) return k;
  return null;
}

/** Convert a romanized string to Tamil script. Non-matching characters
 * (spaces, punctuation, digits, already-Tamil text) pass through unchanged. */
export function transliterate(input: string): string {
  let out = "";
  let i = 0;
  const n = input.length;
  while (i < n) {
    // aytham shortcut
    if (input.startsWith("q", i)) { out += AYTHAM; i += 1; continue; }

    const c = matchAt(input, i, consonantKeys);
    if (c) {
      i += c.length;
      const v = matchAt(input, i, vowelKeys);
      if (v) {
        out += CONSONANTS[c] + VOWELS[v].sign;
        i += v.length;
      } else {
        out += CONSONANTS[c] + PULLI;
      }
      continue;
    }
    const v = matchAt(input, i, vowelKeys);
    if (v) {
      out += VOWELS[v].independent;
      i += v.length;
      continue;
    }
    out += input[i];
    i += 1;
  }
  return out.normalize("NFC");
}

export const TRANSLIT_LEGEND: [string, string][] = [
  ["a i u e o", "அ இ உ எ ஒ"],
  ["aa/A ii/I uu/U E O", "ஆ ஈ ஊ ஏ ஓ"],
  ["ai au", "ஐ ஔ"],
  ["k ng ch nj", "க ங ச ஞ"],
  ["T N t n nh", "ட ண த ன ந"],
  ["p m y r R", "ப ம ய ர ற"],
  ["l L zh v", "ல ள ழ வ"],
  ["j sh S h ksh", "ஜ ஷ ஸ ஹ க்ஷ"],
];
