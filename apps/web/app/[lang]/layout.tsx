import { notFound } from "next/navigation";
import { AppFooter } from "../../components/AppFooter";
import { AppHeader } from "../../components/AppHeader";
import { LanguageDocumentSync } from "../../components/LanguageDocumentSync";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ru" }];
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ lang: string }> }>) {
  const { lang } = await params;
  if (lang !== "en" && lang !== "ru") notFound();

  return (
    <div lang={lang}>
      <LanguageDocumentSync locale={lang} />
      <AppHeader locale={lang} />
      {children}
      <AppFooter locale={lang} />
    </div>
  );
}
