import type { GraphArtifact } from "@human-ecmascript/knowledge-graph";
import type { SpecEdge, SpecNode } from "@human-ecmascript/model";

export type ContextRequest = {
  targets: string[];
  maxNodes: number;
  outboundDepth?: number;
  reverseLimit?: number;
};

export type ContextPackage = {
  nodes: SpecNode[];
  edges: SpecEdge[];
  manifest: Array<{ id: string; score: number; reason: string }>;
  truncated: boolean;
};

export function buildContext(graph: GraphArtifact, request: ContextRequest): ContextPackage {
  const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));
  const candidates = new Map<string, { score: number; reason: string; depth: number }>();
  const queue = request.targets
    .slice()
    .sort()
    .map((id) => ({ id, score: 100, reason: "target", depth: 0 }));
  const outboundDepth = request.outboundDepth ?? 2;
  const reverseLimit = request.reverseLimit ?? 10;

  while (queue.length > 0) {
    queue.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
    const current = queue.shift()!;
    const existing = candidates.get(current.id);
    if (existing && existing.score >= current.score) continue;
    if (!nodeById.has(current.id)) throw new Error(`Unknown context target ${current.id}`);
    candidates.set(current.id, {
      score: current.score,
      reason: current.reason,
      depth: current.depth,
    });

    if (current.depth < outboundDepth) {
      for (const edge of graph.outbound.get(current.id) ?? []) {
        queue.push({
          id: edge.target,
          score: current.score - 10 / edge.weight,
          reason: `${edge.kind} from ${current.id}`,
          depth: current.depth + 1,
        });
      }
    }
    for (const edge of (graph.inbound.get(current.id) ?? []).slice(0, reverseLimit)) {
      queue.push({
        id: edge.source,
        score: current.score - 30,
        reason: `reverse ${edge.kind} to ${current.id}`,
        depth: current.depth + 1,
      });
    }
  }

  const selected = [...candidates.entries()]
    .sort((a, b) => b[1].score - a[1].score || a[0].localeCompare(b[0]))
    .slice(0, request.maxNodes);
  const selectedIds = new Set(selected.map(([id]) => id));

  return {
    nodes: selected.map(([id]) => nodeById.get(id)!),
    edges: graph.edges.filter(
      ({ source, target }) => selectedIds.has(source) && selectedIds.has(target),
    ),
    manifest: selected.map(([id, meta]) => ({ id, score: meta.score, reason: meta.reason })),
    truncated: candidates.size > selected.length,
  };
}
