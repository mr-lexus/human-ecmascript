import type { Metadata } from "next";
import Link from "next/link";
import { computeSiteStats, loadArticle } from "@human-ecmascript/content-compiler";
import { SearchBox } from "../../components/SearchBox";
import { REPO_URL } from "../../lib/challengeIssueUrl";
import { formatStatus } from "../../lib/statusLabels";

const slugs = ["reference-call-this", "const-let-var", "values-types-memory"] as const;

const copy = {
  en: {
    kicker: "More than documentation",
    title: "Understand the machine behind the language.",
    intro:
      "Human ECMAScript is an evidence-backed knowledge system, not just a documentation site. Every technical claim is modeled, sourced, classified, tested, versioned, and reviewed before it is compiled into a bilingual guide — and specification semantics are never silently mixed with engine behavior.",
    start: "Start the first path",
    explore: "Explore operations",
    pathLabel: "Learning paths",
    pathTitle: "References, calls, and this",
    pathBody:
      "Follow `obj.method()` and `new C()` from receiver selection to focused observable checks.",
    declarationTitle: "const, let, and var without folklore",
    declarationBody:
      "Trace initialization, TDZ, scopes, loop bindings, and the real performance boundary behind each declaration.",
    valuesTitle: "Primitive values, Reference Records, and actual storage",
    valuesBody:
      "Trace name resolution in ECMA-262, then compare local and captured Smi, String, and Symbol storage in pinned V8 bytecode.",
    evidence: "Evidence layers",
    evidenceTitle: "Four layers, four authorities",
    evidenceBody:
      "Every claim carries a classification, and the classifications are not interchangeable: they carry different authority.",
    evidenceDescs: [
      "Direct requirements of the pinned ECMA-262 edition.",
      "Conclusions derived step by step from cited algorithms — inspectable, not taken on authority.",
      "Behavior demonstrated by executable examples with pinned expected output.",
      "Details of one pinned V8 build — evidence about an engine, never a universal rule.",
    ],
    now: "NOW",
    whyOverline: "Why this exists",
    whyTitle: "JavaScript explanations mix levels of truth.",
    whyBody:
      "A single paragraph often blends what ECMA-262 normatively requires, what follows from its algorithms, what code can observably demonstrate, and what one engine happens to implement. Human ECMAScript keeps these layers distinct — and still makes the language understandable.",
    whyLayers: [
      "What the standard normatively requires",
      "What can be derived from its algorithms",
      "What code can observably demonstrate",
      "What a particular engine happens to implement",
    ],
    pipelineOverline: "Publication pipeline",
    pipelineTitle: "How knowledge gets published.",
    pipelineLead:
      "Human ECMAScript does not begin by writing an article. It begins by investigating a falsifiable technical question and decomposing it into claims that can be supported, challenged, or left unresolved.",
    pipelineSteps: [
      ["QUESTION", "A falsifiable technical question"],
      ["PRIMARY SOURCES", "Pinned ECMA-262 clauses, engine documentation, resolved commits"],
      ["ATOMIC CLAIMS", "Small reviewable assertions with stable IDs"],
      ["EVIDENCE + CLASSIFICATION", "Each claim carries citations and an authority label"],
      [
        "EXECUTABLE PRESSURE TESTS",
        "Boundary examples with expected output, executed on every build",
      ],
      ["ENGINE EVIDENCE", "Versioned V8 artifacts with binary hashes"],
      ["REVIEW", "Technical review gates before a publication state advances"],
      ["EN / RU PARITY", "Semantic structure validated across both locales"],
      ["PUBLISHED ARTICLE", "Compiled into the static site you are reading"],
    ],
    snapshotAria: "Verification snapshot",
    snapTopics: "bilingual topics (EN/RU)",
    snapExamples: "executable examples, verified on every build",
    snapVerified: "verified V8 baselines",
    snapPending: "engine baselines pending",
    snapClaims: "modeled claims",
    snapCitations: "primary-source citations",
    snapshotNote:
      "Computed from structured content at build time. Pending baselines are shown as pending, never as verified.",
    hoodOverline: "Under the hood",
    hoodTitle: "The site is compiled from evidence.",
    hoodBody:
      "Public pages are generated from structured, evidence-backed content. There is no database or backend in production — the deployed site is a static export.",
    hoodThesis: "The public website is the presentation layer, not the project's source of truth.",
    hoodStaleness:
      "Knowledge can expire when its evidence changes. Source fragments, examples, and engine artifacts are fingerprinted, and the architecture is designed to detect drift: when a fingerprint changes, dependent material can be marked stale and require review again. Fingerprints prevent silent drift; fully automatic invalidation of every ECMA-262-dependent claim is a design goal, not a finished feature.",
    aiTitle: "AI is not a source.",
    aiBody:
      "AI may assist search, synthesis, drafting, and translation, but AI output is not evidence. Published claims trace back to primary specifications and documentation, reproducible observable behavior, versioned implementation evidence, and explicit human review.",
    search: "Search this release",
  },
  ru: {
    kicker: "Больше, чем документация",
    title: "Разберитесь, как JavaScript работает на самом деле.",
    intro:
      "Human ECMAScript — это система знаний с основаниями и проверками, а не просто сайт документации. Каждое техническое утверждение моделируется, получает источник, классификацию, тесты, версию и проверку — и только потом компилируется в двуязычный путеводитель. Семантика стандарта никогда не смешивается незаметно с поведением движков.",
    start: "Разобрать первую тему",
    explore: "Посмотреть операции",
    pathLabel: "Учебные темы",
    pathTitle: "Ссылки, вызовы и this",
    pathBody: "Разберём `obj.method()` и `new C()`: от выбора `this` до проверок в коде.",
    declarationTitle: "const, let и var — без мифов",
    declarationBody:
      "Разберём инициализацию, TDZ, области видимости, циклы и честные правила выбора без мифов о скорости.",
    valuesTitle: "Primitive value, Reference Record и реальное хранение",
    valuesBody:
      "Проследим поиск имени по ECMA-262 и сравним хранение локальных и захваченных Smi, String и Symbol в закреплённом V8.",
    evidence: "Откуда мы это знаем",
    evidenceTitle: "Четыре уровня, четыре авторитетности",
    evidenceBody:
      "У каждого утверждения есть классификация, и классификации не взаимозаменяемы: у них разная авторитетность.",
    evidenceDescs: [
      "Прямые требования закреплённой редакции ECMA-262.",
      "Выводы, полученные по шагам из процитированных алгоритмов: их можно проверить, а не принимать на веру.",
      "Поведение, продемонстрированное исполняемыми примерами с закреплённым ожидаемым выводом.",
      "Детали одной закреплённой сборки V8: свидетельство о движке, а не правило для всех движков.",
    ],
    now: "СЕЙЧАС",
    whyOverline: "Зачем этот проект",
    whyTitle: "Объяснения JavaScript смешивают уровни истины.",
    whyBody:
      "В одном абзаце часто смешаны нормативные требования ECMA-262, выводы из её алгоритмов, наблюдаемое поведение кода и то, как делает конкретный движок. Human ECMAScript разделяет эти слои — не теряя понятности языка.",
    whyLayers: [
      "Что стандарт требует нормативно",
      "Что следует из его алгоритмов",
      "Что можно продемонстрировать кодом",
      "Что реализует конкретный движок",
    ],
    pipelineOverline: "Конвейер публикации",
    pipelineTitle: "Как знание попадает на сайт.",
    pipelineLead:
      "Human ECMAScript начинается не с написания статьи, а с исследования проверяемого технического вопроса и разложения его на утверждения, которые можно подтвердить, оспорить или явно оставить открытыми.",
    pipelineSteps: [
      ["ВОПРОС", "Проверяемый технический вопрос"],
      [
        "ПЕРВИЧНЫЕ ИСТОЧНИКИ",
        "Закреплённые разделы ECMA-262, документация движков, зафиксированные коммиты",
      ],
      ["АТОМАРНЫЕ УТВЕРЖДЕНИЯ", "Небольшие проверяемые утверждения со стабильными ID"],
      ["ОСНОВАНИЯ + КЛАССИФИКАЦИЯ", "У каждого утверждения — цитаты и метка авторитетности"],
      [
        "ИСПОЛНЯЕМЫЕ ПРОВЕРКИ",
        "Граничные примеры с ожидаемым выводом, выполняются при каждой сборке",
      ],
      ["ДВИЖКОВЫЕ ДАННЫЕ", "Версионируемые артефакты V8 с hash бинарника"],
      ["ПРОВЕРКА", "Технические ревью перед повышением статуса публикации"],
      ["ПАРИТЕТ EN/RU", "Семантическая структура проверяется в обеих локалях"],
      ["ОПУБЛИКОВАННАЯ СТАТЬЯ", "Компилируется в статический сайт, который вы читаете"],
    ],
    snapshotAria: "Снимок проверок",
    snapTopics: "двуязычные темы (EN/RU)",
    snapExamples: "исполняемых примеров, проверяемых при каждой сборке",
    snapVerified: "проверенных баз V8",
    snapPending: "баз движков ожидают проверки",
    snapClaims: "смоделированных утверждений",
    snapCitations: "цитат первичных источников",
    snapshotNote:
      "Вычисляется из структурированного контента при сборке. Ожидающие базы показываются как ожидающие, никогда как проверенные.",
    hoodOverline: "Под капотом",
    hoodTitle: "Сайт компилируется из оснований.",
    hoodBody:
      "Публичные страницы генерируются из структурированного контента с основаниями. В продакшене нет базы данных или бэкенда: развёрнутый сайт — статический экспорт.",
    hoodThesis: "Публичный сайт — слой представления, а не источник истины проекта.",
    hoodStaleness:
      "Знание может устаревать, когда меняются его основания. Фрагменты источников, примеры и артефакты движка имеют fingerprints, и архитектура рассчитана на обнаружение дрейфа: при изменении fingerprint зависимые материалы могут помечаться устаревшими и требовать повторной проверки. Fingerprints предотвращают тихий дрейф; полная автоматическая инвалидация каждого утверждения, зависящего от ECMA-262, — цель проектирования, а не готовая функция.",
    aiTitle: "ИИ — не источник.",
    aiBody:
      "ИИ может помогать с поиском, синтезом, черновиками и переводом, но вывод ИИ не считается основанием. Опубликованные утверждения восходят к первичным спецификациям и документации, воспроизводимому наблюдаемому поведению, версионируемым данным реализаций и явной человеческой проверке.",
    search: "Найти тему или операцию",
  },
} as const;

