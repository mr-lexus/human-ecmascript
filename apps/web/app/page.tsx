import Link from "next/link";

export default function LocaleChooser() {
  return (
    <main className="locale-chooser">
      <div className="locale-card">
        <span className="brand-mark" aria-hidden="true">
          ECMA
        </span>
        <h1>Human ECMAScript</h1>
        <p>Choose a language · Выберите язык</p>
        <div className="locale-actions">
          <Link className="primary-button" href="/en/">
            English
          </Link>
          <Link className="secondary-button" href="/ru/">
            Русский
          </Link>
        </div>
      </div>
    </main>
  );
}
