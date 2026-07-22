# Terminology & transliteration policy

The single source of truth for technical terms is `lib/terminology.ts`
(`TERMINOLOGY: TerminologyEntry[]`). UI strings should read term forms from there
so a term is displayed consistently across every page.

## Transliteration convention

**ISO 15919** (diacritic Roman) is the one chosen convention. Do **not** mix in
ad-hoc romanisations (e.g. "Nool Marabu"). Examples: நூற்பா → *Nūṟpā*,
நூல் மரபு → *Nūl marapu*, மாத்திரை → *Māttirai*.

## Technical-term display policy

The **Tamil term is authoritative.** In English UI:

- Prefer the Tamil term with its transliteration as the label.
- An `englishExplanation` is a *UI explanation*, shown alongside — it does **not**
  replace the Tamil technical term.
- Interpretive English equivalents (e.g. நூற்பா → "aphorism", உவமை → "simile") are
  offered as glosses, not as authoritative translations of the source.
- Source titles and bibliographic metadata are never translated.

## Standardised forms

| id | Tamil | Transliteration (ISO 15919) | English label | English explanation |
|---|---|---|---|---|
| `nutpa` | நூற்பா | Nūṟpā | Nūṟpā | A numbered grammatical verse / aphoristic rule-unit |
| `athikaram` | அதிகாரம் | Atikāram | Book | One of the three major divisions |
| `iyal` | இயல் | Iyal | Chapter | A chapter within an அதிகாரம் |
| `ezhuthu-athikaram` | எழுத்ததிகாரம் | Eḻuttatikāram | Eḻuttatikāram | Book on letters / phonology |
| `sol-athikaram` | சொல்லதிகாரம் | Collatikāram | Collatikāram | Book on words / morphosyntax |
| `porul-athikaram` | பொருளதிகாரம் | Poruḷatikāram | Poruḷatikāram | Book on subject-matter / poetics |
| `noolmarabu` | நூல் மரபு | Nūl marapu | Nūl marapu | First இயல்: letters, count, vowel/consonant length |
| `mattirai` | மாத்திரை | Māttirai | Māttirai | Prosodic duration (mora) |
| `kutriyalukaram` | குற்றியலுகரம் | Kuṟṟiyalukaram | Kuṟṟiyalukaram | Shortened word-final u (½ மாத்திரை) |

## Migration note

`lib/terminology.ts` and `lib/routes.ts` are the central sources. Existing pages
are being migrated to read from them incrementally; new UI must use them.
Transliteration is a **reading aid**, not a UI language — the UI language state
remains `UiLanguage = "ta" | "en"` (`lib/useUiLang.ts`).