const searchTerms = {
  en: [
    "reference property method this evaluatecall",
    "const let var tdz scope binding hoisting performance loop closure",
    "primitive value reference record environment resolvebinding object identity heap stack context smi symbol bigint number",
  ],
  ru: [
    "reference свойство метод this evaluatecall",
    "const let var tdz область видимости переменная всплытие производительность цикл замыкание",
    "primitive value reference record environment resolvebinding ссылочный тип объект идентичность heap stack context smi symbol bigint number",
  ],
} as const;

const evidenceLabels = ["NORMATIVE", "DERIVED", "OBSERVABLE", "V8_IMPLEMENTATION"] as const;
const hoodChain = {
  en: [
    "structured claims",
    "primary-source citations",
    "fingerprints",
    "executable examples",
    "engine artifacts",
    "validation gates",
    "static publication",
  ],
  ru: [
    "структурированные утверждения",
    "цитаты первичных источников",
    "fingerprints",
    "исполняемые примеры",
    "артефакты движка",
    "проверочные гейты",
    "статическая публикация",
  ],
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: "en" | "ru" }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title:
      lang === "ru"
        ? "Система знаний ECMAScript с проверенными основаниями"
        : "An evidence-backed knowledge system for ECMAScript",
    alternates: { languages: { en: "/en/", ru: "/ru/" } },
  };
}

