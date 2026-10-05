"use client";

import { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { CodeBlock } from "@/components/chat/CodeBlock";
import { cn } from "@/lib/utils/cn";

const remarkPlugins = [remarkGfm];
const rehypePlugins = [rehypeHighlight];

const components: Components = {
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
  table: ({ children }) => (
    <div className="table-wrap">
      <table>{children}</table>
    </div>
  ),
};

type MarkdownContentProps = {
  content: string;
  isStreaming?: boolean;
};

function MarkdownContentBase({ content, isStreaming = false }: MarkdownContentProps) {
  return (
    <div className={cn("markdown", isStreaming && "is-streaming")}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export const MarkdownContent = memo(MarkdownContentBase);