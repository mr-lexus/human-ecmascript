import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { loadArticle } from "../packages/content-compiler/src/index.ts";

// Optional network audit, separate from the offline build. No source text is
// redistributed. Hash exact source elements with CRLF normalized to LF.
const pins = {
  ecma: "0248456c758431e4bb8e5d26333ff1865123c9cd",
  html: "58eecd01b9a2e8fa1cbaffc888305ba4f7dcfb2e",
};
const sha = (value: string) => createHash("sha256").update(value).digest("hex");
async function fetchSource(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  return (await response.text()).replace(/\r\n/g, "\n");
}
const [ecma, html] = await Promise.all([
  fetchSource(`https://raw.githubusercontent.com/tc39/ecma262/${pins.ecma}/spec.html`),
  fetchSource(`https://raw.githubusercontent.com/whatwg/html/${pins.html}/source`),
]);

function ecmaFragment(nodeId: string): string {
  const marker = ecma.indexOf(`id="${nodeId}"`);
  if (marker < 0) throw new Error(`Missing pinned ECMA clause ${nodeId}`);
  const start = ecma.lastIndexOf("<emu-", marker);
  const tags = /<\/?emu-(?:clause|annex|intro)\b[^>]*>/g;
  tags.lastIndex = start;
  let depth = 0;
  for (let match; (match = tags.exec(ecma));) {
    depth += match[0].startsWith("</") ? -1 : 1;
    if (depth === 0) return ecma.slice(start, tags.lastIndex);
  }
  throw new Error(`Unclosed pinned ECMA clause ${nodeId}`);
}
function htmlFragment(id: string): string {
  const heading = "<h5>The <code>HTMLAllCollection</code> interface</h5>";
  const paragraph =
    '<p>The <dfn attribute for="Document"><code data-x="dom-document-all">all</code></dfn> attribute';
  const start = html.indexOf(id === "html-all-collection" ? heading : paragraph);
  if (start < 0) throw new Error(`Missing pinned HTML fragment ${id}`);
  const end =
    id === "html-all-collection"
      ? html.indexOf("<h5>", start + 4)
      : html.indexOf("</p>", start) + 4;
  if (end <= start) throw new Error(`Unclosed pinned HTML fragment ${id}`);
  return html.slice(start, end);
}

const article = loadArticle("en", "typeof-not-type-query");
const citations = Object.fromEntries(
  article.citations.map((citation) => [
    citation.id,
    sha(
      citation.snapshot.startsWith("HTML-")
        ? htmlFragment(citation.id)
        : ecmaFragment(citation.nodeId),
    ),
  ]),
);
const claims = Object.fromEntries(
  article.sections
    .flatMap(({ blocks }) => blocks)
    .flatMap((block) => (block.type === "claims" ? block.claims : []))
    .map((claim) => [
      claim.id,
      sha(
        JSON.stringify({
          citations: claim.citationIds.map((id) => ({ id, evidenceHash: citations[id] })),
          examples: article.examples
            .filter(({ claimIds }) => claimIds.includes(claim.id))
            .map((example) => ({
              id: example.id,
              sourceSha256: sha(readFileSync(example.sourcePath, "utf8").replace(/\r\n/g, "\n")),
            })),
        }),
      ),
    ]),
);

if (process.argv.includes("--print")) {
  console.log(JSON.stringify({ citations, claims }));
} else {
  for (const locale of ["en", "ru"] as const) {
    const translated = loadArticle(locale, article.slug);
    for (const citation of translated.citations) {
      if (citation.evidenceHash !== citations[citation.id])
        throw new Error(`${locale}: stale citation ${citation.id}`);
      const source = article.citations.find(({ id }) => id === citation.id)!;
      if (
        citation.snapshot !== source.snapshot ||
        citation.nodeId !== source.nodeId ||
        citation.url !== source.url
      ) {
        throw new Error(`${locale}: source provenance differs for ${citation.id}`);
      }
    }
    for (const block of translated.sections.flatMap(({ blocks }) => blocks)) {
      if (block.type !== "claims") continue;
      for (const claim of block.claims) {
        if (claim.sourceFingerprint !== claims[claim.id])
          throw new Error(`${locale}: stale claim ${claim.id}`);
      }
    }
  }
  console.log(
    `typeof evidence verified against pinned ECMA-262 and HTML: ${Object.keys(citations).length} citations, ${Object.keys(claims).length} claims, EN/RU`,
  );
}
