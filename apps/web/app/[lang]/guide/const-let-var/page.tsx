import type { Metadata } from "next";
import { loadArticle } from "@human-ecmascript/content-compiler";
import { GuideArticlePage } from "../../../../components/GuideArticlePage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: "en" | "ru" }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const article = loadArticle(lang, "const-let-var");
  return {
    title: article.title,
    description: article.dek,
    alternates: {
      languages: { en: "/en/guide/const-let-var/", ru: "/ru/guide/const-let-var/" },
    },
  };
}

export default async function ConstLetVarPage({
  params,
}: {
  params: Promise<{ lang: "en" | "ru" }>;
}) {
  const { lang } = await params;
  const article = loadArticle(lang, "const-let-var");
  return <GuideArticlePage article={article} locale={lang} sequence={2} />;
}
