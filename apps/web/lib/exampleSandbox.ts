export const SANDBOX_MAX_LINES = 100;
export const SANDBOX_MAX_LINE_LENGTH = 1_000;
export const SANDBOX_MAX_OUTPUT_LENGTH = 100_000;
export const SANDBOX_MAX_ERROR_LENGTH = 2_000;

export type SandboxRunMessage = {
  type: "done" | "error" | "timeout";
  runId: string;
  lines: string[];
  error?: string;
};

export function parseSandboxRunMessage(value: unknown): SandboxRunMessage | null {
  if (typeof value !== "object" || value === null) return null;

  const candidate = value as Record<string, unknown>;
  if (
    (candidate.type !== "done" && candidate.type !== "error" && candidate.type !== "timeout") ||
    typeof candidate.runId !== "string" ||
    !Array.isArray(candidate.lines) ||
    candidate.lines.length > SANDBOX_MAX_LINES
  ) {
    return null;
  }

  let outputLength = 0;
  const lines: string[] = [];
  for (const line of candidate.lines) {
    if (typeof line !== "string" || line.length > SANDBOX_MAX_LINE_LENGTH) return null;
    outputLength += line.length;
    if (outputLength > SANDBOX_MAX_OUTPUT_LENGTH) return null;
    lines.push(line);
  }

  if (
    candidate.error !== undefined &&
    (typeof candidate.error !== "string" || candidate.error.length > SANDBOX_MAX_ERROR_LENGTH)
  ) {
    return null;
  }

  return {
    type: candidate.type,
    runId: candidate.runId,
    lines,
    ...(typeof candidate.error === "string" ? { error: candidate.error } : {}),
  };
}

export const sandboxDocument = `<!doctype html>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' blob:; worker-src blob:; connect-src 'none'; frame-src 'none'; img-src 'none'; media-src 'none'; object-src 'none'; style-src 'none'; form-action 'none'; base-uri 'none'">
<script>
let worker = null;
let workerUrl = null;
let timer = null;
const MAX_SOURCE_LENGTH = 10000;
const MAX_LINES = ${SANDBOX_MAX_LINES};
const MAX_LINE_LENGTH = ${SANDBOX_MAX_LINE_LENGTH};
const MAX_OUTPUT_LENGTH = ${SANDBOX_MAX_OUTPUT_LENGTH};
const MAX_ERROR_LENGTH = ${SANDBOX_MAX_ERROR_LENGTH};
const disposeWorker = () => {
  if (timer) clearTimeout(timer);
  if (worker) worker.terminate();
  if (workerUrl) URL.revokeObjectURL(workerUrl);
  worker = null;
  workerUrl = null;
  timer = null;
};
const isRecord = (value) => typeof value === 'object' && value !== null;
const parseWorkerMessage = (value) => {
  if (!isRecord(value) || (value.type !== 'done' && value.type !== 'error')) return null;
  if (!Array.isArray(value.lines) || value.lines.length > MAX_LINES) return null;
  let outputLength = 0;
  const lines = [];
  for (const line of value.lines) {
    if (typeof line !== 'string' || line.length > MAX_LINE_LENGTH) return null;
    outputLength += line.length;
    if (outputLength > MAX_OUTPUT_LENGTH) return null;
    lines.push(line);
  }
  if (value.error !== undefined &&
      (typeof value.error !== 'string' || value.error.length > MAX_ERROR_LENGTH)) return null;
  return {
    type: value.type,
    lines,
    ...(typeof value.error === 'string' ? { error: value.error } : {})
  };
};
const report = (message) => parent.postMessage(message, '*');
window.addEventListener('message', (event) => {
  if (event.source !== parent || !isRecord(event.data) || event.data.type !== 'run') return;
  disposeWorker();
  const { source, runId, timeoutMs } = event.data;
  if (typeof source !== 'string' || source.length > MAX_SOURCE_LENGTH ||
      typeof runId !== 'string' || typeof timeoutMs !== 'number' || !Number.isFinite(timeoutMs)) {
    report({ type: 'error', runId: typeof runId === 'string' ? runId : '', lines: [], error: 'Invalid run request' });
    return;
  }
  const workerPrelude = \`
    const lines = [];
    const format = (value) => {
      if (typeof value === 'string') return value;
      if (typeof value === 'undefined') return 'undefined';
      try { return JSON.stringify(value); } catch { return String(value); }
    };
    console.log = (...values) => {
      if (lines.length < 100) lines.push(values.map(format).join(' ').slice(0, 1000));
    };
    (async () => {
      try {
  \`;
  const workerPostlude = \`
        self.postMessage({ type: 'done', lines });
      } catch (error) {
        self.postMessage({ type: 'error', lines, error: String(error && error.name ? error.name + ': ' + error.message : error) });
      }
    })();
  \`;
  try {
    const workerSource = workerPrelude + '\\n' + source + '\\n' + workerPostlude;
    workerUrl = URL.createObjectURL(new Blob([workerSource], { type: 'text/javascript' }));
    worker = new Worker(workerUrl);
    timer = setTimeout(() => {
      disposeWorker();
      report({ type: 'timeout', runId, lines: [] });
    }, Math.min(timeoutMs, 5000));
    worker.onmessage = ({ data }) => {
      const message = parseWorkerMessage(data);
      disposeWorker();
      if (!message) {
        report({ type: 'error', runId, lines: [], error: 'Invalid sandbox response' });
        return;
      }
      report({
        type: message.type,
        runId,
        lines: message.lines,
        ...(message.error ? { error: message.error } : {})
      });
    };
    worker.onerror = (error) => {
      disposeWorker();
      report({ type: 'error', runId, lines: [], error: String(error.message || 'Worker syntax error').slice(0, MAX_ERROR_LENGTH) });
    };
  } catch (error) {
    disposeWorker();
    report({
      type: 'error',
      runId,
      lines: [],
      error: String(error && error.name ? error.name + ': ' + error.message : error).slice(0, MAX_ERROR_LENGTH)
    });
  }
});
</script>`;
