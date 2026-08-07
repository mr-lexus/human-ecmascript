import Link from "next/link";
import { LanguageSwitch } from "./LanguageSwitch";

export function AppHeader({ locale }: Readonly<{ locale: "en" | "ru" }>) {
  const labels =
    locale === "ru"
      ? { paths: "Темы", spec: "Операции", glossary: "Словарь", edition: "ES2026" }
      : { paths: "Learning paths", spec: "Operations", glossary: "Glossary", edition: "ES2026" };
  return (
    <header className="app-header">
      <div className="page-shell header-inner">
        <Link href={`/${locale}/`} className="brand" aria-label="Human ECMAScript home">
          <span className="brand-symbol" aria-hidden="true">
            H
          </span>
          <span>
            <strong>Human</strong>
            <small>ECMAScript</small>
          </span>
        </Link>
        <nav aria-label="Primary navigation">
          <Link href={`/${locale}/guide/reference-call-this/`}>{labels.paths}</Link>
          <Link href={`/${locale}/spec/`}>{labels.spec}</Link>
          <Link href={`/${locale}/glossary/`}>{labels.glossary}</Link>
        </nav>
        <div className="header-tools">
          <span className="edition-pill">{labels.edition}</span>
          <LanguageSwitch locale={locale} />
        </div>
      </div>
    </header>
  );
}
