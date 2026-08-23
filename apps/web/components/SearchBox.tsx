"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type SearchEntry = {
  title: string;
  detail: string;
  terms: string;
  href: string;
};

const staticEntries = {
  en: [
    {
      title: "GetValue",
      detail: "Abstract operation",
      terms: "getvalue reference value property",
      href: "/en/spec/",
    },
    {
      title: "Reference Record",
      detail: "Specification type",
      terms: "reference record base referenced name",
      href: "/en/spec/",
    },
    {
      title: "Glossary",
      detail: "Five core terms",
      terms: "receiver internal method operation",
      href: "/en/glossary/",
    },
  ],
  ru: [
    {
      title: "GetValue",
      detail: "Абстрактная операция",
      terms: "getvalue reference значение свойство",
      href: "/ru/spec/",
    },
    {
      title: "Reference Record",
      detail: "Тип спецификации",
      terms: "reference record base referenced name",
      href: "/ru/spec/",
    },
    {
      title: "Глоссарий",
      detail: "Пять ключевых терминов",
      terms: "получатель внутренний метод операция",
      href: "/ru/glossary/",
    },
  ],
} as const;

export function SearchBox({
  locale,
  articleEntries = [],
}: Readonly<{
  locale: "en" | "ru";
  articleEntries?: ReadonlyArray<SearchEntry>;
}>) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const entries = [...articleEntries, ...staticEntries[locale]];
    const normalized = query.trim().toLocaleLowerCase(locale);
    if (!normalized) return entries.slice(0, 2);
    return entries.filter((entry) =>
      `${entry.title} ${entry.terms}`.toLocaleLowerCase(locale).includes(normalized),
    );
  }, [articleEntries, locale, query]);
  return (
    <div className="search-box">
      <label>
        <span aria-hidden="true">⌕</span>
        <span className="sr-only">{locale === "ru" ? "Поиск" : "Search"}</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={
            locale === "ru" ? "Введите тему, операцию или термин…" : "Operation, topic, or term…"
          }
        />
      </label>
      <div className="search-results">
        {results.length > 0 ? (
          results.map((entry) => (
            <Link href={entry.href} key={`${entry.href}-${entry.title}`}>
              <span>
                <strong>{entry.title}</strong>
                <small>{entry.detail}</small>
              </span>
              <b aria-hidden="true">→</b>
            </Link>
          ))
        ) : (
          <p>
            {locale === "ru"
              ? "В первой версии такого материала пока нет."
              : "No match in the current MVP."}
          </p>
        )}
      </div>
    </div>
  );
}
