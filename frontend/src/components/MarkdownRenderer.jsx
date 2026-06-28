import ReactMarkdown from 'react-markdown'

export default function MarkdownRenderer({ content }) {
  return (
    <div className="max-w-none text-[0.95rem] leading-relaxed text-slate-300">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mb-3 mt-6 text-xl font-bold text-slate-100 first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-2.5 mt-6 flex items-center gap-2 text-lg font-semibold text-slate-100 first:mt-0">
              <span className="h-4 w-1 rounded-full bg-gradient-to-b from-brand-400 to-indigo-500" />
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-5 text-base font-semibold text-slate-200 first:mt-0">{children}</h3>
          ),
          p: ({ children }) => <p className="mb-4 leading-7 text-slate-400">{children}</p>,
          ul: ({ children }) => <ul className="mb-4 space-y-2 pl-1">{children}</ul>,
          ol: ({ children }) => (
            <ol className="mb-4 list-decimal space-y-2 pl-5 marker:font-semibold marker:text-brand-400">
              {children}
            </ol>
          ),
          li: ({ children, ordered }) =>
            ordered ? (
              <li className="pl-1 text-slate-400">{children}</li>
            ) : (
              <li className="flex gap-2.5 text-slate-400">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                <span className="flex-1">{children}</span>
              </li>
            ),
          strong: ({ children }) => <strong className="font-semibold text-slate-100">{children}</strong>,
          em: ({ children }) => <em className="italic text-slate-300">{children}</em>,
          code: ({ inline, children }) =>
            inline ? (
              <code className="rounded-md bg-brand-500/15 px-1.5 py-0.5 font-mono text-[0.85em] text-brand-300">
                {children}
              </code>
            ) : (
              <code className="font-mono text-[0.85em]">{children}</code>
            ),
          pre: ({ children }) => (
            <pre className="mb-4 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-slate-200">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 rounded-r-xl border-l-4 border-brand-500/50 bg-brand-500/10 py-1 pl-4 pr-3 italic text-slate-300">
              {children}
            </blockquote>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-brand-300 underline decoration-brand-500/40 underline-offset-2 hover:text-brand-200"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="my-6 border-white/10" />,
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-xl border border-white/10">
              <table className="min-w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-white/5">{children}</thead>,
          th: ({ children }) => (
            <th className="border-b border-white/10 px-4 py-2.5 text-left font-semibold text-slate-200">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-white/5 px-4 py-2.5 text-slate-400">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
