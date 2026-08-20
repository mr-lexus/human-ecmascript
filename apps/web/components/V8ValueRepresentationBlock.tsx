"use client";

import type { ContentBlock, V8ValueRepresentationArtifact } from "@human-ecmascript/model";
import { Fragment, useState } from "react";

type RepresentationBlock = Extract<ContentBlock, { type: "representation" }>;

function InlineCode({ children }: Readonly<{ children: string }>) {
  return children
    .split(/(`[^`]+`)/g)
    .map((part, index) =>
      part.startsWith("`") && part.endsWith("`") ? (
        <code key={index}>{part.slice(1, -1)}</code>
      ) : (
        <Fragment key={index}>{part}</Fragment>
      ),
    );
}

export function V8ValueRepresentationBlock({
  block,
  artifact,
  locale,
}: Readonly<{
  block: RepresentationBlock;
  artifact: V8ValueRepresentationArtifact;
  locale: "en" | "ru";
}>) {
  const [activeCaseId, setActiveCaseId] = useState(block.cases[0]!.caseId);
  const caseNote = block.cases.find(({ caseId }) => caseId === activeCaseId) ?? block.cases[0]!;
  const valueCase = artifact.cases.find(({ id }) => id === caseNote.caseId) ?? artifact.cases[0]!;
  const labels =
    locale === "ru"
      ? {
          expression: "Выражение",
          standard: "Тип по ECMA-262",
          representation: "Представление V8",
          immediate: "Значение внутри tagged slot",
          heap: "Указатель на heap-объект",
          smi: "Проверка %IsSmi",
          debug: "Нормализованный %DebugPrint",
          provenance: "Закреплённый артефакт",
          warning:
            "Это устройство конкретной версии V8. Оно не наблюдается обычным JavaScript-кодом и не является частью ECMA-262.",
        }
      : {
          expression: "Expression",
          standard: "ECMA-262 type",
          representation: "V8 representation",
          immediate: "Value inside the tagged slot",
          heap: "Pointer to a heap object",
          smi: "%IsSmi probe",
          debug: "Normalized %DebugPrint",
          provenance: "Pinned artifact",
          warning:
            "This is the layout of one V8 version. Ordinary JavaScript cannot observe it, and ECMA-262 does not require it.",
        };

  return (
    <section className="bytecode-artifact value-representation-artifact">
      <header>
        <span>V8</span>
        <div>
          <h3>{block.title}</h3>
          <p>{block.body}</p>
        </div>
      </header>
      <div className="bytecode-case-tabs" role="tablist" aria-label={block.title}>
        {block.cases.map((item) => {
          const captured = artifact.cases.find(({ id }) => id === item.caseId);
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={item.caseId === valueCase.id}
              onClick={() => setActiveCaseId(item.caseId)}
            >
              <code>{captured?.expression}</code>
              <strong>{item.title.replaceAll("`", "")}</strong>
            </button>
          );
        })}
      </div>
      <p className="bytecode-explanation">
        <InlineCode>{caseNote.explanation}</InlineCode>
      </p>
      <div className="representation-grid">
        <article>
          <span>{labels.expression}</span>
          <code>{valueCase.expression}</code>
        </article>
        <article>
          <span>{labels.standard}</span>
          <strong>{valueCase.specType}</strong>
          <small>primitive value</small>
        </article>
        <article className={valueCase.storage === "tagged-immediate" ? "is-immediate" : "is-heap"}>
          <span>{labels.representation}</span>
          <strong>
            {valueCase.storage === "tagged-immediate" ? labels.immediate : labels.heap}
          </strong>
          <small>{valueCase.debugType}</small>
        </article>
        <article>
          <span>{labels.smi}</span>
          <strong>{String(valueCase.isSmi)}</strong>
          <small>{valueCase.isSmi ? "Smi" : "not Smi"}</small>
        </article>
      </div>
      <div className="representation-debug">
        <span>{labels.debug}</span>
        {valueCase.debugSummary.map((line) => (
          <code key={line}>{line}</code>
        ))}
      </div>
      <footer>
        <p>{labels.warning}</p>
        <div>
          <strong>{labels.provenance}</strong>
          <code>
            {artifact.runtime.name} {artifact.runtime.version} · V8 {artifact.runtime.v8Version} ·{" "}
            {artifact.runtime.platform}
          </code>
          <code>binary sha256 {artifact.runtime.binarySha256}</code>
          <code>{artifact.commandTemplate}</code>
        </div>
      </footer>
    </section>
  );
}
