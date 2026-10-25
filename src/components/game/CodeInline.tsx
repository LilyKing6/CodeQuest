"use client";

import { Fragment } from "react";

/** 把 `code` 片段渲染为等宽高亮（题干/解析共用） */
export function RichText({ text }: { text: string }) {
  const parts = text.split("`");
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <code
            key={i}
            className="rounded bg-surface-3 px-1.5 py-0.5 font-mono text-[0.9em] text-cyan-strong"
          >
            {part}
          </code>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
