"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function LanguageSwitch({ locale }: Readonly<{ locale: "en" | "ru" }>) {
  const pathname = usePathname();
  const other = locale === "en" ? "ru" : "en";
  const target = pathname.replace(/^\/(en|ru)(?=\/|$)/, `/${other}`);
  return (
    <Link
      className="language-switch"
      href={target || `/${other}/`}
      aria-label={locale === "en" ? "Переключить на русский" : "Switch to English"}
    >
      {other.toUpperCase()}
    </Link>
  );
}
