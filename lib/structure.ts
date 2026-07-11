import type {
  AdhikaramRecord,
  Commentator,
  GlossaryTerm,
  IyalRecord,
} from "./types.ts";

export const SOURCE_URL =
  "https://www.projectmadurai.org/pm_etexts/utf8/pmuni0100.html";

export const SOURCE_ID = "pmuni0100" as const;

export const SOURCE_ACCESS_NOTE =
  "Downloaded from Project Madurai and preserved locally for this release. Runtime pages do not depend on live Project Madurai access.";

export const SOURCE_ATTRIBUTION =
  "Project Madurai electronic text pmuni0100. Etext preparation and PDF version: Dr. K. Kalyanasundaram; proof-reading and web version: Mr. N. D. Logasundaram, as stated in the source header.";

export const ADHIKARAMS: AdhikaramRecord[] = [
  {
    id: "ezhuthu",
    number: 1,
    tamil: "எழுத்ததிகாரம்",
    english: "Orthography and Phonology",
    transliteration: "Eḻuttatikāram",
    neutralDescription:
      "The source text on letters: the inventory of sounds, their production, and the rules by which words combine.",
    overview:
      "The first of the three books. It treats எழுத்து (letters/phonemes): how many there are, how they are produced in the mouth, their classification as vowels (உயிர்) and consonants (மெய்), and the extensive rules of புணர்ச்சி (euphonic combination) that govern how sounds change when words meet.",
    iyalIds: [
      "ezhuthu-noolmarabu",
      "ezhuthu-mozhimarabu",
      "ezhuthu-pirappiyal",
      "ezhuthu-punariyal",
      "ezhuthu-thogaimarabu",
      "ezhuthu-urubiyal",
      "ezhuthu-uyirmayangiyal",
      "ezhuthu-pullimayangiyal",
      "ezhuthu-kutriyalugarapunariyal",
    ],
  },
  {
    id: "sol",
    number: 2,
    tamil: "சொல்லதிகாரம்",
    english: "Words and Morphosyntax",
    transliteration: "Collatikāram",
    neutralDescription:
      "The source text on words: word classes, case, inflection, and the syntactic functions of the parts of speech.",
    overview:
      "The second book. It treats சொல் (words): how expressions are formed (கிளவியாக்கம்), the case system (வேற்றுமை), nouns (பெயர்), verbs (வினை), particles (இடை), and qualifiers (உரி). It is the earliest systematic grammar of Tamil morphology and syntax.",
    iyalIds: [
      "sol-kilaviyakkam",
      "sol-vetrumaiyiyal",
      "sol-vetrumaimayangiyal",
      "sol-vilimarabu",
      "sol-peyariyal",
      "sol-vinaiyiyal",
      "sol-idaiyiyal",
      "sol-uriyiyal",
      "sol-echaviyal",
    ],
  },
  {
    id: "porul",
    number: 3,
    tamil: "பொருளதிகாரம்",
    english: "Poetics, Genres and Meaning",
    transliteration: "Poruḷatikāram",
    neutralDescription:
      "The source text on subject matter: the conventions of akam and puram poetry, dramatic feeling, simile, prosody, and literary tradition.",
    overview:
      "The third book, unusual among world grammars: it treats பொருள் (meaning / poetic subject matter). It codifies the akam (இன்/interior love) and puram (exterior/public) genres of classical Tamil poetry, the seven landscapes (திணை), the phases of love, embodied feeling (மெய்ப்பாடு), simile (உவமை), prosody (செய்யுள்), and poetic convention (மரபு).",
    iyalIds: [
      "porul-akaththinai",
      "porul-puraththinai",
      "porul-kalaviyal",
      "porul-karpiyal",
      "porul-poruliyal",
      "porul-meyppattiyal",
      "porul-uvamaiyiyal",
      "porul-seyyuliyal",
      "porul-marabiyal",
    ],
  },
];

