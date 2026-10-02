import { describe, expect, it } from "vitest";
import { stringify } from "yaml";
import { validateSourceLock } from "./sourceLock";

const source = (id: string) => ({
  id,
  resolvedCommit: "a".repeat(40),
  archiveSha256: "b".repeat(64),
});

describe("source lock validation", () => {
  it("validates every source without assuming a fixed inventory size", () => {
    for (const count of [1, 3, 4, 5]) {
      expect(() =>
        validateSourceLock(
          stringify({ sources: Array.from({ length: count }, (_, i) => source(`source-${i}`)) }),
        ),
      ).not.toThrow();
    }
  });
  it("rejects an incomplete source even when the other records are complete", () => {
    expect(() =>
      validateSourceLock(
        stringify({
          sources: [source("ecma"), { id: "html", resolvedCommit: "pending-upstream" }],
        }),
      ),
    ).toThrow("html must have");
  });
  it("rejects empty inventories and duplicate source IDs", () => {
    expect(() => validateSourceLock("sources: []")).toThrow("non-empty");
    expect(() =>
      validateSourceLock(stringify({ sources: [source("ecma"), source("ecma")] })),
    ).toThrow("unique");
  });
});
