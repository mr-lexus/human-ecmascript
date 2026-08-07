import Link from "next/link";

export function AppFooter({ locale }: Readonly<{ locale: "en" | "ru" }>) {
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
          <Link href={`/${locale}/spec/`}>ECMA-262</Link>
          <a href="https://github.com/tc39/ecma262" target="_blank" rel="noreferrer">
            Source ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
