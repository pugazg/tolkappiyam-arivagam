import type { EditorialStatus, ParsingConfidence } from "@/lib/types.ts";
import { Bi } from "./Bi";

const statusLabel: Record<EditorialStatus, [string, string]> = {
  "source-only": ["மூலம் மட்டும்", "Source only"],
  segmented: ["பிரிக்கப்பட்டது", "Segmented"],
  reviewed: ["மதிப்பாய்வு", "Reviewed"],
  explained: ["விளக்கம்", "Explained"],
  verified: ["சரிபார்க்கப்பட்டது", "Verified"],
};
const statusClass: Record<EditorialStatus, string> = {
  "source-only": "badge-source",
  segmented: "badge-segmented",
  reviewed: "badge-review",
  explained: "badge-review",
  verified: "badge-verified",
};

export function StatusBadge({ status }: { status: EditorialStatus }) {
  const [ta, en] = statusLabel[status];
  return <span className={`badge ${statusClass[status]}`}><Bi ta={ta} en={en} /></span>;
}

const confLabel: Record<ParsingConfidence, [string, string]> = {
  high: ["உயர் நம்பகம்", "High confidence"],
  medium: ["இடை நம்பகம்", "Medium confidence"],
  low: ["குறை நம்பகம்", "Low confidence"],
};
export function ConfidenceBadge({ confidence }: { confidence: ParsingConfidence }) {
  const [ta, en] = confLabel[confidence];
  return <span className={`badge badge-${confidence}`}><Bi ta={ta} en={en} /></span>;
}
