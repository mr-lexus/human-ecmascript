import type { Metadata } from "next";
import { loadArticle } from "@human-ecmascript/content-compiler";
import { GuideArticlePage } from "../../../../components/GuideArticlePage";
import { topicSequence } from "../../../../lib/featuredTopics";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: "en" | "ru" }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const article = loadArticle(lang, "typeof-not-type-query");
  return {
    title: article.title,
    description: article.dek,
    alternates: {
      languages: {
        en: "/en/guide/typeof-not-type-query/",
        ru: "/ru/guide/typeof-not-type-query/",
      },
    },
  };
}

export default async function TypeofPage({ params }: { params: Promise<{ lang: "en" | "ru" }> }) {
  const { lang } = await params;
  const article = loadArticle(lang, "typeof-not-type-query");
  return (
    <GuideArticlePage article={article} locale={lang} sequence={topicSequence(article.slug)} />
  );
}
