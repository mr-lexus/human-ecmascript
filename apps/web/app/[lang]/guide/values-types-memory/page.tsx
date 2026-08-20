import type { Metadata } from "next";
import { loadArticle } from "@human-ecmascript/content-compiler";
import { GuideArticlePage } from "../../../../components/GuideArticlePage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: "en" | "ru" }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const article = loadArticle(lang, "values-types-memory");
  return {
    title: article.title,
    description: article.dek,
    alternates: {
      languages: {
        en: "/en/guide/values-types-memory/",
        ru: "/ru/guide/values-types-memory/",
      },
    },
  };
}

export default async function ValuesTypesMemoryPage({
  params,
}: {
  params: Promise<{ lang: "en" | "ru" }>;
}) {
  const { lang } = await params;
  const article = loadArticle(lang, "values-types-memory");
  return <GuideArticlePage article={article} locale={lang} sequence={3} />;
}
