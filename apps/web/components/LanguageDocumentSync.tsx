"use client";

import { useEffect } from "react";

export function LanguageDocumentSync({ locale }: Readonly<{ locale: "en" | "ru" }>) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
