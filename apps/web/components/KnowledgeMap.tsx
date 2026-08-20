"use client";

import type { GraphEdge, GraphNode } from "@human-ecmascript/model";
import cytoscape from "cytoscape";
import { useEffect, useRef } from "react";

const maximumLabelWidth = 150;
const minimumLabelWidth = 56;

function measureNodeLabel(label: string, context: CanvasRenderingContext2D | null) {
  const measuredWidth = context?.measureText(label).width ?? label.length * 7;
  const lineCount = Math.max(1, Math.ceil(measuredWidth / maximumLabelWidth));

  return {
    boxWidth: Math.ceil(Math.min(maximumLabelWidth, Math.max(minimumLabelWidth, measuredWidth))),
    boxHeight: lineCount * 15,
  };
}

export function KnowledgeMap({
  nodes,
  edges,
}: Readonly<{ nodes: GraphNode[]; edges: GraphEdge[] }>) {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!container.current) return;
    const graphContainer = container.current;
    const compact = graphContainer.clientWidth < 640;
    const measuringContext = document.createElement("canvas").getContext("2d");
    if (measuringContext) measuringContext.font = "bold 12px Arial";
    const graph = cytoscape({
      container: graphContainer,
      elements: [
        ...nodes.map((node) => ({
          data: {
            id: node.id,
            label: node.label,
            kind: node.kind,
            ...measureNodeLabel(node.label, measuringContext),
          },
        })),
        ...edges.map((edge) => ({
          data: { id: edge.id, source: edge.source, target: edge.target, label: edge.kind },
        })),
      ],
      layout: {
        name: "breadthfirst",
        directed: true,
        direction: compact ? "rightward" : "downward",
        padding: compact ? 14 : 28,
        spacingFactor: compact ? 1.05 : 1.25,
      },
      userZoomingEnabled: true,
      minZoom: compact ? 0.45 : 0.7,
      maxZoom: 1.8,
      style: [
        {
          selector: "node",
          style: {
            label: "data(label)",
            "background-color": "#ffffff",
            "border-width": "2px",
            "border-color": "#5a5fbe",
            color: "#1f2245",
            "font-size": "12px",
            "font-weight": "bold",
            "font-family": "Arial, sans-serif",
            width: "data(boxWidth)",
            height: "data(boxHeight)",
            padding: "13px",
            shape: "round-rectangle",
            "text-valign": "center",
            "text-halign": "center",
            "text-wrap": "wrap",
            "text-max-width": "150px",
            "text-overflow-wrap": "anywhere",
            "text-justification": "center",
            "line-height": 1.15,
          },
        },
        {
          selector: 'node[kind = "record"]',
          style: { "background-color": "#25284e", color: "#ffffff", "border-color": "#f4a261" },
        },
        {
          selector: 'node[kind = "call"]',
          style: { "background-color": "#eef0ff", "border-color": "#7a80d8" },
        },
        {
          selector: 'node[kind = "type"]',
          style: { "background-color": "#eef8f3", "border-color": "#3f8c74" },
        },
        {
          selector: 'node[kind = "representation"]',
          style: { "background-color": "#fff0e5", "border-color": "#e67839" },
        },
        {
          selector: "edge",
          style: {
            width: "1.5px",
            "line-color": "#aeb1c7",
            "target-arrow-color": "#686da9",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            label: "data(label)",
            "font-size": "8px",
            color: "#77798f",
            "text-background-color": "#f5f3ed",
            "text-background-opacity": 1,
            "text-background-padding": "3px",
          },
        },
      ],
    });
    const fitGraph = () => {
      const isCompact = graphContainer.clientWidth < 640;
      graph.minZoom(isCompact ? 0.45 : 0.7);
      graph.resize();
      graph.fit(graph.elements(), isCompact ? 14 : 28);
    };
    const resizeObserver = new ResizeObserver(fitGraph);
    resizeObserver.observe(graphContainer);
    graph.one("layoutstop", fitGraph);

    return () => {
      resizeObserver.disconnect();
      graph.destroy();
    };
  }, [edges, nodes]);
  return (
    <div
      ref={container}
      className="knowledge-map"
      aria-label="Interactive specification dependency map"
    />
  );
}
