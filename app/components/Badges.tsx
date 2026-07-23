import type { SourceProcessingStatus, ParsingConfidence } from "@/lib/types.ts";
import type { EditorialReviewStatus } from "@/lib/layers.ts";
import { Bi } from "./Bi";

// ---- Source-processing status (importer-generated; NOT human review) ----
// Label at call sites: "Source processing status / மூலச் செயலாக்க நிலை".
const sourceProcessingLabel: Record<SourceProcessingStatus, [string, string]> = {
  "source-only": ["மூலம் மட்டும்", "Source only"],
  segmented: ["பகுக்கப்பட்டது", "Segmented"],
  reviewed: ["மதிப்பாய்வு", "Reviewed"],
  explained: ["விளக்கம்", "Explained"],
  verified: ["சரிபார்க்கப்பட்டது", "Verified"],
};
const sourceProcessingClass: Record<SourceProcessingStatus, string> = {
  "source-only": "badge-source",
  segmented: "badge-segmented",
  reviewed: "badge-review",
  explained: "badge-review",
  verified: "badge-verified",
};

export function SourceProcessingStatusBadge({ status }: { status: SourceProcessingStatus }) {
  const [ta, en] = sourceProcessingLabel[status];
  return <span className={`badge ${sourceProcessingClass[status]}`}><Bi ta={ta} en={en} /></span>;
}

// ---- Human editorial review status (separate axis; never inferred) ----
// Label at call sites: "Editorial review status / பதிப்பாசிரியர் ஆய்வு நிலை".
const editorialReviewLabel: Record<EditorialReviewStatus, [string, string]> = {
  "not-started": ["தொடங்கப்படவில்லை", "Not started"],
  draft: ["வரைவு", "Draft"],
  reviewed: ["ஆய்வு செய்யப்பட்டது", "Reviewed"],
  verified: ["உறுதிப்படுத்தப்பட்டது", "Verified"],
};
const editorialReviewClass: Record<EditorialReviewStatus, string> = {
  "not-started": "badge-source",
  draft: "badge-segmented",
  reviewed: "badge-review",
  verified: "badge-verified",
};

export function EditorialReviewStatusBadge({ status }: { status: EditorialReviewStatus }) {
  const [ta, en] = editorialReviewLabel[status];
  return <span className={`badge ${editorialReviewClass[status]}`}><Bi ta={ta} en={en} /></span>;
}

// ---- Parsing confidence (third independent axis) ----
const confLabel: Record<ParsingConfidence, [string, string]> = {
  high: ["உயர் நம்பகம்", "High confidence"],
  medium: ["இடை நம்பகம்", "Medium confidence"],
  low: ["குறை நம்பகம்", "Low confidence"],
};
export function ConfidenceBadge({ confidence }: { confidence: ParsingConfidence }) {
  const [ta, en] = confLabel[confidence];
  return <span className={`badge badge-${confidence}`}><Bi ta={ta} en={en} /></span>;
}
