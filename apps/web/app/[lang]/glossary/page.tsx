import Link from "next/link";

const terms = [
  [
    "Reference Record",
    "A specification-only record that can retain the base of a property access.",
    "Служебная запись из спецификации. При доступе к свойству она запоминает и объект, и имя свойства.",
  ],
  [
    "base value",
    "The value or environment record from which a Reference resolves its name.",
    "Место, где нужно искать имя: например, объект со свойством или Environment Record с переменной.",
  ],
  [
    "receiver",
    "The value passed to [[Get]] and eventually used to derive this.",
    "Объект, от имени которого читают свойство. Он особенно важен для getter и Proxy, а при вызове метода помогает определить `this`.",
  ],
  [
    "abstract operation",
    "A named specification algorithm, not a JavaScript function you can call directly.",
    "Именованный алгоритм внутри стандарта. Например, GetValue. В JavaScript-коде напрямую вызвать его нельзя.",
  ],
  [
    "internal method",
    "A specification-level object behavior written with double brackets.",
    "Операция, которую стандарт приписывает объектам. Её записывают в двойных скобках, например [[Get]], но как обычного метода в JavaScript её нет.",
  ],
] as const;

export default async function GlossaryPage({ params }: { params: Promise<{ lang: "en" | "ru" }> }) {
  const { lang } = await params;
  return (
    <main className="page-shell glossary-page">
      <div className="breadcrumbs">
        <Link href={`/${lang}/`}>Human ECMAScript</Link>
        <span>/</span>
        <span>{lang === "ru" ? "Словарь" : "Glossary"}</span>
      </div>
      <p className="kicker">
        <span />
        {lang === "ru" ? "Термины без канцелярита" : "A shared technical language"}
      </p>
      <h1>{lang === "ru" ? "Словарь" : "Glossary"}</h1>
      <div className="glossary-list">
        {terms.map(([term, en, ru], index) => (
          <article key={term}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{term}</h2>
            <p>{lang === "ru" ? ru : en}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
