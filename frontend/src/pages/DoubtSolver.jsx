import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircleQuestion, Send, Sparkles, FileSearch, User } from 'lucide-react'
import api from '@/api'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { cn } from '@/lib/cn'

const starters = [
  'Explain this topic in simple terms',
  'Give me a real-world example',
  'What are the key points to remember?',
  'How is this used in exams?',
]

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-slate-300"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  )
}

export default function DoubtSolver() {
  const [question, setQuestion] = useState('')
  const [usePdf, setUsePdf] = useState(true)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [error, setError] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, loading])

  const ask = async (text) => {
    const q = (text ?? question).trim()
    if (!q || loading) return
    setQuestion('')
    setError('')
    setLoading(true)
    setHistory((prev) => [...prev, { role: 'user', content: q }])
    try {
      const res = await api.post('/solve-doubt', { question: q, use_pdf: usePdf })
      setHistory((prev) => [
        ...prev,
        { role: 'assistant', content: res.data.answer, usedPdf: res.data.used_pdf },
      ])
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to get an answer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-11rem)] flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-[var(--shadow-lifted)]">
          <MessageCircleQuestion className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Doubt Solver</h1>
          <p className="text-sm text-slate-500">Ask anything — answers use your PDF when relevant</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        {history.length === 0 && !loading ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-500">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-800">How can I help you study?</h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Ask a question or pick a starter below.
            </p>
            <div className="mt-6 grid w-full max-w-lg grid-cols-1 gap-2 sm:grid-cols-2">
              {starters.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-600 transition-all hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {history.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('flex gap-3', m.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                {m.role === 'assistant' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 text-white">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-3 text-sm',
                    m.role === 'user'
                      ? 'rounded-br-md bg-brand-600 text-white'
                      : 'rounded-bl-md border border-slate-200 bg-slate-50'
                  )}
                >
                  {m.role === 'user' ? (
                    <p className="leading-relaxed">{m.content}</p>
                  ) : (
                    <>
                      {m.usedPdf && (
                        <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700">
                          <FileSearch className="h-3 w-3" /> Using PDF context
                        </span>
                      )}
                      <MarkdownRenderer content={m.content} />
                    </>
                  )}
                </div>
                {m.role === 'user' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-600">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </motion.div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-slate-50 px-4 py-4">
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      {/* Composer */}
      <div className="mt-4">
        <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-[var(--shadow-soft)] focus-within:border-brand-300 focus-within:ring-4 focus-within:ring-brand-500/10">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                ask()
              }
            }}
            rows={1}
            placeholder="Ask your doubt…  (Enter to send, Shift+Enter for newline)"
            className="max-h-32 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={() => ask()}
            disabled={loading || !question.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white transition-all hover:bg-brand-700 active:scale-95 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={() => setUsePdf((v) => !v)}
          className="mt-2 flex items-center gap-2 px-1 text-xs"
        >
          <span
            className={cn(
              'relative h-5 w-9 rounded-full transition-colors',
              usePdf ? 'bg-brand-600' : 'bg-slate-200'
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all',
                usePdf ? 'left-[1.125rem]' : 'left-0.5'
              )}
            />
          </span>
          <span className="font-medium text-slate-500">Use uploaded PDF as context</span>
        </button>
      </div>
    </div>
  )
}
