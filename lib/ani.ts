// அணி இலக்கணம் (the grammar of poetic figures / ornaments) reference data.
//
// SCOPE & PROVENANCE (important editorial boundary):
//   - அணி is one of the five traditional divisions of Tamil grammar
//     (எழுத்து · சொல் · பொருள் · யாப்பு · அணி).
//   - A full அணி இலக்கணம் is codified chiefly in the later work தண்டியலங்காரம்,
//     NOT in Tolkāppiyam. Tolkāppiyam itself treats உவமை (simile) in
//     பொருள் · உவமவியல் (porul-uvamaiyiyal).
//   - Therefore this reference is a MODERN EDUCATIONAL framework. The short
//     glosses are standard textbook equivalents, not verified scholarly
//     definitions, and are NOT attributed to Tolkāppiyam. Only the உவமை entry
//     is source-linked to actual Tolkāppiyam நூற்பாக்கள்.

export type AniGroup = "பொருளணி" | "சொல்லணி";

export type AniFigure = {
  id: string;
  tamil: string;
  transliteration: string;
  englishLabel: string;
  group: AniGroup;
  gloss: string; // concise modern educational summary (not a source claim)
  relatedIyalId?: string; // set only where Tolkāppiyam actually treats it
};

export const ANI_GROUPS: { id: AniGroup; english: string; note: string }[] = [
  { id: "பொருளணி", english: "Sense figures (poruḷ-aṇi)", note: "Figures that beautify the meaning." },
  { id: "சொல்லணி", english: "Sound figures (col-aṇi)", note: "Figures that work through sound and word-form." },
];

export const ANI_FIGURES: AniFigure[] = [
  {
    id: "uvamai",
    tamil: "உவமை அணி",
    transliteration: "Uvamai aṇi",
    englishLabel: "Simile",
    group: "பொருளணி",
    gloss: "Describing one thing by explicit comparison with another (using an உவம உருபு such as போல, ஒப்ப).",
    relatedIyalId: "porul-uvamaiyiyal",
  },
  {
    id: "uruvakam",
    tamil: "உருவக அணி",
    transliteration: "Uruvaka aṇi",
    englishLabel: "Metaphor",
    group: "பொருளணி",
    gloss: "Identifying one thing with another directly, without an explicit comparison particle.",
  },
  {
    id: "theevakam",
    tamil: "தீவக அணி",
    transliteration: "Tīvaka aṇi",
    englishLabel: "Zeugma / illuminator",
    group: "பொருளணி",
    gloss: "A single word placed once serves (illuminates) several clauses at once.",
  },
  {
    id: "tharkurippettram",
    tamil: "தற்குறிப்பேற்ற அணி",
    transliteration: "Taṟkuṟippēṟṟa aṇi",
    englishLabel: "Poetic fancy / pathetic fallacy",
    group: "பொருளணி",
    gloss: "Ascribing the poet's own intention or feeling to a natural act, as if it were deliberate.",
  },
  {
    id: "pirithumozhithal",
    tamil: "பிறிதுமொழிதல் அணி",
    transliteration: "Piṟitumoḻital aṇi",
    englishLabel: "Allegory / indirect statement",
    group: "பொருளணி",
    gloss: "Conveying the intended subject indirectly by speaking of something else.",
  },
  {
    id: "vetrumai",
    tamil: "வேற்றுமை அணி",
    transliteration: "Vēṟṟumai aṇi",
    englishLabel: "Figure of distinction",
    group: "பொருளணி",
    gloss: "Bringing out a striking difference or contrast between two things.",
  },
  {
    id: "vanjappugazhchi",
    tamil: "வஞ்சப்புகழ்ச்சி அணி",
    transliteration: "Vañcappukaḻcci aṇi",
    englishLabel: "Irony (praise as censure)",
    group: "பொருளணி",
    gloss: "Apparent praise that carries censure, or apparent censure that carries praise.",
  },
  {
    id: "silethai",
    tamil: "சிலேடை அணி",
    transliteration: "Cilēṭai aṇi",
    englishLabel: "Pun / double meaning",
    group: "சொல்லணி",
    gloss: "One expression yielding two coherent meanings at once.",
  },
  {
    id: "madakku",
    tamil: "மடக்கு அணி",
    transliteration: "Maṭakku aṇi",
    englishLabel: "Yamaka (sound repetition)",
    group: "சொல்லணி",
    gloss: "The same sequence of sounds repeated with a different meaning each time.",
  },
  {
    id: "iyaipu",
    tamil: "இயைபு அணி",
    transliteration: "Iyaipu aṇi",
    englishLabel: "End-rhyme figure",
    group: "சொல்லணி",
    gloss: "A pleasing recurrence of the same final sound across lines or feet.",
  },
];
