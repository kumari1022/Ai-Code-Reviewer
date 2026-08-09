import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Copy, Check, Code2 } from "lucide-react";

export function CodeBox({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayLang = language ? language.toUpperCase() : "CODE";

  return (
    <div className="my-5 rounded-2xl border border-slate-850 bg-[#080d1a] overflow-hidden shadow-xl">
      {/* HEADER BAR */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d1425] border-b border-slate-850 select-none">
        <div className="flex items-center gap-2">
          <Code2 size={15} className="text-blue-400" />
          <span className="text-[11px] font-bold text-slate-300 tracking-wider font-mono">
            {displayLang}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-medium text-slate-300 hover:text-white transition-all duration-200 active:scale-95"
        >
          {copied ? (
            <>
              <Check size={13} className="text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={13} className="text-slate-400" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* CODE BLOCK */}
      <div className="overflow-x-auto font-mono text-xs">
        <SyntaxHighlighter
          language={language || "java"}
          style={oneDark}
          customStyle={{
            background: "transparent",
            margin: 0,
            padding: "16px",
            fontSize: "13px",
            lineHeight: "1.6"
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export function FormattedMarkdown({ content }) {
  if (!content) return null;

  return (
    <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed space-y-4">
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => <h3 className="text-lg font-bold text-white mt-6 mb-3 border-b border-slate-900 pb-2" {...props} />,
          h2: ({ node, ...props }) => <h4 className="text-base font-bold text-white mt-5 mb-2" {...props} />,
          h3: ({ node, ...props }) => <h5 className="text-sm font-bold text-slate-200 mt-4 mb-2" {...props} />,
          p: ({ node, ...props }) => <p className="mb-3 text-slate-300 leading-relaxed" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-1.5 text-slate-300" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-1.5 text-slate-300" {...props} />,
          li: ({ node, ...props }) => <li className="pl-1" {...props} />,
          pre: ({ children }) => <>{children}</>,
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const codeText = String(children).replace(/\n$/, "");

            if (!inline && (match || codeText.includes("\n"))) {
              return <CodeBox language={match ? match[1] : "java"} code={codeText} />;
            }

            return (
              <code className="bg-slate-900 text-blue-400 px-1.5 py-0.5 rounded font-mono text-xs border border-slate-800" {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default FormattedMarkdown;
