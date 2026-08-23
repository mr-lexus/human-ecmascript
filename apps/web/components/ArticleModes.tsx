"use client";

import { Badge, Button, Drawer } from "@mantine/core";
import type {
  ArticleSection,
  Citation,
  ClaimClassification,
  ExampleManifest,
  V8BytecodeArtifact,
  V8ValueRepresentationArtifact,
} from "@human-ecmascript/model";
import { Fragment, useMemo, useState } from "react";
import { challengeIssueUrl } from "../lib/challengeIssueUrl";
import { V8BytecodeBlock } from "./V8BytecodeBlock";
import { V8ValueRepresentationBlock } from "./V8ValueRepresentationBlock";

const modeLabels = {
  en: {
    human: "Human",
    normative: "Normative trace",
    observable: "Observable",
    v8: "V8 layer",
    evidence: "Evidence",
    open: "Open operation",
    challenge: "Challenge this claim ↗",
  },
  ru: {
    human: "Простое объяснение",
    normative: "По шагам спецификации",
    observable: "Проверяем в коде",
    v8: "Как делает V8",
    evidence: "Источник",
    open: "Подробнее",
    challenge: "Оспорить утверждение ↗",
  },
} as const;

const classificationLabels: Record<"en" | "ru", Record<ClaimClassification, string>> = {
  en: {
    NORMATIVE: "NORMATIVE",
    DERIVED: "DERIVED",
    OBSERVABLE: "OBSERVABLE",
    HOST_DEFINED: "HOST DEFINED",
    IMPLEMENTATION_DEFINED: "IMPLEMENTATION DEFINED",
    V8_IMPLEMENTATION: "V8 IMPLEMENTATION",
    INFORMATIVE: "INFORMATIVE",
    UNCERTAIN: "UNCERTAIN",
  },
  ru: {
    NORMATIVE: "ТРЕБОВАНИЕ СТАНДАРТА",
    DERIVED: "СЛЕДУЕТ ИЗ СТАНДАРТА",
    OBSERVABLE: "ПРОВЕРЯЕТСЯ КОДОМ",
    HOST_DEFINED: "ЗАДАЁТСЯ СРЕДОЙ",
    IMPLEMENTATION_DEFINED: "ЗАВИСИТ ОТ РЕАЛИЗАЦИИ",
    V8_IMPLEMENTATION: "ДЕТАЛЬ V8",
    INFORMATIVE: "ПОЯСНЕНИЕ",
    UNCERTAIN: "НУЖНА ПРОВЕРКА",
  },
};

const operationKindLabels = {
  en: {
    record: "record",
    "abstract-operation": "abstract operation",
    "internal-method": "internal method",
    "runtime-semantics": "runtime semantics",
  },
  ru: {
    record: "служебная запись",
    "abstract-operation": "абстрактная операция",
    "internal-method": "внутренний метод",
    "runtime-semantics": "правила вычисления",
  },
} as const;

