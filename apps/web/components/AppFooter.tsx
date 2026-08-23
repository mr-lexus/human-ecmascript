import Link from "next/link";
import { REPO_URL } from "../lib/challengeIssueUrl";

export function AppFooter({ locale }: Readonly<{ locale: "en" | "ru" }>) {
  const labels =
    locale === "ru"
      ? {
          spec: "ECMA-262",
          source: "Источники",
          github: "GitHub",
          report: "Сообщить об ошибке",
          contribute: "Участвовать",
          methodology: "Методология",
        }
      : {
          spec: "ECMA-262",
          source: "Source",
          github: "GitHub",
          report: "Report an issue",
          contribute: "Contribute",
          methodology: "Methodology",
        };

  return (
    <footer className="app-footer">
      <div className="page-shell footer-grid">
        <div className="brand footer-brand">
          <span className="brand-symbol" aria-hidden="true">
            H
          </span>
          <span>
            <strong>Human</strong>
            <small>ECMAScript</small>
          </span>
        </div>
        <p>
          {locale === "ru"
            ? "Независимый учебный проект. Ссылки на стандарт ведут к стабильной редакции ECMA-262 ES2026."
            : "An independent educational project. Normative links target the stable ECMA-262 ES2026 snapshot."}
        </p>
        <div>
          <Link href={`/${locale}/spec/`}>{labels.spec}</Link>
          <a href="https://github.com/tc39/ecma262" target="_blank" rel="noreferrer">
            {labels.source} ↗
          </a>
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            {labels.github} ↗
          </a>
          <a href={`${REPO_URL}/issues/new`} target="_blank" rel="noreferrer">
            {labels.report} ↗
          </a>
          <a href={`${REPO_URL}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noreferrer">
            {labels.contribute} ↗
          </a>
          <a
            href={`${REPO_URL}/blob/main/docs/planning/README.md`}
            target="_blank"
            rel="noreferrer"
          >
            {labels.methodology} ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
