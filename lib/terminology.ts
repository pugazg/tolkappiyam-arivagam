// Central terminology model. UI strings should read from here so a technical
// term is displayed consistently everywhere. The Tamil term is authoritative;
// the English label/explanation is a UI aid, NOT a replacement for the term.
//
// Transliteration convention: ISO 15919 (diacritic Roman). Documented in
// docs/TERMINOLOGY.md. Chosen once; do not mix conventions.

export type TerminologyEntry = {
  id: string;
  tamil: string;
  transliteration: string; // ISO 15919
  englishLabel?: string;   // short label for English UI
  englishExplanation?: string; // interpretive; shown as explanation, not a rename
};

export const TRANSLITERATION_CONVENTION = "ISO 15919 (diacritic Roman)";

export const TERMINOLOGY: TerminologyEntry[] = [
  { id: "nutpa", tamil: "நூற்பா", transliteration: "Nūṟpā", englishLabel: "Nūṟpā", englishExplanation: "A numbered grammatical verse / aphoristic rule-unit." },
  { id: "athikaram", tamil: "அதிகாரம்", transliteration: "Atikāram", englishLabel: "Book", englishExplanation: "One of the three major divisions of the work." },
  { id: "iyal", tamil: "இயல்", transliteration: "Iyal", englishLabel: "Chapter", englishExplanation: "A chapter within an அதிகாரம்." },
  { id: "ezhuthu-athikaram", tamil: "எழுத்ததிகாரம்", transliteration: "Eḻuttatikāram", englishLabel: "Eḻuttatikāram", englishExplanation: "Book on letters / phonology." },
  { id: "sol-athikaram", tamil: "சொல்லதிகாரம்", transliteration: "Collatikāram", englishLabel: "Collatikāram", englishExplanation: "Book on words / morphosyntax." },
  { id: "porul-athikaram", tamil: "பொருளதிகாரம்", transliteration: "Poruḷatikāram", englishLabel: "Poruḷatikāram", englishExplanation: "Book on subject-matter / poetics." },
  { id: "noolmarabu", tamil: "நூல் மரபு", transliteration: "Nūl marapu", englishLabel: "Nūl marapu", englishExplanation: "The first இயல்: letters, their count, and vowel/consonant length." },
  { id: "mattirai", tamil: "மாத்திரை", transliteration: "Māttirai", englishLabel: "Māttirai", englishExplanation: "Prosodic duration (mora)." },
  { id: "kutriyalukaram", tamil: "குற்றியலுகரம்", transliteration: "Kuṟṟiyalukaram", englishLabel: "Kuṟṟiyalukaram", englishExplanation: "The shortened word-final u (½ மாத்திரை)." },
  { id: "uvamai", tamil: "உவமை", transliteration: "Uvamai", englishLabel: "Simile", englishExplanation: "Explicit comparison (Tolkāppiyam உவமவியல்)." },
  { id: "punarcci", tamil: "புணர்ச்சி", transliteration: "Puṇarcci", englishLabel: "Sandhi", englishExplanation: "Euphonic combination of sounds when words meet." },
];

const byId = new Map(TERMINOLOGY.map((t) => [t.id, t]));
const byTamil = new Map(TERMINOLOGY.map((t) => [t.tamil, t]));
export function getTerm(id: string): TerminologyEntry | null { return byId.get(id) ?? null; }
export function getTermByTamil(tamil: string): TerminologyEntry | null { return byTamil.get(tamil) ?? null; }
