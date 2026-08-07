import { describe, expect, it } from "vitest";
import { buildGraph } from "@human-ecmascript/knowledge-graph";
import { buildContext } from "./index";

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

describe("context builder", () => {
  it("is deterministic and bounded for a cyclic graph", () => {
    const graph = buildGraph(
      [node("a"), node("b"), node("c")],
      [edge("a", "b"), edge("b", "a"), edge("b", "c")],
    );
    const request = { targets: ["a"], maxNodes: 2 };
    const first = buildContext(graph, request);
    const second = buildContext(graph, request);
    expect(first).toEqual(second);
    expect(first.nodes).toHaveLength(2);
    expect(first.truncated).toBe(true);
  });
});
