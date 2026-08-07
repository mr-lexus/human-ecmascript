import type { SpecEdge, SpecNode } from "@human-ecmascript/model";

export type GraphArtifact = {
  nodes: SpecNode[];
  edges: SpecEdge[];
  outbound: Map<string, SpecEdge[]>;
  inbound: Map<string, SpecEdge[]>;
  components: string[][];
};

export function buildGraph(nodes: SpecNode[], edges: SpecEdge[]): GraphArtifact {
  const sortedNodes = [...nodes].sort((a, b) => a.id.localeCompare(b.id));
  const sortedEdges = [...edges].sort((a, b) => a.id.localeCompare(b.id));
  const nodeIds = new Set(sortedNodes.map(({ id }) => id));
  const outbound = new Map<string, SpecEdge[]>();
  const inbound = new Map<string, SpecEdge[]>();

  for (const edge of sortedEdges) {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
      throw new Error(`Dangling edge ${edge.id}: ${edge.source} -> ${edge.target}`);
    }
    outbound.set(edge.source, [...(outbound.get(edge.source) ?? []), edge]);
    inbound.set(edge.target, [...(inbound.get(edge.target) ?? []), edge]);
  }

  return {
    sortedNodes,
    sortedEdges,
    nodes: sortedNodes,
    edges: sortedEdges,
    outbound,
    inbound,
    components: stronglyConnectedComponents(sortedNodes, outbound),
  } as GraphArtifact & { sortedNodes: SpecNode[]; sortedEdges: SpecEdge[] };
}

function stronglyConnectedComponents(
  nodes: SpecNode[],
  outbound: Map<string, SpecEdge[]>,
): string[][] {
  let index = 0;
  const indexes = new Map<string, number>();
  const lowLinks = new Map<string, number>();
  const stack: string[] = [];
  const onStack = new Set<string>();
  const components: string[][] = [];

  const visit = (id: string): void => {
    indexes.set(id, index);
    lowLinks.set(id, index);
    index += 1;
    stack.push(id);
    onStack.add(id);

    for (const edge of outbound.get(id) ?? []) {
      if (!indexes.has(edge.target)) {
        visit(edge.target);
        lowLinks.set(id, Math.min(lowLinks.get(id)!, lowLinks.get(edge.target)!));
      } else if (onStack.has(edge.target)) {
        lowLinks.set(id, Math.min(lowLinks.get(id)!, indexes.get(edge.target)!));
      }
    }

    if (lowLinks.get(id) === indexes.get(id)) {
      const component: string[] = [];
      let member: string;
      do {
        member = stack.pop()!;
        onStack.delete(member);
        component.push(member);
      } while (member !== id);
      components.push(component.sort());
    }
  };

  for (const node of nodes) if (!indexes.has(node.id)) visit(node.id);
  return components.sort((a, b) => (a[0] ?? "").localeCompare(b[0] ?? ""));
}
