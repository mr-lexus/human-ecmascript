import type { ReviewStatus } from "@human-ecmascript/model";

export const statusLabels: Record<"en" | "ru", Record<ReviewStatus, string>> = {
  en: {
    READY: "READY",
    TECH_REVIEW: "TECHNICAL REVIEW",
    VERIFIED_EN: "VERIFIED EN",
    TRANSLATED_RU: "TRANSLATED RU",
    LOCALE_REVIEW: "LOCALE REVIEW",
    DRAFT: "DRAFT",
    STALE: "STALE",
    BLOCKED: "BLOCKED",
  },
  ru: {
    READY: "ГОТОВО",
    TECH_REVIEW: "ТЕХНИЧЕСКАЯ ПРОВЕРКА",
    VERIFIED_EN: "ПРОВЕРЕНО (EN)",
    TRANSLATED_RU: "ПЕРЕВЕДЕНО (RU)",
    LOCALE_REVIEW: "ЛОКАЛЬНАЯ ПРОВЕРКА",
    DRAFT: "ЧЕРНОВИК",
    STALE: "УСТАРЕЛО",
    BLOCKED: "ЗАБЛОКИРОВАНО",
  },
};

export function editionOf(sourceSnapshot: string): string {
  return sourceSnapshot.replace(/^ECMA-262-/, "");
}

export function formatStatus(
  status: ReviewStatus,
  sourceSnapshot: string,
  locale: "en" | "ru",
): string {
  return `${statusLabels[locale][status]} · ${editionOf(sourceSnapshot)}`;
}
