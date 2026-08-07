# Risk register

| Risk                    | Detection                       | Mitigation                               | Fallback                          |
| ----------------------- | ------------------------------- | ---------------------------------------- | --------------------------------- |
| AI hallucination        | Claim/citation review           | AI emits drafts only                     | Block uncertain claims            |
| Missing context         | Dependency reports              | Weighted traversal and seed overrides    | Expand a reviewed context budget  |
| Graph explosion         | SCC and budget metrics          | Condense cycles and top-K reverse edges  | Publish a curated subgraph        |
| Spec change             | Snapshot diff and hashes        | Stable base and stale queue              | Keep previous reviewed release    |
| EN/RU drift             | Semantic parity                 | Shared IDs and EN-first review           | Unpublish stale locale            |
| V8 instability          | Capability and golden diff      | Pin binary/source/flags                  | Hide unsupported artifact         |
| Test262 gaps            | Coverage report                 | Curated tests plus normative evidence    | State the gap explicitly          |
| WSL mount behavior      | Doctor and executable smoke     | Build on ext4                            | Synchronize source only to `/mnt` |
| Sandbox escape or DoS   | Negative security tests         | Opaque iframe and constrained containers | Disable live execution            |
| Upstream API churn      | Adapter fixtures                | CLI baseline and adapter boundaries      | Pin previous working release      |
| License uncertainty     | Provenance gate                 | Links and derived structure              | Remove disputed excerpts          |
| Scope expansion         | Milestone gates                 | One complete slice first                 | Defer non-MVP layers              |
| Bundle growth           | Route and bundle budgets        | Partition and lazy-load                  | Remove optional visualization     |
| Engine download failure | Hash/install smoke              | Exact cached artifacts                   | Mark the engine pending           |
| Endless research        | Explicit spike success criteria | Preselected fallback                     | Close the spike with fallback     |