// [adhikaramNumber, iyalNumber, id, tamil, english, transliteration, gloss]
const iyalSeed: [number, number, string, string, string, string, string][] = [
  [1, 1, "ezhuthu-noolmarabu", "நூல் மரபு", "Textual Tradition", "Nūl marapu", "The letters of Tamil, their count, and vowel/consonant length."],
  [1, 2, "ezhuthu-mozhimarabu", "மொழி மரபு", "Word Tradition", "Moḻi marapu", "How letters begin and end words; word-forming conventions."],
  [1, 3, "ezhuthu-pirappiyal", "பிறப்பியல்", "Origin of Sounds", "Piṟappiyal", "Where in the vocal tract each sound is produced."],
  [1, 4, "ezhuthu-punariyal", "புணரியல்", "Combination", "Puṇariyal", "The general rules of euphonic joining between words."],
  [1, 5, "ezhuthu-thogaimarabu", "தொகை மரபு", "Grouping Tradition", "Tokai marapu", "Combination in compounds and numeral/measure words."],
  [1, 6, "ezhuthu-urubiyal", "உருபியல்", "Suffix Forms", "Urupiyal", "The forms of case suffixes and connective increments (சாரியை)."],
  [1, 7, "ezhuthu-uyirmayangiyal", "உயிர் மயங்கியல்", "Vowel Sandhi", "Uyir mayaṅkiyal", "Combination rules when words ending in vowels meet others."],
  [1, 8, "ezhuthu-pullimayangiyal", "புள்ளி மயங்கியல்", "Consonant Sandhi", "Puḷḷi mayaṅkiyal", "Combination rules for words ending in consonants (with புள்ளி)."],
  [1, 9, "ezhuthu-kutriyalugarapunariyal", "குற்றியலுகரப் புணரியல்", "Short-u Combination", "Kuṟṟiyalukara puṇariyal", "Combination behaviour of the short enunciative u (குற்றியலுகரம்)."],
  [2, 1, "sol-kilaviyakkam", "கிளவியாக்கம்", "Formation of Expressions", "Kiḷaviyākkam", "How words and expressions are formed and classified."],
  [2, 2, "sol-vetrumaiyiyal", "வேற்றுமையியல்", "Case System", "Vēṟṟumaiyiyal", "The eight grammatical cases and their functions."],
  [2, 3, "sol-vetrumaimayangiyal", "வேற்றுமை மயங்கியல்", "Case Overlap", "Vēṟṟumai mayaṅkiyal", "Where one case form does the work of another."],
  [2, 4, "sol-vilimarabu", "விளி மரபு", "Vocative", "Viḷi marapu", "The vocative case and forms of address."],
  [2, 5, "sol-peyariyal", "பெயரியல்", "Nouns", "Peyariyal", "Nouns: their kinds, gender/class, and behaviour."],
  [2, 6, "sol-vinaiyiyal", "வினையியல்", "Verbs", "Viṉaiyiyal", "Verbs: tense, mood, and finite/non-finite forms."],
  [2, 7, "sol-idaiyiyal", "இடையியல்", "Particles", "Iṭaiyiyal", "Particles and clitics (இடைச்சொல்)."],
  [2, 8, "sol-uriyiyal", "உரியியல்", "Qualifiers", "Uriyiyal", "Uriccol: expressive/qualifying words and their senses."],
  [2, 9, "sol-echaviyal", "எச்சவியல்", "Ellipsis", "Eccaviyal", "Elliptical and residual constructions."],
  [3, 1, "porul-akaththinai", "அகத்திணையியல்", "Akam Landscapes", "Akattiṇaiyiyal", "The interior (love) genre and its five landscapes."],
  [3, 2, "porul-puraththinai", "புறத்திணையியல்", "Puram Themes", "Puṟattiṇaiyiyal", "The exterior (public, heroic) genre and its themes."],
  [3, 3, "porul-kalaviyal", "களவியல்", "Premarital Love", "Kaḷaviyal", "The clandestine (pre-marital) phase of love."],
  [3, 4, "porul-karpiyal", "கற்பியல்", "Marital Love", "Kaṟpiyal", "The wedded phase of love and its situations."],
  [3, 5, "porul-poruliyal", "பொருளியல்", "Subject Matter", "Poruḷiyal", "General principles unifying the treatment of poetic meaning."],
  [3, 6, "porul-meyppattiyal", "மெய்ப்பாட்டியல்", "Embodied Feeling", "Meyppāṭṭiyal", "Meyppāṭu: the outward bodily expression of emotion."],
  [3, 7, "porul-uvamaiyiyal", "உவமவியல்", "Simile", "Uvamaiyiyal", "Simile (உவமை): its grounds and forms."],
  [3, 8, "porul-seyyuliyal", "செய்யுளியல்", "Prosody", "Ceyyuḷiyal", "Metre and the elements of verse composition."],
  [3, 9, "porul-marabiyal", "மரபியல்", "Convention", "Marapiyal", "Poetic convention: correct usage, naming, and tradition."],
];

export const IYALS: IyalRecord[] = iyalSeed.map(
  ([adhikaramNumber, number, id, tamil, english, transliteration, gloss], index) => {
    const adhikaram = ADHIKARAMS.find((a) => a.number === adhikaramNumber);
    if (!adhikaram) throw new Error(`Unknown adhikaram number ${adhikaramNumber}`);
    return {
      id,
      adhikaramId: adhikaram.id,
      adhikaramNumber: adhikaramNumber as 1 | 2 | 3,
      number,
      tamil,
      english,
      transliteration,
      gloss,
      sourceSequence: index + 1,
      sutraCount: 0,
      firstSutraId: null,
      lastSutraId: null,
      editorialStatus: "source-only",
      parsingConfidence: "low",
      parsingNotes: [],
    } satisfies IyalRecord;
  },
);

