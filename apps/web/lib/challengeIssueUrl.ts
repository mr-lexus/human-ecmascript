export const REPO_URL = "https://github.com/mr-lexus/human-ecmascript";

export function challengeIssueUrl(
  args: Readonly<{
    slug: string;
    locale: "en" | "ru";
    claimId: string;
    classification: string;
    reviewStatus: string;
    sourceSnapshot: string;
    claimText: string;
    citations: ReadonlyArray<{ id: string; label: string; url: string }>;
  }>,
): string {
  const body = `**Article:** ${args.slug} (locale: ${args.locale})
**Claim ID:** ${args.claimId}
**Classification:** ${args.classification}
**Claim review status:** ${args.reviewStatus}
**Source snapshot:** ${args.sourceSnapshot}
**Citations:**
${args.citations.map((citation) => `- ${citation.id}: ${citation.label} — ${citation.url}`).join("\n")}

**Claim text:**
> ${args.claimText}

**Why is this claim wrong or incomplete?**
<!-- Describe the problem and link primary evidence if possible: spec clause, reproducible example, or engine artifact. -->`;

  return `${REPO_URL}/issues/new?title=${encodeURIComponent(`Challenge claim ${args.claimId} in ${args.slug}`)}&labels=${encodeURIComponent("claim-challenge")}&body=${encodeURIComponent(body)}`;
}
