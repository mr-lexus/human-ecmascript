# Security policy

Please report vulnerabilities privately to the repository owner instead of opening a public
issue. The browser playground is not a security boundary for secrets: it uses an opaque-origin
sandboxed iframe, a disposable Worker, a restrictive CSP, output limits, and a wall timeout.
Never place credentials in examples.

Offline engine execution must happen in a disposable, non-root container with no network,
a read-only root filesystem, dropped capabilities, and CPU, memory, PID, file-size, and wall-time
limits. Until that runner is available, only manually reviewed examples may be published.
