import type { ReactNode, JSX } from "react";

// Renders both Tamil and English; CSS shows only the active interface language.
// Source நூற்பா text must NOT be wrapped in this — it always stays Tamil.
export function Bi({
  ta,
  en,
  as = "span",
  className = "",
}: {
  ta: ReactNode;
  en: ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}) {
  const Tag = as as "span";
  return (
    <>
      <Tag className={`i18n-ta ${className}`} lang="ta">{ta}</Tag>
      <Tag className={`i18n-en ${className}`} lang="en">{en}</Tag>
    </>
  );
}
