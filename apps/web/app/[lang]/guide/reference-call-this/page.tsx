import type { Metadata } from "next";
import Link from "next/link";
import { loadArticle } from "@human-ecmascript/content-compiler";
import { ArticleModes } from "../../../../components/ArticleModes";
import { ExampleLab } from "../../../../components/ExampleLab";
import { KnowledgeMap } from "../../../../components/KnowledgeMap";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: "en" | "ru" }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const article = loadArticle(lang, "reference-call-this");
  return {
    title: article.title,
    description: article.dek,
    alternates: {
      languages: { en: "/en/guide/reference-call-this/", ru: "/ru/guide/reference-call-this/" },
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ lang: "en" | "ru" }> }) {
  const { lang } = await params;
  const article = loadArticle(lang, "reference-call-this");
  const labels =
    lang === "ru"
      ? {
          path: "Тема",
          objectives: "В этой теме вы разберётесь",
          map: "Схема вызова",
          lab: "Примеры, которые можно запустить",
          sources: "На что мы опираемся",
          status: "Сверено с ES2026",
        }
      : {
          path: "Learning path",
          objectives: "After this topic, you can",
          map: "Evaluation map",
          lab: "Example laboratory",
          sources: "Sources and provenance",
          status: "Verified against ES2026",
        };

  return (
    <main>
      <header className="article-hero">
        <div className="page-shell article-hero-grid">
          <div>
            <div className="breadcrumbs">
              <Link href={`/${lang}/`}>Human ECMAScript</Link>
              <span>/</span>
              <span>{labels.path} 01</span>
            </div>
            <p className="kicker">
              <span />
              {article.eyebrow}
            </p>
            <h1>{article.title}</h1>
            <p className="article-dek">{article.dek}</p>
            <div className="article-meta">
              <span>{article.readingMinutes} min</span>
              <span>{article.examples.length} examples</span>
              <span className="verified-dot">●</span>
              <span>{labels.status}</span>
            </div>
          </div>
          <aside className="objectives-card">
            <p className="overline">{labels.objectives}</p>
            <ol>
              {article.learningObjectives.map((objective) => (
                <li key={objective}>{objective}</li>
              ))}
            </ol>
          </aside>
        </div>
      </header>

      <section className="page-shell article-content">
        <ArticleModes sections={article.sections} citations={article.citations} locale={lang} />
      </section>

      <section className="map-section">
        <div className="page-shell">
          <div className="section-heading compact">
            <div>
              <p className="overline">{labels.map}</p>
              <h2>{labels.map}</h2>
            </div>
            <span className="source-pill">ECMA-262 · ES2026</span>
          </div>
          <KnowledgeMap nodes={article.graph.nodes} edges={article.graph.edges} />
        </div>
      </section>

      <section className="page-shell lab-section">
        <div className="section-heading compact">
          <div>
            <p className="overline">{labels.lab}</p>
            <h2>{labels.lab}</h2>
          </div>
        </div>
        <ExampleLab
          examples={article.examples}
          sources={article.exampleSources}
          engineResults={article.engineResults}
          locale={lang}
        />
      </section>

      <section className="sources-section">
        <div className="page-shell">
          <p className="overline">{labels.sources}</p>
          <h2>{labels.sources}</h2>
          <div className="source-list">
            {article.citations.map((citation, index) => (
              <a href={citation.url} target="_blank" rel="noreferrer" key={citation.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{citation.label}</strong>
                <small>{citation.relevance}</small>
                <b aria-hidden="true">↗</b>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