function RichText({ children }: Readonly<{ children: string }>) {
  return (
    <p className="rich-text">
      {children
        .split(/(`[^`]+`)/g)
        .map((part, index) =>
          part.startsWith("`") && part.endsWith("`") ? (
            <code key={index}>{part.slice(1, -1)}</code>
          ) : (
            <Fragment key={index}>{part}</Fragment>
          ),
        )}
    </p>
  );
}

export function ArticleModes({
  sections,
  examples,
  citations,
  bytecodeArtifacts,
  representationArtifacts,
  locale,
  slug,
  sourceSnapshot,
}: Readonly<{
  sections: ArticleSection[];
  examples: ExampleManifest[];
  citations: Citation[];
  bytecodeArtifacts: Record<string, V8BytecodeArtifact>;
  representationArtifacts: Record<string, V8ValueRepresentationArtifact>;
  locale: "en" | "ru";
  slug: string;
  sourceSnapshot: string;
}>) {
  const [activeSectionId, setActiveSectionId] = useState(sections[0]!.id);
  const [operationId, setOperationId] = useState<string | null>(null);
  const activeSection = sections.find(({ id }) => id === activeSectionId) ?? sections[0]!;
  const citationMap = useMemo(
    () => new Map(citations.map((citation) => [citation.id, citation])),
    [citations],
  );
  const operation = sections
    .flatMap(({ blocks }) => blocks)
    .flatMap((block) => (block.type === "operations" ? block.operations : []))
    .find(({ id }) => id === operationId);
  const operationCitation = operation ? citationMap.get(operation.citationId) : undefined;
  const labels = modeLabels[locale];
  const exampleMap = useMemo(
    () => new Map(examples.map((example) => [example.id, example])),
    [examples],
  );

  return (
    <div className="mode-layout">
      <div
        className="mode-tabs"
        role="tablist"
        aria-label={locale === "ru" ? "Уровень объяснения" : "Explanation layer"}
      >
        {sections.map((section, index) => (
          <button
            key={section.id}
            id={`section-tab-${section.id}`}
            role="tab"
            aria-controls={`section-panel-${section.id}`}
            aria-selected={section.id === activeSection.id}
            onClick={() => setActiveSectionId(section.id)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {section.tabLabel ?? labels[section.mode]}
          </button>
        ))}
      </div>
      <article
        className="mode-panel"
        id={`section-panel-${activeSection.id}`}
        role="tabpanel"
        aria-labelledby={`section-tab-${activeSection.id}`}
      >
        <div className="mode-panel-heading">
          <span>{labels[activeSection.mode]}</span>
          <h2>{activeSection.title}</h2>
        </div>
        {activeSection.blocks.map((block) => {
          if (block.type === "prose") return <RichText key={block.id}>{block.body}</RichText>;
          if (block.type === "claims")
            return (
              <div className="claim-grid" key={block.id}>
                {block.claims.map((claim) => (
                  <article className="claim-card" key={claim.id}>
                    <div>
                      <Badge
                        variant="light"
                        color={
                          claim.classification === "V8_IMPLEMENTATION"
                            ? "grape"
                            : claim.classification === "OBSERVABLE"
                              ? "teal"
                              : "indigo"
                        }
                      >
                        {classificationLabels[locale][claim.classification]}
                      </Badge>
                      <span>{Math.round(claim.confidence * 100)}%</span>
                    </div>
                    <RichText>{claim.text}</RichText>
                    <div className="claim-evidence">
                      {claim.citationIds.map((id) => {
                        const citation = citationMap.get(id);
                        return citation ? (
                          <a href={citation.url} target="_blank" rel="noreferrer" key={id}>
                            {labels.evidence}: {citation.label} ↗
                          </a>
                        ) : null;
                      })}
                    </div>
                    <a
                      className="challenge-link"
                      href={challengeIssueUrl({
                        slug,
                        locale,
                        claimId: claim.id,
                        classification: claim.classification,
                        reviewStatus: claim.reviewStatus,
                        sourceSnapshot,
                        claimText: claim.text,
                        citations: claim.citationIds
                          .map((id) => citationMap.get(id))
                          .filter((citation): citation is Citation => Boolean(citation))
                          .map(({ id, label, url }) => ({ id, label, url })),
                      })}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {labels.challenge}
                    </a>
                  </article>
                ))}
              </div>
            );
          if (block.type === "trace")
            return (
              <ol className="trace-list" key={block.id}>
                {block.steps.map((step) => (
                  <li key={step.id}>
                    <div className="trace-node" />
                    <div>
                      <span>{step.operation}</span>
                      <h3>{step.label}</h3>
                      <p>{step.detail}</p>
                      {step.citationId && citationMap.get(step.citationId) ? (
                        <a
                          href={citationMap.get(step.citationId)!.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {citationMap.get(step.citationId)!.label} ↗
                        </a>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            );
          if (block.type === "operations")
            return (
              <div className="operation-grid" key={block.id}>
                {block.operations.map((item) => (
                  <button key={item.id} onClick={() => setOperationId(item.id)}>
                    <span>{operationKindLabels[locale][item.kind]}</span>
                    <strong>{item.name}</strong>
                    <p>{item.summary}</p>
                    <b>{labels.open} →</b>
                  </button>
                ))}
              </div>
            );
          if (block.type === "bytecode") {
            const artifact = bytecodeArtifacts[block.artifactId];
            return artifact ? (
              <V8BytecodeBlock key={block.id} block={block} artifact={artifact} locale={locale} />
            ) : null;
          }
          if (block.type === "representation") {
            const artifact = representationArtifacts[block.artifactId];
            return artifact ? (
              <V8ValueRepresentationBlock
                key={block.id}
                block={block}
                artifact={artifact}
                locale={locale}
              />
            ) : null;
          }
          return (
            <aside className={`article-note note-${block.tone}`} key={block.id}>
              <span aria-hidden="true">
                {block.tone === "warning" ? "!" : block.tone === "implementation" ? "V8" : "i"}
              </span>
              <div>
                <h3>{block.title}</h3>
                <RichText>{block.body}</RichText>
              </div>
            </aside>
          );
        })}
        {activeSection.exampleIds?.length ? (
          <nav
            className="related-examples"
            aria-label={locale === "ru" ? "Связанные примеры" : "Related examples"}
          >
            <span>{locale === "ru" ? "Проверить на примерах" : "Verify with examples"}</span>
            <div>
              {activeSection.exampleIds.map((exampleId) => {
                const example = exampleMap.get(exampleId);
                return example ? (
                  <a href={`#example-${example.id}`} key={example.id}>
                    {example.title} ↓
                  </a>
                ) : null;
              })}
            </div>
          </nav>
        ) : null}
      </article>
      <Drawer
        opened={Boolean(operation)}
        onClose={() => setOperationId(null)}
        position="right"
        size="md"
        title={operation?.name ?? "Operation"}
        overlayProps={{ backgroundOpacity: 0.35, blur: 3 }}
      >
        {operation ? (
          <div className="operation-drawer">
            <Badge variant="outline">{operationKindLabels[locale][operation.kind]}</Badge>
            <p>{operation.summary}</p>
            {operationCitation ? (
              <>
                <h3>{labels.evidence}</h3>
                <a href={operationCitation.url} target="_blank" rel="noreferrer">
                  {operationCitation.label} ↗
                </a>
                <p>{operationCitation.relevance}</p>
                <code>{operationCitation.nodeId}</code>
              </>
            ) : null}
            <Button mt="xl" variant="light" onClick={() => setOperationId(null)}>
              {locale === "ru" ? "Закрыть" : "Close"}
            </Button>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}
