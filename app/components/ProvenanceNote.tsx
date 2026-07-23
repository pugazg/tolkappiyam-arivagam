import { Bi } from "./Bi";
import { EditorialReviewStatusBadge } from "./Badges";
import type { ResolvedField } from "@/lib/sutra-view.ts";

// A small labelled line stating which layer a displayed value came from, so no
// non-source value is ever shown without its provenance. For editorial values it
// also surfaces the human review status (a separate axis from parsing
// confidence); for machine-derived values it names the derivation method and
// makes clear the value is a mechanical suggestion, not scholarship.
const layerLabel: Record<ResolvedField<unknown>["layer"], [string, string]> = {
  source: ["மூலம்", "Source"],
  "parser-derived": ["பகுப்பான் பெற்றது", "Parser-derived"],
  "machine-derived": ["இயந்திரம் பெற்றது", "Machine-derived (suggestion)"],
  editorial: ["பதிப்பாசிரியர்", "Editorial"],
};

export function ProvenanceNote<T>({ field }: { field: ResolvedField<T> }) {
  const [ta, en] = layerLabel[field.layer];
  return (
    <p className="muted" style={{ fontSize: "0.78rem", marginTop: "0.6rem", display: "flex", flexWrap: "wrap", gap: "0.4rem", alignItems: "center" }}>
      <Bi ta="அடுக்கு" en="Layer" />: <strong>{<Bi ta={ta} en={en} />}</strong>
      {field.layer === "machine-derived" && field.method && (
        <span>· <code style={{ fontSize: "0.72rem" }}>{field.method}</code></span>
      )}
      {field.layer === "editorial" && field.reviewStatus && (
        <>
          <span>· <Bi ta="ஆய்வு நிலை" en="Review status" />:</span>
          <EditorialReviewStatusBadge status={field.reviewStatus} />
        </>
      )}
      {field.layer === "editorial" && field.reviewedAt && (
        <span>· <Bi ta="ஆய்வு" en="Reviewed" /> {field.reviewedAt}</span>
      )}
    </p>
  );
}
