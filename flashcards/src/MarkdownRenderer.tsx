import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { Components } from "react-markdown";

interface MarkdownRendererProps {
  content?: string;
  imagePath?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content = "",
  imagePath,
}) => {
  const calculateDepth = (node: any): number => {
    let depth = 0;
    let parent = node.parent;
    while (parent) {
      if (parent.type === "list") {
        depth++;
      }
      parent = parent.parent;
    }
    return depth - 1;
  };

  const preprocessContent = (text: string): string => {
    return text
      .replace(/&LeftFloor;|⌊/g, "⌊")
      .replace(/&RightFloor;|⌋/g, "⌋")
      .replace(/&LeftCeiling;|⌈/g, "⌈")
      .replace(/&RightCeiling;|⌉/g, "⌉")
      .replace(/&Pi;|Π/g, "Π");
  };

  const components: Partial<Components> = {
    // Table components
    table: ({ children }) => (
        <div className="my-4 overflow-x-auto">
          <table className="w-auto divide-y divide-gray-700 border border-gray-700">
            {children}
          </table>
        </div>
      ),
      thead: ({ children }) => (
        <thead className="bg-gray-800">{children}</thead>
      ),
      tbody: ({ children }) => (
        <tbody className="divide-y divide-gray-700 bg-gray-900/50">{children}</tbody>
      ),
      tr: ({ children }) => (
        <tr className="hover:bg-gray-800/50 transition-colors">{children}</tr>
      ),
      th: ({ children, style }) => {
        // Determine alignment based on style
        const textAlign = style?.textAlign || 'left';
        return (
          <th 
            className={`px-4 py-2 text-sm font-semibold border-x border-gray-700 bg-gray-800/80`}
            style={{ 
              textAlign,
              whiteSpace: 'nowrap',
              minWidth: textAlign === 'center' ? '100px' : 'auto'
            }}
          >
            {children}
          </th>
        );
      },
      td: ({ children, style }) => {
        // Determine alignment based on style
        const textAlign = style?.textAlign || 'left';
        return (
          <td 
            className="px-4 py-2 text-sm border-x border-gray-700"
            style={{ 
              textAlign,
              whiteSpace: 'pre-wrap',
              minWidth: textAlign === 'center' ? '100px' : 'auto'
            }}
          >
            {children}
          </td>
        );
      },
  

    // Existing components
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mb-4">{children}</h2>
    ),

    ul: ({ children }) => <ul className="space-y-2 my-2">{children}</ul>,

    li: ({ children, node }) => {
      const depth = calculateDepth(node);
      return (
        <li
          className="flex items-start"
          style={{ paddingLeft: `${depth * 1.5}rem` }}
        >
          <span className="inline-block w-4 shrink-0 text-gray-400 mt-1">
            •
          </span>
          <span className="pl-2 flex-1">{children}</span>
        </li>
      );
    },

    code: ({ children }) => {
      let content = children as string;
      if (typeof content === "string") {
        let lines = content.split("\n");
        const minIndent = Math.min(
          ...lines
            .filter((line) => line.trim())
            .map((line) => (line.match(/^\s*/) || [""])[0].length)
        );

        let all_lines = lines
          .map((line) => line.slice(minIndent))
          .join("\n")
          .replace(/\s+$/, "");

        return (
          <code className="inline-block px-1.5 py-0.5 bg-gray-900 rounded font-mono whitespace-pre">
            {all_lines}
          </code>
        );
      }

      return (
        <code className="inline-block px-1.5 py-0.5 bg-gray-900 rounded  font-mono">
          {children}
        </code>
      );
    },

    em: ({ children }) => <em className="italic text-gray-300">{children}</em>,

    p: ({ children }) => {
      if (typeof children === "string" && children.startsWith("@indent")) {
        const lines = children.split("\n");
        return (
          <div className="space-y-2">
            {lines.map((line, index) => {
              const indentMatch = line.match(/@indent(\d+)@(.*)/);
              if (indentMatch) {
                const [_, levelStr, content] = indentMatch;
                const level = levelStr ? parseInt(levelStr, 10) : 0;

                return (
                  <div
                    key={index}
                    className="flex items-start"
                    style={{ paddingLeft: `${level * 1.5}rem` }}
                  >
                    <span className="inline-block w-4 shrink-0 text-gray-400">
                      •
                    </span>
                    <span className="pl-2">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={components}
                      >
                        {preprocessContent(content || "")}
                      </ReactMarkdown>
                    </span>
                  </div>
                );
              }
              return (
                <div key={index} className="mb-2 leading-relaxed">
                  {line}
                </div>
              );
            })}
          </div>
        );
      }
      return <div className="mb-2 leading-relaxed">{children}</div>;
    },

    a: ({ children, href }) => (
      <a
        href={href}
        className="text-blue-500 hover:text-blue-400 underline decoration-blue-500/50 hover:decoration-blue-400"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),

    sub: ({ children }) => (
      <sub className="relative text-sm -bottom-1 px-1.5 py-0.5  rounded font-mono">
        {children}
      </sub>
    ),
    sup: ({ children }) => <sup className="text-sm">{children}</sup>,

    img: ({ src, alt }) => (
      <img
        src={src}
        alt={alt || "Image"}
        className="max-w-full rounded-lg border border-gray-700 mb-4"
      />
    ),
  };

  return (
    <div className="markdown-content">
      {imagePath && (
        <div className="mb-4">
          <img
            src={imagePath}
            alt="Question diagram"
            className="max-w-full rounded-lg border border-gray-700"
          />
        </div>
      )}
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={components}
        className="text-xl leading-relaxed"
      >
        {preprocessContent(content)}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
