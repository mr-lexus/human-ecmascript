export const sandboxDocument = `<!doctype html>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' blob:; worker-src blob:; connect-src 'none'; img-src 'none'; media-src 'none'; object-src 'none'; style-src 'unsafe-inline'; form-action 'none'; base-uri 'none'">
<script>
let worker = null;
let workerUrl = null;
let timer = null;
const disposeWorker = () => {
  if (timer) clearTimeout(timer);
  if (worker) worker.terminate();
  if (workerUrl) URL.revokeObjectURL(workerUrl);
  worker = null;
  workerUrl = null;
  timer = null;
};
window.addEventListener('message', (event) => {
  if (event.source !== parent || event.data?.type !== 'run') return;
  disposeWorker();
  const { source, runId, timeoutMs } = event.data;
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
      parent.postMessage({ type: 'timeout', runId, lines: [] }, '*');
    }, Math.min(timeoutMs, 5000));
    worker.onmessage = ({ data }) => {
      disposeWorker();
      parent.postMessage({ ...data, runId }, '*');
    };
    worker.onerror = (error) => {
      disposeWorker();
      parent.postMessage({ type: 'error', runId, lines: [], error: error.message || 'Worker syntax error' }, '*');
    };
  } catch (error) {
    disposeWorker();
    parent.postMessage({
      type: 'error',
      runId,
      lines: [],
      error: String(error && error.name ? error.name + ': ' + error.message : error)
    }, '*');
  }
});
</script>`;
