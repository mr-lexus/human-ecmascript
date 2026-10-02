import type { Metadata } from "next";
import { topicSequence } from "../../../../lib/featuredTopics";
import { loadArticle } from "@human-ecmascript/content-compiler";
import { GuideArticlePage } from "../../../../components/GuideArticlePage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: "en" | "ru" }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const article = loadArticle(lang, "reference-call-this");
  return {
    title: article.title,
    description: article.dek,
    alternates: {
      languages: { en: "/en/guide/reference-call-this/", ru: "/ru/guide/reference-call-this/" },
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ lang: "en" | "ru" }> }) {
  const { lang } = await params;
  const article = loadArticle(lang, "reference-call-this");
  return (
    <GuideArticlePage
      article={article}
      locale={lang}
      sequence={topicSequence("reference-call-this")}
    />
  );
}
