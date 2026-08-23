import { describe, expect, it } from "vitest";
import { challengeIssueUrl, REPO_URL } from "./challengeIssueUrl";

describe("challenge issue URL", () => {
  it("prefills a GitHub issue with claim evidence context", () => {
    const url = challengeIssueUrl({
      slug: "reference-call-this",
      locale: "en",
      claimId: "claim-1",
      classification: "NORMATIVE",
      reviewStatus: "READY",
      sourceSnapshot: "ECMA-262-ES2026",
      claimText: "The claim text.",
      citations: [{ id: "c1", label: "A clause", url: "https://example.com/clause" }],
    });

    expect(url).toContain(`${REPO_URL}/issues/new?`);
    expect(url).toContain("title=Challenge%20claim%20claim-1%20in%20reference-call-this");
    expect(url).toContain("labels=claim-challenge");
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain("claim-1");
    expect(decoded).toContain("NORMATIVE");
    expect(decoded).toContain("ECMA-262-ES2026");
    expect(decoded).toContain("https://example.com/clause");
    expect(decoded).toContain("The claim text.");
  });
});
