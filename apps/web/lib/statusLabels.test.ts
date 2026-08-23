import { describe, expect, it } from "vitest";
import { editionOf, formatStatus, statusLabels } from "./statusLabels";

describe("status labels", () => {
  it("covers every review status in both locales", () => {
    expect(statusLabels).toEqual({
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
    });
  });

  it("formats the source edition with a localized status", () => {
    expect(editionOf("ECMA-262-ES2026")).toBe("ES2026");
    expect(formatStatus("READY", "ECMA-262-ES2026", "en")).toBe("READY · ES2026");
    expect(formatStatus("READY", "ECMA-262-ES2026", "ru")).toBe("ГОТОВО · ES2026");
  });
});
