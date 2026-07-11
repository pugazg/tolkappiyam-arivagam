import Link from "next/link";
import { Fragment, type ReactNode } from "react";

export type Crumb = { label: ReactNode; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="crumbs">
      {items.map((c, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="sep" aria-hidden>›</span>}
          {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
        </Fragment>
      ))}
    </nav>
  );
}

// Common bilingual root crumbs
export const crumbHome = { ta: "முகப்பு", en: "Home" };
