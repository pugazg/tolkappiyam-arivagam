import { getSutra, sutras } from "@/lib/data.ts";
import { buildSutraViewModel } from "@/lib/editorial.ts";

// Machine-readable JSON for a single நூற்பா, at a stable address:
//   /api/sutra/<id>   e.g. /api/sutra/ezhuthu-noolmarabu-001
// Pre-rendered as static JSON at build time — no runtime data dependency.
export function generateStaticParams() {
  return sutras.map((s) => ({ id: s.id }));
}

export const dynamic = "force-static";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const sutra = getSutra(id);
  if (!sutra) {
    return Response.json({ error: "நூற்பா not found", id }, { status: 404 });
  }
  // Backward-compatible: all existing top-level SutraRecord fields are preserved
  // verbatim. `layers` is ADDITIVE — the merged editorial + machine-derived
  // layers (each null when absent), never overriding or renaming source keys.
  const { editorial, derived } = buildSutraViewModel(sutra, id);
  return Response.json({ ...sutra, layers: { editorial, derived } });
}
