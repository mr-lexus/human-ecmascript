import type { Metadata } from "next";
import Link from "next/link";
import { SearchBox } from "../../components/SearchBox";

const copy = {
  en: {
    kicker: "ECMA-262, made navigable",
    title: "Understand the machine behind the language.",
    intro:
      "A bilingual field guide that connects normative algorithms, human explanations, executable examples, and engine evidence without mixing their authority.",
    start: "Start the first path",
    explore: "Explore operations",
    pathLabel: "Learning path 01",
    pathTitle: "References, calls, and this",
    pathBody:
      "Follow `obj.method()` through seven specification transitions and seven observable pressure tests.",
    evidence: "Evidence layers",
    evidenceBody:
      "Every statement tells you whether it is normative, derived, observable, host-defined, or implementation-specific.",
    coverage: "MVP coverage",
    search: "Search this release",
  },
  ru: {
    kicker: "Спецификация JavaScript — без лишней тяжести",
    title: "Разберитесь, как JavaScript работает на самом деле.",
    intro:
      "Путеводитель связывает текст стандарта, понятные объяснения и код, который можно запустить. Всегда видно, где требование ECMA-262, а где — вывод или деталь конкретного движка.",
    start: "Разобрать первую тему",
    explore: "Посмотреть операции",
    pathLabel: "Первая тема",
    pathTitle: "Ссылки, вызовы и this",
    pathBody: "Разберём `obj.method()` по шагам и проверим выводы на семи коротких примерах.",
    evidence: "Откуда мы это знаем",
    evidenceBody:
      "У каждого технического утверждения есть метка и источник: стандарт, логический вывод, запускаемый пример или данные конкретного движка.",
    coverage: "Готово в MVP",
    search: "Найти тему или операцию",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: "en" | "ru" }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "ru" ? "Путеводитель по ECMA-262" : "An evidence-backed ECMA-262 guide",
    alternates: { languages: { en: "/en/", ru: "/ru/" } },
  };
}

export default async function HomePage({ params }: { params: Promise<{ lang: "en" | "ru" }> }) {
  const { lang } = await params;
  const t = copy[lang];
  return (
    <main>
      <section className="home-hero">
        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
        <div className="page-shell hero-grid">
          <div className="hero-copy">
            <p className="kicker">
              <span />
              {t.kicker}
            </p>
            <h1>{t.title}</h1>
            <p className="hero-intro">{t.intro}</p>
            <div className="hero-actions">
              <Link className="primary-button" href={`/${lang}/guide/reference-call-this/`}>
                {t.start}
              </Link>
              <Link className="text-link" href={`/${lang}/spec/`}>
                {t.explore} <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
          <div className="hero-specimen" aria-label="Reference Record preview">
            <div className="specimen-topline">
              <span>Reference Record</span>
              <span>ES2026</span>
            </div>
            <pre>
              <code>{`{
  [[Base]]: obj,
  [[ReferencedName]]: "method",
  [[Strict]]: true
}`}</code>
            </pre>
            <div className="specimen-flow">
              <span>MemberExpression</span>
              <b>→</b>
              <span>EvaluateCall</span>
              <b>→</b>
              <span>this</span>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell home-section">
        <div className="section-heading">
          <div>
            <p className="overline">{t.pathLabel}</p>
            <h2>{t.pathTitle}</h2>
          </div>
          <div className="coverage-ring">
            <strong>1</strong>
            <span>
              / 1<br />
              MVP
            </span>
          </div>
        </div>
        <Link className="path-card" href={`/${lang}/guide/reference-call-this/`}>
          <div className="path-number">01</div>
          <div>
            <h3>{t.pathTitle}</h3>
            <p>{t.pathBody}</p>
          </div>
          <div className="path-meta">
            <span>18–20 min</span>
            <span>7 examples</span>
            <span aria-hidden="true">→</span>
          </div>
        </Link>
      </section>

      <section className="evidence-band">
        <div className="page-shell evidence-grid">
          <div>
            <p className="overline">{t.evidence}</p>
            <h2>{t.evidence}</h2>
            <p>{t.evidenceBody}</p>
          </div>
          <div className="evidence-stack">
            {["NORMATIVE", "DERIVED", "OBSERVABLE", "V8_IMPLEMENTATION"].map((label, index) => (
              <div className={`evidence-chip evidence-${index}`} key={label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell search-section">
        <p className="overline">{t.search}</p>
        <SearchBox locale={lang} />
      </section>
    </main>
  );
}
