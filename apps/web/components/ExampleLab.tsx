"use client";

import { Badge } from "@mantine/core";
import type { EngineResult, ExampleManifest } from "@human-ecmascript/model";
import { useEffect, useMemo, useRef, useState } from "react";
import { sandboxDocument } from "../lib/exampleSandbox";
import { CodeEditor } from "./CodeEditor";

type RunMessage = {
  type: "done" | "error" | "timeout";
  runId: string;
  lines: string[];
  error?: string;
};

export function ExampleLab({
  examples,
  sources,
  engineResults,
  locale,
}: Readonly<{
  examples: ExampleManifest[];
  sources: Record<string, string>;
  engineResults: EngineResult[];
  locale: "en" | "ru";
}>) {
  const [selectedId, setSelectedId] = useState(examples[0]!.id);
  const selected = examples.find(({ id }) => id === selectedId) ?? examples[0]!;
  const [source, setSource] = useState(sources[selected.id] ?? "");
  const [output, setOutput] = useState<string[]>([]);
  const [runState, setRunState] = useState<"idle" | "running" | "done" | "error" | "timeout">(
    "idle",
  );
  const iframe = useRef<HTMLIFrameElement>(null);
  const activeRun = useRef<string | null>(null);
  const runTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const labels =
    locale === "ru"
      ? {
          run: "Запустить в браузере",
          reset: "Сбросить",
          expected: "Ожидаемый вывод",
          output: "Что вывел браузер",
          matrix: "Результаты в движках",
          pending: "ещё не проверено",
          verified: "проверено",
          idle: "Запустите код, чтобы увидеть вывод.",
          timeout: "Код выполнялся слишком долго, поэтому мы его остановили.",
          tooLong: "Код длиннее допустимых 10 000 символов.",
        }
      : {
          run: "Run in browser",
          reset: "Reset",
          expected: "Expected",
          output: "Browser output",
          matrix: "Engine evidence",
          pending: "pending verification",
          verified: "verified",
          idle: "Run the code to see its output.",
          timeout: "Execution stopped at the time limit.",
          tooLong: "Source exceeds the 10,000 character limit.",
        };

  useEffect(() => {
    const listener = (event: MessageEvent<RunMessage>) => {
      if (event.source !== iframe.current?.contentWindow || event.data.runId !== activeRun.current)
        return;
      if (runTimeout.current) clearTimeout(runTimeout.current);
      runTimeout.current = null;
      activeRun.current = null;
      setOutput(event.data.error ? [...event.data.lines, event.data.error] : event.data.lines);
      setRunState(event.data.type);
    };
    window.addEventListener("message", listener);
    return () => {
      window.removeEventListener("message", listener);
      if (runTimeout.current) clearTimeout(runTimeout.current);
    };
  }, []);

  const results = useMemo(
    () => engineResults.filter(({ exampleId }) => exampleId === selected.id),
    [engineResults, selected.id],
  );
  const choose = (id: string) => {
    if (runTimeout.current) clearTimeout(runTimeout.current);
    runTimeout.current = null;
    activeRun.current = null;
    setSelectedId(id);
    setSource(sources[id] ?? "");
    setOutput([]);
    setRunState("idle");
  };
  const run = () => {
    if (source.length > 10_000) {
      setOutput([labels.tooLong]);
      setRunState("error");
      return;
    }
    const runId = crypto.randomUUID();
    activeRun.current = runId;
    setRunState("running");
    setOutput([]);
    if (runTimeout.current) clearTimeout(runTimeout.current);
    runTimeout.current = setTimeout(
      () => {
        if (activeRun.current !== runId) return;
        activeRun.current = null;
        runTimeout.current = null;
        setRunState("timeout");
      },
      Math.min(selected.timeoutMs, 5_000) + 250,
    );
    iframe.current?.contentWindow?.postMessage(
      { type: "run", source, runId, timeoutMs: selected.timeoutMs },
      "*",
    );
  };

  return (
    <div className="example-lab">
      <iframe
        ref={iframe}
        srcDoc={sandboxDocument}
        sandbox="allow-scripts"
        title="Opaque-origin JavaScript sandbox"
        className="sandbox-frame"
      />
      <div
        className="example-picker"
        role="tablist"
        aria-label={locale === "ru" ? "Примеры" : "Examples"}
      >
        {examples.map((example, index) => (
          <button
            role="tab"
            aria-selected={example.id === selected.id}
            key={example.id}
            onClick={() => choose(example.id)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{example.title}</strong>
          </button>
        ))}
      </div>
      <div className="lab-workspace">
        <div className="editor-panel">
          <div className="panel-bar">
            <span>{selected.sourcePath}</span>
            <div>
              <button onClick={() => setSource(sources[selected.id] ?? "")}>{labels.reset}</button>
              <button className="run-button" onClick={run} disabled={runState === "running"}>
                {runState === "running" ? "…" : "▶"} {labels.run}
              </button>
            </div>
          </div>
          <CodeEditor value={source} onChange={setSource} />
        </div>
        <div className="output-panel">
          <div className="panel-bar">
            <span>{labels.output}</span>
            <Badge
              size="xs"
              variant="dot"
              color={
                runState === "error" || runState === "timeout"
                  ? "red"
                  : runState === "done"
                    ? "teal"
                    : "gray"
              }
            >
              {runState}
            </Badge>
          </div>
          <div className="output-lines">
            {runState === "idle" ? (
              <p>{labels.idle}</p>
            ) : runState === "timeout" ? (
              <p>{labels.timeout}</p>
            ) : (
              output.map((line, index) => (
                <code key={`${line}-${index}`}>
                  <span>{index + 1}</span>
                  {line}
                </code>
              ))
            )}
          </div>
          <div className="expected-output">
            <span>{labels.expected}</span>
            <code>{selected.expectedOutput.join("\n")}</code>
          </div>
        </div>
      </div>
      <div className="engine-matrix">
        <div>
          <p className="overline">{labels.matrix}</p>
          <h3>{labels.matrix}</h3>
          <p>{selected.goal}</p>
        </div>
        {["V8", "SpiderMonkey", "JavaScriptCore"].map((engine) => {
          const result = results.find((item) => item.engine === engine);
          return (
            <article
              key={engine}
              className={result?.status === "verified" ? "engine-verified" : "engine-pending"}
            >
              <div>
                <strong>{engine}</strong>
                <Badge
                  size="xs"
                  color={result?.status === "verified" ? "teal" : "gray"}
                  variant="light"
                >
                  {result?.status === "verified" ? labels.verified : labels.pending}
                </Badge>
              </div>
              <code>{result?.output.length ? result.output.join("\n") : "—"}</code>
              <small>{result?.version ?? "not captured"}</small>
            </article>
          );
        })}
      </div>
    </div>
  );
}
