import type { MetadataRoute } from "next";
import { adhikarams, iyals, sutras } from "@/lib/data.ts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tolkappiyam-arivagam.example";
  const staticRoutes = ["", "/browse", "/search", "/glossary", "/tools", "/tools/tamil-letters", "/tools/letter-classifier", "/tools/matra-explorer", "/tools/ani-ilakkanam", "/source", "/methodology", "/about", "/understanding", "/commentaries"];
  const entries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({ url: `${base}${r}`, changeFrequency: "monthly", priority: r === "" ? 1 : 0.7 }));
  for (const a of adhikarams) entries.push({ url: `${base}/adhikaram/${a.id}`, changeFrequency: "monthly", priority: 0.6 });
  for (const i of iyals) entries.push({ url: `${base}/adhikaram/${i.adhikaramId}/${i.id}`, changeFrequency: "monthly", priority: 0.6 });
  for (const s of sutras) entries.push({ url: `${base}/sutra/${s.id}`, changeFrequency: "yearly", priority: 0.5 });
  return entries;
}
