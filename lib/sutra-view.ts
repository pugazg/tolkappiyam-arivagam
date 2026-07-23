// Pure, fully-serializable resolution of a நூற்பா's display fields from the three
// data layers (source / machine-derived / editorial). This module has NO
// filesystem or React dependency: it takes an already-built view model and
// returns plain objects safe to pass as props into the client `SutraReader`.
//
// Precedence (per the project layer rules):
//   1. human editorial value (if present and non-empty)
//   2. source value, ONLY where the field legitimately exists in the source layer
//   3. machine-derived suggestion (clearly labelled; never silently overriding 1/2)
//   4. otherwise absent -> the UI renders an honest placeholder
//
// Every non-source value carries its provenance layer, so the reader can always
// see where a value came from and (for editorial) its review status.
import type { SutraRecord } from "./types.ts";
import type {
  SutraEditorialAnnotation,
  SutraDerivedMetadata,
  EditorialField,
  EditorialReviewStatus,
  DerivationMethod,
} from "./layers.ts";
import type { SourceProcessingStatus, ParsingConfidence } from "./types.ts";

export type FieldLayer = "source" | "parser-derived" | "machine-derived" | "editorial";

export type ResolvedField<T> = {
  value: T;
  layer: FieldLayer;
  // Present only when layer === "editorial":
  reviewStatus?: EditorialReviewStatus;
  editorId?: string;
  reviewerId?: string;
  updatedAt?: string;
  reviewedAt?: string;
  // Present only when layer === "machine-derived":
  method?: DerivationMethod;
};

export type ResolvedSutraView = {
  id: string;
  originalLines: string[];
  // Three INDEPENDENT status axes — never derived from one another.
  sourceProcessingStatus: SourceProcessingStatus;
  editorialReviewStatus: EditorialReviewStatus;
  parsingConfidence: ParsingConfidence;
  fields: {
    wordSeparatedText: ResolvedField<string> | null;
    transliteration: ResolvedField<string> | null;
    simpleTamilExplanation: ResolvedField<string> | null;
    detailedTamilExplanation: ResolvedField<string> | null;
    englishExplanation: ResolvedField<string> | null;
    scholarlyNotes: ResolvedField<string> | null;
    concepts: ResolvedField<string[]> | null;
  };
};

export type SutraViewModelInput = {
  source: SutraRecord;
  editorial: SutraEditorialAnnotation | null;
  derived: SutraDerivedMetadata | null;
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

// Resolve a prose field that legitimately exists ONLY in the editorial layer.
// Source never supplies interpretive prose, so this is editorial-or-absent.
function editorialProse(
  field: EditorialField<string> | undefined,
): ResolvedField<string> | null {
  if (!field || !isNonEmptyString(field.value)) return null;
  return {
    value: field.value,
    layer: "editorial",
    reviewStatus: field.status,
    editorId: field.provenance.editorId,
    reviewerId: field.provenance.reviewerId,
    updatedAt: field.provenance.updatedAt,
    reviewedAt: field.provenance.reviewedAt,
  };
}

// Concepts legitimately exist in the parser-derived source layer (literal source
// keyword matches). Precedence: editorial > source(parser-derived) > machine.
function resolveConcepts(vm: SutraViewModelInput): ResolvedField<string[]> | null {
  const ed = vm.editorial?.concepts;
  if (ed && Array.isArray(ed.value) && ed.value.length > 0) {
    return {
      value: ed.value,
      layer: "editorial",
      reviewStatus: ed.status,
      editorId: ed.provenance.editorId,
      reviewerId: ed.provenance.reviewerId,
      updatedAt: ed.provenance.updatedAt,
      reviewedAt: ed.provenance.reviewedAt,
    };
  }
  if (Array.isArray(vm.source.concepts) && vm.source.concepts.length > 0) {
    return { value: vm.source.concepts, layer: "parser-derived" };
  }
  const dv = vm.derived?.conceptSuggestions;
  if (dv && Array.isArray(dv.value) && dv.value.length > 0) {
    return { value: dv.value, layer: "machine-derived", method: dv.method };
  }
  return null;
}

export function resolveSutraView(vm: SutraViewModelInput): ResolvedSutraView {
  const ed = vm.editorial;
  return {
    id: vm.source.id,
    originalLines: vm.source.originalLines,
    sourceProcessingStatus: vm.source.editorialStatus,
    editorialReviewStatus: ed?.overallStatus ?? "not-started",
    parsingConfidence: vm.source.parsingConfidence,
    fields: {
      wordSeparatedText: editorialProse(ed?.wordSeparatedText),
      transliteration: editorialProse(ed?.transliteration),
      simpleTamilExplanation: editorialProse(ed?.simpleTamilExplanation),
      detailedTamilExplanation: editorialProse(ed?.detailedTamilExplanation),
      englishExplanation: editorialProse(ed?.englishExplanation),
      scholarlyNotes: editorialProse(ed?.modernTeachingNote),
      concepts: resolveConcepts(vm),
    },
  };
}

// Related நூற்பாக்கள்: precedence editorial > source(machine-computed lexical link).
// Returns the id list plus the layer it came from; the page resolves ids to
// display rows (that requires cross-sutra lookup, kept out of this pure module).
export function resolveRelatedIds(vm: SutraViewModelInput): { ids: string[]; layer: FieldLayer } {
  const ed = vm.editorial?.relatedSutras;
  if (ed && Array.isArray(ed.value) && ed.value.length > 0) {
    return { ids: ed.value, layer: "editorial" };
  }
  return { ids: vm.source.relatedSutras ?? [], layer: "machine-derived" };
}
