import { parse } from "yaml";

export function validateSourceLock(source: string): void {
  const lock = parse(source) as { sources?: unknown } | null;
  if (!lock || !Array.isArray(lock.sources) || lock.sources.length === 0) {
    throw new Error("Source lock must contain a non-empty sources array");
  }
  const ids = new Set<string>();
  for (const entry of lock.sources) {
    if (!entry || typeof entry !== "object") throw new Error("Invalid source lock entry");
    const { id, resolvedCommit, archiveSha256 } = entry as Record<string, unknown>;
    if (typeof id !== "string" || !id || ids.has(id)) {
      throw new Error("Every registered source must have a unique non-empty id");
    }
    ids.add(id);
    if (
      typeof resolvedCommit !== "string" ||
      !/^[a-f0-9]{40}$/.test(resolvedCommit) ||
      typeof archiveSha256 !== "string" ||
      !/^[a-f0-9]{64}$/.test(archiveSha256)
    ) {
      throw new Error(
        `${id} must have a resolved 40-character commit and 64-character archive SHA-256`,
      );
    }
  }
}
