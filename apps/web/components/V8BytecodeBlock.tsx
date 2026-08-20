"use client";

import type { ContentBlock, V8BytecodeArtifact } from "@human-ecmascript/model";
import { Fragment, useState } from "react";

type BytecodeBlock = Extract<ContentBlock, { type: "bytecode" }>;

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

export function V8BytecodeBlock({
  block,
  artifact,
  locale,
}: Readonly<{
  block: BytecodeBlock;
  artifact: V8BytecodeArtifact;
  locale: "en" | "ru";
}>) {
  const [activeCaseId, setActiveCaseId] = useState(block.cases[0]!.caseId);
  const caseNote = block.cases.find(({ caseId }) => caseId === activeCaseId) ?? block.cases[0]!;
  const bytecodeCase =
    artifact.cases.find(({ id }) => id === caseNote.caseId) ?? artifact.cases[0]!;
  const highlightedOpcodes = new Set(
    block.highlightOpcodes ?? ["LdaTheHole", "ThrowReferenceErrorIfHole"],
  );
  const labels =
    locale === "ru"
      ? {
          source: "Исходный код",
          bytecode: "Байткод Ignition",
          offset: "смещение",
          bytes: "байты",
          opcode: "операция",
          provenance: "Закреплённый артефакт",
          warning:
            "Это байткод интерпретатора конкретной версии V8, а не машинный код и не гарантия других движков.",
        }
      : {
          source: "Source",
          bytecode: "Ignition bytecode",
          offset: "offset",
          bytes: "bytes",
          opcode: "opcode",
          provenance: "Pinned artifact",
          warning:
            "This is interpreter bytecode from one V8 version, not machine code or a guarantee for other engines.",
        };

  return (
    <section className="bytecode-artifact">
      <header>
        <span>V8</span>
        <div>
          <h3>{block.title}</h3>
          <p>{block.body}</p>
        </div>
      </header>
      <div className="bytecode-case-tabs" role="tablist" aria-label={block.title}>
        {block.cases.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={item.caseId === bytecodeCase.id}
            onClick={() => setActiveCaseId(item.caseId)}
          >
            <code>{artifact.cases.find(({ id }) => id === item.caseId)?.functionName}</code>
            <strong>{item.title.replaceAll("`", "")}</strong>
          </button>
        ))}
      </div>
      <p className="bytecode-explanation">
        <InlineCode>{caseNote.explanation}</InlineCode>
      </p>
      <div className="bytecode-columns">
        <div className="bytecode-source">
          <span>{labels.source}</span>
          <pre>
            <code>{bytecodeCase.source}</code>
          </pre>
        </div>
        <div className="bytecode-listing">
          <div>
            <span>{labels.bytecode}</span>
            <small>
              {bytecodeCase.bytecodeLength} B · {bytecodeCase.registerCount} reg · frame{" "}
              {bytecodeCase.frameSize} B
            </small>
          </div>
          <div className="bytecode-table" role="table" aria-label={labels.bytecode}>
            <div role="row" className="bytecode-table-head">
              <span role="columnheader">{labels.offset}</span>
              <span role="columnheader">{labels.bytes}</span>
              <span role="columnheader">{labels.opcode}</span>
            </div>
            {bytecodeCase.instructions.map((instruction) => (
              <div
                role="row"
                className={
                  highlightedOpcodes.has(instruction.opcode)
                    ? "bytecode-highlight-instruction"
                    : undefined
                }
                key={instruction.offset}
              >
                <code role="cell">{String(instruction.offset).padStart(3, "0")}</code>
                <code role="cell">{instruction.bytes}</code>
                <code role="cell">
                  <b>{instruction.opcode}</b>
                  {instruction.operands ? ` ${instruction.operands}` : ""}
                </code>
              </div>
            ))}
          </div>
        </div>
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
