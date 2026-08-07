import { describe, expect, it } from "vitest";
import { buildGraph } from "./index";

const node = (id: string) => ({
  id,
  kind: "operation" as const,
  title: id,
  anchor: id,
  fingerprint: `hash-${id}`,
});
const edge = (source: string, target: string) => ({
  id: `${source}-${target}`,
  source,
  target,
  kind: "calls" as const,
  weight: 1,
});

describe("knowledge graph", () => {
  it("condenses cycles into a strongly connected component", () => {
    const graph = buildGraph(
      [node("a"), node("b"), node("c")],
      [edge("a", "b"), edge("b", "a"), edge("b", "c")],
    );
    expect(graph.components).toContainEqual(["a", "b"]);
    expect(graph.nodes.map(({ id }) => id)).toEqual(["a", "b", "c"]);
  });

  it("rejects dangling edges", () => {
    expect(() => buildGraph([node("a")], [edge("a", "missing")])).toThrow("Dangling edge");
  });
});
