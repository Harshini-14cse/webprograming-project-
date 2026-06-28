import ReactMarkdown from 'react-markdown'

export default function MarkdownRenderer({ content }) {
  return (
    <div className="max-w-none text-[0.95rem] leading-relaxed text-slate-700">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mb-3 mt-6 text-xl font-bold text-slate-900 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-2.5 mt-6 flex items-center gap-2 text-lg font-semibold text-slate-900 first:mt-0">
              <span className="h-4 w-1 rounded-full bg-brand-500" />
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-5 text-base font-semibold text-slate-800 first:mt-0">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 leading-7 text-slate-600">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 space-y-2 pl-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 list-decimal space-y-2 pl-5 marker:font-semibold marker:text-brand-500">
              {children}
            </ol>
          ),
          li: ({ children, ordered }) =>
            ordered ? (
              <li className="pl-1 text-slate-600">{children}</li>
            ) : (
              <li className="flex gap-2.5 text-slate-600">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                <span className="flex-1">{children}</span>
              </li>
            ),
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-900">{children}</strong>
          ),
          em: ({ children }) => <em className="italic text-slate-700">{children}</em>,
          code: ({ inline, children }) =>
            inline ? (
              <code className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-brand-700">
                {children}
              </code>
            ) : (
              <code className="font-mono text-[0.85em]">{children}</code>
            ),
          pre: ({ children }) => (
            <pre className="mb-4 overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm text-slate-100">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 rounded-r-xl border-l-4 border-brand-300 bg-brand-50/60 py-1 pl-4 pr-3 italic text-slate-600">
              {children}
            </blockquote>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-brand-600 underline decoration-brand-300 underline-offset-2 hover:text-brand-700"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="my-6 border-slate-100" />,
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-slate-50">{children}</thead>,
          th: ({ children }) => (
            <th className="border-b border-slate-200 px-4 py-2.5 text-left font-semibold text-slate-700">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-slate-100 px-4 py-2.5 text-slate-600">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
