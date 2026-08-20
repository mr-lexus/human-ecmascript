import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Script } from "node:vm";
import { describe, expect, it } from "vitest";
import {
  parseSandboxRunMessage,
  sandboxDocument,
  SANDBOX_MAX_ERROR_LENGTH,
  SANDBOX_MAX_LINE_LENGTH,
  SANDBOX_MAX_LINES,
} from "../../../apps/web/lib/exampleSandbox";

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
    expect(componentSource).toContain("Math.min(selected.timeoutMs, 5_000) + 1_000");
    expect(componentSource).toContain('setRunState("timeout")');
    expect(componentSource).toContain("setSandboxMounted(false)");
  });

  it("keeps the iframe on an opaque origin", () => {
    expect(componentSource).toContain('sandbox="allow-scripts"');
    expect(componentSource).not.toContain("allow-same-origin");
    expect(sandboxDocument).toContain("connect-src 'none'");
    expect(sandboxDocument).toContain("frame-src 'none'");
    expect(componentSource).toContain('referrerPolicy="no-referrer"');
  });

  it("accepts only bounded, typed sandbox responses", () => {
    expect(
      parseSandboxRunMessage({ type: "done", runId: "run-1", lines: ["safe output"] }),
    ).toEqual({ type: "done", runId: "run-1", lines: ["safe output"] });
    expect(
      parseSandboxRunMessage({ type: "error", runId: "run-1", lines: [], error: "boom" }),
    ).toEqual({ type: "error", runId: "run-1", lines: [], error: "boom" });
    expect(
      parseSandboxRunMessage({ type: "done", runId: "run-1", lines: "not-an-array" }),
    ).toBeNull();
    expect(
      parseSandboxRunMessage({
        type: "done",
        runId: "run-1",
        lines: Array.from({ length: SANDBOX_MAX_LINES + 1 }, () => "line"),
      }),
    ).toBeNull();
    expect(
      parseSandboxRunMessage({
        type: "done",
        runId: "run-1",
        lines: ["x".repeat(SANDBOX_MAX_LINE_LENGTH + 1)],
      }),
    ).toBeNull();
    expect(
      parseSandboxRunMessage({
        type: "error",
        runId: "run-1",
        lines: [],
        error: "x".repeat(SANDBOX_MAX_ERROR_LENGTH + 1),
      }),
    ).toBeNull();
  });

  it("does not relay arbitrary worker-controlled fields", () => {
    expect(sandboxDocument).toContain("const message = parseWorkerMessage(data)");
    expect(sandboxDocument).not.toContain("{ ...data, runId }");
    expect(sandboxDocument).toContain("error: 'Invalid sandbox response'");
  });

  it("creates a fresh iframe for each run and removes it after completion", () => {
    expect(componentSource).toContain("key={sandboxGeneration}");
    expect(componentSource).toContain("onLoad={startPendingRun}");
    expect(componentSource).toContain("setSandboxMounted(true)");
    expect(componentSource).toContain("setSandboxMounted(false)");
  });
});
