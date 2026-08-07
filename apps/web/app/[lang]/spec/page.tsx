import { loadArticle } from "@human-ecmascript/content-compiler";
import Link from "next/link";

export default async function SpecPage({ params }: { params: Promise<{ lang: "en" | "ru" }> }) {
  const { lang } = await params;
  const article = loadArticle(lang, "reference-call-this");
  const title = lang === "ru" ? "Операции спецификации" : "Operation atlas";
  const intro =
    lang === "ru"
      ? "Здесь собраны операции, которые встречаются в первой теме. Каждая карточка ведёт к соответствующему разделу стабильной редакции ES2026."
      : "The local set of operations needed by the first learning path. Every card links to the stable ES2026 snapshot.";
  return (
    <main className="page-shell atlas-page">
      <div className="breadcrumbs">
        <Link href={`/${lang}/`}>Human ECMAScript</Link>
        <span>/</span>
        <span>{title}</span>
      </div>
      <p className="kicker">
        <span />
        ECMA-262 · ES2026
      </p>
      <h1>{title}</h1>
      <p className="atlas-intro">{intro}</p>
      <div className="atlas-grid">
        {article.citations
          .filter(({ snapshot }) => snapshot.startsWith("ECMA"))
          .map((citation) => (
            <a
              href={citation.url}
              target="_blank"
              rel="noreferrer"
              key={citation.id}
              className="atlas-card"
            >
              <span>{citation.nodeId}</span>
              <h2>{citation.label.replace(/^ECMA-262[^—]*—?\s*/, "")}</h2>
              <p>{citation.relevance}</p>
              <b>Open stable clause ↗</b>
            </a>
          ))}
      </div>
    </main>
  );
}