export const COMMENTATORS: Commentator[] = [
  { id: "ilampuranar", tamil: "இளம்பூரணர்", english: "Iḷampūraṇar", period: "c. 11th–12th c.", ingestionStatus: "not-started", note: "The earliest surviving complete commentator on all three books. Commentary text is not ingested until an edition-level rights review is complete." },
  { id: "senavaraiyar", tamil: "சேனாவரையர்", english: "Cēṉāvaraiyar", period: "c. 13th–14th c.", ingestionStatus: "not-started", note: "Commented on the Collatikāram (word book). Prepared as a future schema target only." },
  { id: "naccinarkkiniyar", tamil: "நச்சினார்க்கினியர்", english: "Nacciṉārkkiṉiyar", period: "c. 14th c.", ingestionStatus: "not-started", note: "Wide-ranging commentator on Eḻuttu, Col and part of Poruḷ. Prepared as a future schema target only." },
  { id: "perasiriyar", tamil: "பேராசிரியர்", english: "Pērāciriyar", period: "c. 13th c.", ingestionStatus: "not-started", note: "Commented on the Poruḷatikāram. Prepared as a future schema target only." },
  { id: "teyvaccilaiyar", tamil: "தெய்வச்சிலையார்", english: "Teyvaccilaiyār", period: "c. 16th c.", ingestionStatus: "not-started", note: "Commented on the Collatikāram. Prepared as a future schema target only." },
];

const glossarySeed: [string, string, string, string][] = [
  ["ezhuttu", "எழுத்து", "eḻuttu", "letter / phoneme"],
  ["uyir", "உயிர்", "uyir", "vowel"],
  ["mey", "மெய்", "mey", "consonant"],
  ["kuril", "குறில்", "kuṟil", "short vowel"],
  ["nedil", "நெடில்", "neṭil", "long vowel"],
  ["vallinam", "வல்லினம்", "valliṉam", "hard consonant class"],
  ["mellinam", "மெல்லினம்", "melliṉam", "soft (nasal) consonant class"],
  ["idaiyinam", "இடையினம்", "iṭaiyiṉam", "medial consonant class"],
  ["punarcci", "புணர்ச்சி", "puṇarcci", "euphonic combination / sandhi"],
  ["kilavi", "கிளவி", "kiḷavi", "expression / word"],
  ["vetrumai", "வேற்றுமை", "vēṟṟumai", "grammatical case"],
  ["peyar", "பெயர்", "peyar", "noun / name"],
  ["vinai", "வினை", "viṉai", "verb / action"],
  ["idai", "இடை", "iṭai", "particle"],
  ["uri", "உரி", "uri", "qualifier (uriccol)"],
  ["uyarthinai", "உயர்திணை", "uyartiṇai", "the rational (human) class"],
  ["ahrinai", "அஃறிணை", "aḵṟiṇai", "the non-rational class"],
  ["akaththinai", "அகத்திணை", "akattiṇai", "interior (love) genre"],
  ["puraththinai", "புறத்திணை", "puṟattiṇai", "exterior (public) genre"],
  ["meyppadu", "மெய்ப்பாடு", "meyppāṭu", "embodied expression of feeling"],
  ["uvamai", "உவமை", "uvamai", "simile"],
  ["seyyul", "செய்யுள்", "ceyyuḷ", "verse / poetic composition"],
  ["marapu", "மரபு", "marapu", "convention / tradition"],
  ["saariyai", "சாரியை", "cāriyai", "connective increment (in combination)"],
  ["thinai", "திணை", "tiṇai", "class / poetic landscape"],
];

export const GLOSSARY_SEED: Omit<
  GlossaryTerm,
  "occurrences" | "relatedSutras" | "sourceReferences"
>[] = glossarySeed.map(([id, tamil, transliteration, englishTerm]) => ({
  id,
  tamil,
  transliteration,
  englishTerm,
  modernLinguisticEquivalent: null,
  conciseDefinition: "விரைவில் சேர்க்கப்படும்",
  extendedDefinition:
    "Explanation under editorial review. This entry is a framework record that links the term to its occurrences in the source; it is not yet a verified scholarly definition.",
  relatedTerms: [],
  verificationStatus: "under-review",
}));

export function getAdhikaramByNumber(n: number) {
  return ADHIKARAMS.find((a) => a.number === n);
}
export function getIyalByNumbers(adhikaramNumber: number, iyalNumber: number) {
  return IYALS.find(
    (i) => i.adhikaramNumber === adhikaramNumber && i.number === iyalNumber,
  );
}
export function buildSutraId(iyalId: string, n: number) {
  return `${iyalId}-${String(n).padStart(3, "0")}`;
}
export function normalizeTamilLabel(v: string) {
  return v
    .normalize("NFC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, "")
    .trim();
}
