// Core domain types for the Tolkāppiyam Grammar Lab.
// Source text is treated as authoritative and immutable; every interpretive
// layer is optional and explicitly flagged so it can never be confused with
// the primary source.

export type EditorialStatus =
  | "source-only"
  | "segmented"
  | "reviewed"
  | "explained"
  | "verified";

export type ParsingConfidence = "high" | "medium" | "low";

export type VerificationStatus =
  | "placeholder"
  | "source-attested"
  | "under-review"
  | "verified";

export type CommentaryReference = {
  commentatorId: string;
  commentatorTamil: string;
  commentatorEnglish?: string;
  editionId?: string | null;
  note?: string | null;
  rightsStatus: "not-ingested" | "public-domain-review" | "cleared";
};

export type ExampleReference = {
  id: string;
  workTamil?: string | null;
  workEnglish?: string | null;
  passage?: string | null;
  note?: string | null;
  verificationStatus: VerificationStatus;
};

export type SourceEdition = {
  publisher: "Project Madurai";
  sourceId: "pmuni0100";
  url: string;
  accessNote: string;
  attribution: string;
  headerText?: string;
  acknowledgementText?: string;
};

export type SutraRecord = {
  id: string;
  work: "தொல்காப்பியம்";
  adhikaramId: string;
  adhikaramTamil: string;
  adhikaramEnglish: string;
  iyalId: string;
  iyalTamil: string;
  iyalEditorialTamil?: string;
  iyalEnglish?: string;
  sourceSequence: number;
  traditionalNumber: number | null;
  displayNumber: string;
  originalText: string;
  originalLines: string[];
  normalizedText: string;
  lineCount: number;
  wordCount: number;
  wordSeparatedText?: string | null;
  transliteration?: string | null;
  simpleTamilExplanation?: string | null;
  detailedTamilExplanation?: string | null;
  englishExplanation?: string | null;
  concepts: string[];
  keywords: string[];
  commentaryReferences: CommentaryReference[];
  examples: ExampleReference[];
  relatedSutras: string[];
  editorialStatus: EditorialStatus;
  source: SourceEdition;
  parsingConfidence: ParsingConfidence;
  parsingNotes?: string[];
};

export type AdhikaramRecord = {
  id: string;
  number: 1 | 2 | 3;
  tamil: string;
  english: string;
  transliteration: string;
  neutralDescription: string;
  overview: string;
  sourceTamil?: string;
  iyalIds: string[];
};

export type IyalRecord = {
  id: string;
  adhikaramId: string;
  adhikaramNumber: 1 | 2 | 3;
  number: number;
  tamil: string;
  sourceTamil?: string;
  english: string;
  transliteration: string;
  gloss: string;
  sourceSequence: number;
  sutraCount: number;
  firstSutraId?: string | null;
  lastSutraId?: string | null;
  editorialStatus: EditorialStatus;
  parsingConfidence: ParsingConfidence;
  parsingNotes: string[];
};

export type GlossaryTerm = {
  id: string;
  tamil: string;
  transliteration: string;
  conciseDefinition: string;
  extendedDefinition: string;
  occurrences: number;
  relatedTerms: string[];
  relatedSutras: string[];
  modernLinguisticEquivalent?: string | null;
  englishTerm?: string | null;
  verificationStatus: VerificationStatus;
  sourceReferences: string[];
};

export type Commentator = {
  id: string;
  tamil: string;
  english?: string;
  period?: string;
  ingestionStatus: "not-started" | "rights-review" | "ready";
  note: string;
};

export type ParsingWarning = {
  id: string;
  severity: "info" | "warning" | "needs-review";
  scope: "source" | "adhikaram" | "iyal" | "sutra";
  message: string;
  sourceLine?: number | null;
  relatedId?: string | null;
};

export type ParsingReport = {
  generatedAt: string;
  sourceUrl: string;
  sourceFile: string;
  totalAdhikaramsFound: number;
  totalIyalsFound: number;
  totalSutrasExtracted: number;
  highConfidenceSutras: number;
  mediumConfidenceSutras: number;
  lowConfidenceSutras: number;
  warnings: ParsingWarning[];
};

export type WordFrequency = { word: string; count: number };

export type AnalysisReport = {
  generatedAt: string;
  totalSutras: number;
  totalWords: number;
  uniqueWords: number;
  totalTamilLetters: number;
  averageWordsPerSutra: number;
  averageLinesPerSutra: number;
  longestSutraId: string;
  shortestSutraId: string;
  perAdhikaram: {
    id: string;
    tamil: string;
    sutras: number;
    words: number;
    uniqueWords: number;
    averageWordsPerSutra: number;
  }[];
  perIyal: {
    id: string;
    tamil: string;
    adhikaramId: string;
    sutras: number;
    words: number;
  }[];
  topWords: WordFrequency[];
  letterFrequency: WordFrequency[];
};

export type WorkRecord = {
  id: "tolkappiyam";
  titleTamil: "தொல்காப்பியம்";
  titleEnglish: "Tolkappiyam";
  projectTitleTamil: "தொல்காப்பிய அறிவகம்";
  projectTitleEnglish: "Tolkāppiyam Grammar Lab";
  tagline: "From நூற்பா to language intelligence";
  source: SourceEdition;
  counts: { adhikarams: number; iyals: number; sutras: number };
  editorialPrinciples: string[];
};
