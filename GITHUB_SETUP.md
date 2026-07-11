# Storing the source with the repo (no fetching) + pushing

The site never fetches from Project Madurai **at runtime**. To also avoid the
**build-time** download, commit the source and the parsed data into the repo so
the build reads local files. `.gitignore` now tracks `data/source/*.html` and
`data/generated/*.json` for exactly this reason.

## Step 1 — generate the data locally (one time)

Run this inside the project folder. It reads the Project Madurai source you
already have in the parent Codex folder (`../data/source/…`), copies it in, and
writes the parsed dataset — **no network needed**:

```bash
cd tolkappiyam-arivagam
npm install
npm run import:data
```

After this you will have:

```
data/source/project-madurai-pmuni0100.html   # the source, stored with us
data/generated/*.json                          # the parsed dataset
```

(If you ever run this somewhere without the parent source, use
`npm run import:data -- --fetch` to download it once.)

## Step 2 — commit and push

```bash
git add -A
git commit -m "Commit Project Madurai source + generated dataset (no build-time fetch)"
git push
```

Vercel redeploys automatically. Because the data is now present, the build skips
downloading entirely — you should see it generate **~1,600+ pages**, and the
build log will say *"Generated data present — skipping import."*

## Notes

- The build only downloads if `data/generated/` is empty. Once committed, it
  never fetches — at build or at runtime.
- To refresh the text later: `npm run import:data` (or `-- --fetch`), then commit.
- Deploy config: Vercel Next.js preset; set `NEXT_PUBLIC_SITE_URL`.
