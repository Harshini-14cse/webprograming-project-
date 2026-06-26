import { useState } from 'react'
import { Send, MessageCircle } from 'lucide-react'
import MarkdownRenderer from '../components/MarkdownRenderer'
import api from '../api'

export default function DoubtSolver() {
  const [question, setQuestion] = useState('')
  const [usePdf, setUsePdf] = useState(true)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [error, setError] = useState('')

  const ask = async () => {
    if (!question.trim()) return
    const q = question.trim()
    setLoading(true)
    setError('')
    setQuestion('')
    try {
      const res = await api.post('/solve-doubt', { question: q, use_pdf: usePdf })
      setHistory(prev => [...prev, { question: q, answer: res.data.answer, usedPdf: res.data.used_pdf }])
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to get answer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl flex flex-col h-[calc(100vh-80px)]">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Doubt Solver</h1>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {history.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <MessageCircle size={48} className="mx-auto mb-3 opacity-30" />
            <p>Ask any study-related question.</p>
            <p className="text-sm mt-1">The AI will use your uploaded PDF as context.</p>
          </div>
        )}
        {history.map((item, i) => (
          <div key={i} className="space-y-3">
            <div className="flex justify-end">
              <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-tr-md max-w-[80%] text-sm">
                {item.question}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md px-4 py-3 max-w-[90%]">
              {item.usedPdf && (
                <p className="text-xs text-blue-500 mb-2">📄 Using PDF context</p>
              )}
              <MarkdownRenderer content={item.answer} />
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            Thinking...
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <div className="bg-white border border-gray-300 rounded-xl p-3 flex items-end gap-2">
        <div className="flex-1">
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask() } }}
            placeholder="Ask your doubt... (Enter to send, Shift+Enter for newline)"
            className="w-full resize-none focus:outline-none text-sm text-gray-800 min-h-[40px] max-h-32"
            rows={1}
          />
          <div className="flex items-center gap-2 mt-2">
            <input
              id="usePdfD"
              type="checkbox"
              checked={usePdf}
              onChange={e => setUsePdf(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="usePdfD" className="text-xs text-gray-500">Use PDF context</label>
          </div>
        </div>
        <button
          onClick={ask}
          disabled={loading || !question.trim()}
          className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
