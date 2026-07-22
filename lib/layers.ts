// Content-layer architecture for the editorial (Phase 3) knowledge layer.
// This file defines TYPES ONLY — it introduces no runtime coupling to the
// importer-owned source data. The mandatory rule it encodes:
//   data/generated/**  = importer-owned (source + parser-derived)  — immutable to editors
//   data/editorial/**  = human-owned editorial annotations & review history
//   data/derived/**    = machine-derived suggestions (clearly not scholarship)

export type ContentLayer =
  | "source"           // Project Madurai text, verbatim
  | "parser-derived"   // segmentation, IDs, confidence, warnings
  | "machine-derived"  // keyword/concept/related suggestions, unicode analysis
  | "editorial"        // human-authored, reviewable annotation
  | "modern-pedagogy"; // modern teaching aids (letter classes, matra model)

// ---- Immutable source record (what the importer is allowed to own) ----
export type SourceSutraRecord = {
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
  sourceDetectedKeywords: string[]; // literal source matches (parser-derived)
  parsingConfidence: "high" | "medium" | "low";
  parsingNotes?: string[];
  source: {
    publisher: "Project Madurai";
    sourceId: "pmuni0100";
    url: string;
    accessNote: string;
    attribution: string;
  };
};

// ---- Editorial layer (human-owned) ----
export type EditorialAnnotationStatus = "not-started" | "draft" | "reviewed" | "verified";

export type FieldProvenance = {
  layer: "editorial";
  editorId?: string;   // opaque/role id; never expose personal data by default
  reviewerId?: string;
  createdAt?: string;
  updatedAt?: string;
  reviewedAt?: string;
};

export type EditorialField<T> = {
  value: T;
  status: EditorialAnnotationStatus;
  provenance: FieldProvenance;
  citations?: string[];
  notes?: string;
};

export type EditorialAnnotationFieldName =
  | "wordSeparatedText"
  | "simpleTamilExplanation"
  | "detailedTamilExplanation"
  | "englishExplanation"
  | "transliteration"
  | "concepts"
  | "glossaryTerms"
  | "relatedSutras"
  | "modernTeachingNote";

export type SutraEditorialAnnotation = {
  sutraId: string;
  wordSeparatedText?: EditorialField<string>;
  simpleTamilExplanation?: EditorialField<string>;
  detailedTamilExplanation?: EditorialField<string>;
  englishExplanation?: EditorialField<string>;
  transliteration?: EditorialField<string>;
  concepts?: EditorialField<string[]>;
  glossaryTerms?: EditorialField<string[]>;
  relatedSutras?: EditorialField<string[]>;
  modernTeachingNote?: EditorialField<string>;
  overallStatus: EditorialAnnotationStatus;
};

// ---- Machine-derived layer ----
export type DerivationMethod =
  | "literal-source-match"
  | "unicode-analysis"
  | "rule-engine"
  | "keyword-detection"
  | "machine-suggestion";

export type DerivedValue<T> = {
  value: T;
  layer: "machine-derived";
  method: DerivationMethod;
  generatedAt?: string;
  algorithmVersion?: string;
  confidence?: "high" | "medium" | "low";
};

export type SutraDerivedMetadata = {
  sutraId: string;
  sourceKeywords?: DerivedValue<string[]>;
  conceptSuggestions?: DerivedValue<string[]>;
  glossaryOccurrences?: DerivedValue<string[]>;
  relatedSutraSuggestions?: DerivedValue<string[]>;
};

// ---- Review / provenance history (append-only conceptually) ----
export type EditorialRevisionAction =
  | "created" | "updated" | "submitted-for-review" | "reviewed" | "verified" | "reopened";

export type EditorialRevision = {
  id: string;
  sutraId: string;
  field: EditorialAnnotationFieldName;
  action: EditorialRevisionAction;
  editorId?: string;
  reviewerId?: string;
  date: string; // ISO 8601
  note?: string;
};