export default async function HomePage({ params }: { params: Promise<{ lang: "en" | "ru" }> }) {
  const { lang } = await params;
  const t = copy[lang];
  const articles = slugs.map((slug) => loadArticle(lang, slug));
  const stats = computeSiteStats();
  const pathCopies = [
    { title: t.pathTitle, body: t.pathBody },
    { title: t.declarationTitle, body: t.declarationBody },
    { title: t.valuesTitle, body: t.valuesBody },
  ];

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

      <section className="page-shell home-section" id="learning-paths">
        <div className="section-heading">
          <div>
            <p className="overline">{t.pathLabel}</p>
            <h2>{t.pathTitle}</h2>
          </div>
          <div className="coverage-ring">
            <strong>{articles.length}</strong>
            <span>
              / {articles.length}
              <br />
              {t.now}
            </span>
          </div>
        </div>
        <div className="path-list">
          {articles.map((article, index) => (
            <Link className="path-card" href={`/${lang}/guide/${article.slug}/`} key={article.slug}>
              <div className="path-number">{String(index + 1).padStart(2, "0")}</div>
              <div>
                <div className="path-card-status">
                  <span
                    className={
                      article.status === "READY" ? "status-chip status-chip-ready" : "status-chip"
                    }
                  >
                    {formatStatus(article.status, article.sourceSnapshot, lang)}
                  </span>
                </div>
                <h3>{pathCopies[index]!.title}</h3>
                <p>{pathCopies[index]!.body}</p>
              </div>
              <div className="path-meta">
                <span>
                  {article.readingMinutes} {lang === "ru" ? "мин" : "min"}
                </span>
                <span>
                  {article.examples.length} {lang === "ru" ? "примеров" : "examples"}
                </span>
                <span aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-shell home-section why-section">
        <div className="section-heading">
          <div>
            <p className="overline">{t.whyOverline}</p>
            <h2>{t.whyTitle}</h2>
          </div>
        </div>
        <p className="section-lead">{t.whyBody}</p>
        <ol className="truth-list">
          {t.whyLayers.map((layer) => (
            <li key={layer}>{layer}</li>
          ))}
        </ol>
      </section>

      <section className="evidence-band">
        <div className="page-shell evidence-grid">
          <div>
            <p className="overline">{t.evidence}</p>
            <h2>{t.evidenceTitle}</h2>
            <p>{t.evidenceBody}</p>
          </div>
          <div className="evidence-stack">
            {evidenceLabels.map((label, index) => (
              <div className={`evidence-chip evidence-${index}`} key={label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{label}</strong>
                  <small>{t.evidenceDescs[index]}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pipeline-section">
        <div className="page-shell">
          <div className="section-heading">
            <div>
              <p className="overline">{t.pipelineOverline}</p>
              <h2>{t.pipelineTitle}</h2>
            </div>
          </div>
          <p className="pipeline-lead">{t.pipelineLead}</p>
          <ol className="pipeline-list">
            {t.pipelineSteps.map(([name, description]) => (
              <li className="pipeline-step" key={name}>
                <span>{name}</span>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="snapshot-band">
        <div className="page-shell snapshot-inner" aria-label={t.snapshotAria}>
          <ul className="snapshot-list">
            {[
              [stats.bilingualTopics, t.snapTopics],
              [stats.examples, t.snapExamples],
              [stats.verifiedV8Baselines, t.snapVerified],
              [stats.pendingEngineBaselines, t.snapPending],
              [stats.claims, t.snapClaims],
              [stats.citations, t.snapCitations],
            ].map(([value, label]) => (
              <li key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </li>
            ))}
            <li className="snapshot-snapshot">{stats.snapshot}</li>
          </ul>
          <p className="snapshot-note">{t.snapshotNote}</p>
        </div>
      </section>

      <section className="page-shell home-section hood-section">
        <div className="section-heading">
          <div>
            <p className="overline">{t.hoodOverline}</p>
            <h2>{t.hoodTitle}</h2>
          </div>
        </div>
        <p className="section-lead">{t.hoodBody}</p>
        <div className="hood-chain">
          {hoodChain[lang].map((item, index) => (
            <span key={item}>
              {index > 0 && <b aria-hidden="true">→</b>}
              {item}
            </span>
          ))}
        </div>
        <p className="hood-thesis">{t.hoodThesis}</p>
        <div className="hood-links">
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            {lang === "ru" ? "Репозиторий GitHub ↗" : "GitHub repository ↗"}
          </a>
          <a
            href={`${REPO_URL}/blob/main/docs/planning/architecture.md`}
            target="_blank"
            rel="noreferrer"
          >
            {lang === "ru" ? "Архитектура ↗" : "Architecture ↗"}
          </a>
          <a
            href={`${REPO_URL}/blob/main/docs/planning/README.md`}
            target="_blank"
            rel="noreferrer"
          >
            {lang === "ru" ? "Планирование ↗" : "Planning docs ↗"}
          </a>
        </div>
        <p className="hood-staleness">{t.hoodStaleness}</p>
      </section>

      <section className="page-shell home-section ai-section">
        <aside className="article-note note-warning" role="note">
          <span aria-hidden="true">AI</span>
          <div>
            <h3>{t.aiTitle}</h3>
            <p className="rich-text">{t.aiBody}</p>
          </div>
        </aside>
      </section>

      <section className="page-shell search-section">
        <p className="overline">{t.search}</p>
        <SearchBox
          locale={lang}
          articleEntries={articles.map((article, index) => ({
            title: article.title,
            detail:
              lang === "ru"
                ? `Тема · ${article.readingMinutes} мин`
                : `Learning path · ${article.readingMinutes} min`,
            terms: searchTerms[lang][index]!,
            href: `/${lang}/guide/${article.slug}/`,
          }))}
        />
      </section>
    </main>
  );
}
