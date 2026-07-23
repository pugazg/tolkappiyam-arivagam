import Link from "next/link";
import { Bi } from "@/app/components/Bi";
import type { SutraRecord } from "@/lib/types.ts";
import { SourceProcessingStatusBadge } from "./Badges";

export function SutraCard({ sutra, showIyal = true }: { sutra: SutraRecord; showIyal?: boolean }) {
  return (
    <Link href={`/sutra/${sutra.id}`} className="card card-link">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
        <span className="sutra-num"><Bi ta="நூற்பா" en="Aphorism" /> {sutra.displayNumber}</span>
        <SourceProcessingStatusBadge status={sutra.editorialStatus} />
      </div>
      <p className="tamil-serif" style={{ fontSize: "1.15rem", lineHeight: 1.9, color: "var(--ink)", margin: 0 }}>
        {sutra.originalLines[0]}
        {sutra.originalLines.length > 1 ? " …" : ""}
      </p>
      {showIyal && (
        <p className="muted" style={{ fontSize: "0.85rem", marginTop: "0.7rem" }}>
          {sutra.adhikaramTamil} · {sutra.iyalEditorialTamil ?? sutra.iyalTamil}
        </p>
      )}
    </Link>
  );
}
