import Link from "next/link";
import type { CompiledArticle } from "@human-ecmascript/model";
import { ArticleModes } from "./ArticleModes";
import { ExampleLab } from "./ExampleLab";
import { KnowledgeMap } from "./KnowledgeMap";

export function GuideArticlePage({
  article,
  locale,
  sequence,
}: Readonly<{
  article: CompiledArticle;
  locale: "en" | "ru";
  sequence: number;
}>) {
  const isDeclarationTopic = article.slug === "const-let-var";
  const labels =
    locale === "ru"
      ? {
          path: "Тема",
          objectives: "После этой темы вы сможете",
          map: isDeclarationTopic ? "Карта переменных" : "Схема вызова",
          lab: "Примеры, которые можно запустить",
          sources: "На что мы опираемся",
          status:
            article.status === "READY" ? "Сверено с ES2026" : "На технической проверке · ES2026",
          minutes: "мин",
          examples: "примеров",
        }
      : {
          path: "Learning path",
          objectives: "After this topic, you can",
          map: isDeclarationTopic ? "Binding map" : "Evaluation map",
          lab: "Example laboratory",
          sources: "Sources and provenance",
          status:
            article.status === "READY" ? "Verified against ES2026" : "Technical review · ES2026",
          minutes: "min",
          examples: "examples",
        };

  return (
    <main>
      <header className="article-hero">
        <div className="page-shell article-hero-grid">
          <div>
            <div className="breadcrumbs">
              <Link href={`/${locale}/`}>Human ECMAScript</Link>
              <span>/</span>
              <span>
                {labels.path} {String(sequence).padStart(2, "0")}
              </span>
            </div>
            <p className="kicker">
              <span />
              {article.eyebrow}
            </p>
            <h1>{article.title}</h1>
            <p className="article-dek">{article.dek}</p>
            <div className="article-meta">
              <span>
                {article.readingMinutes} {labels.minutes}
              </span>
              <span>
                {article.examples.length} {labels.examples}
              </span>
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
        <ArticleModes
          sections={article.sections}
          citations={article.citations}
          bytecodeArtifacts={article.bytecodeArtifacts}
          locale={locale}
        />
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
          locale={locale}
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
