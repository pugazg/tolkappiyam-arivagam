export function EditorialPlaceholder({
  tamil = "விரைவில் சேர்க்கப்படும்",
  english = "This layer is under editorial review and has not been added yet.",
}: { tamil?: string; english?: string }) {
  return (
    <div className="placeholder">
      <p className="tamil" style={{ margin: "0 0 0.35rem", color: "var(--ink-soft)" }}>{tamil}</p>
      <p style={{ margin: 0, fontSize: "0.9rem" }}>{english}</p>
    </div>
  );
}
