import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Script } from "node:vm";
import { describe, expect, it } from "vitest";
import { sandboxDocument } from "../../../apps/web/lib/exampleSandbox";

const componentSource = readFileSync(
  join(process.cwd(), "apps", "web", "components", "ExampleLab.tsx"),
  "utf8",
);
const sandboxSource = readFileSync(
  join(process.cwd(), "apps", "web", "lib", "exampleSandbox.ts"),
  "utf8",
);

describe("browser example sandbox", () => {
  it("executes a generated Blob worker without eval", () => {
    expect(sandboxDocument).toContain("workerPrelude + '\\n' + source + '\\n' + workerPostlude");
    expect(sandboxSource).not.toMatch(/\beval\s*\(/);
    expect(sandboxDocument).not.toContain("unsafe-eval");
  });

  it("produces syntactically valid iframe JavaScript", () => {
    const inlineScript = sandboxDocument.match(/<script>([\s\S]*)<\/script>/)?.[1];

    expect(inlineScript).toBeDefined();
    if (!inlineScript) throw new Error("Sandbox inline script is missing");
    expect(() => new Script(inlineScript)).not.toThrow();
  });

  it("has a parent-side watchdog when the iframe cannot reply", () => {
    expect(componentSource).toContain("Math.min(selected.timeoutMs, 5_000) + 250");
    expect(componentSource).toContain('setRunState("timeout")');
  });

  it("keeps the iframe on an opaque origin", () => {
    expect(componentSource).toContain('sandbox="allow-scripts"');
    expect(componentSource).not.toContain("allow-same-origin");
    expect(sandboxDocument).toContain("connect-src 'none'");
  });
});
