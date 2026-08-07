"use client";

import { javascript } from "@codemirror/lang-javascript";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { useEffect, useRef } from "react";

export function CodeEditor({
  value,
  onChange,
}: Readonly<{ value: string; onChange: (value: string) => void }>) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const callback = useRef(onChange);
  callback.current = onChange;

  useEffect(() => {
    if (!host.current) return;
    const editor = new EditorView({
      parent: host.current,
      state: EditorState.create({
        doc: value,
        extensions: [
          javascript(),
          EditorView.lineWrapping,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) callback.current(update.state.doc.toString());
          }),
          EditorView.theme({
            "&": { height: "100%", background: "transparent", color: "#f1f0ea" },
            ".cm-content": {
              padding: "22px",
              caretColor: "#f4a261",
              fontFamily: "var(--font-mono)",
              fontSize: "14px",
              lineHeight: "1.7",
            },
            ".cm-gutters": { background: "transparent", color: "#747576", border: "none" },
            ".cm-activeLine": { background: "rgba(255,255,255,.035)" },
            ".cm-selectionBackground": { background: "rgba(113, 128, 255, .28) !important" },
            "&.cm-focused": { outline: "none" },
          }),
        ],
      }),
    });
    view.current = editor;
    return () => editor.destroy();
  }, []);

  useEffect(() => {
    const editor = view.current;
    if (!editor || editor.state.doc.toString() === value) return;
    editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: value } });
  }, [value]);

  return <div className="code-editor" ref={host} />;
}
