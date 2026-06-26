import { useState } from 'react'
import { FileText } from 'lucide-react'
import Card from '../components/Card'
import Loader from '../components/Loader'
import MarkdownRenderer from '../components/MarkdownRenderer'
import api from '../api'

export default function Summary() {
  const [customText, setCustomText] = useState('')
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState('')
  const [error, setError] = useState('')

  const generate = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/summary', { custom_text: customText })
      setSummary(res.data.summary)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate summary')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">AI Summary</h1>
      <Card>
        <p className="text-sm text-gray-500 mb-3">
          Summarize your uploaded PDF or paste custom text below.
        </p>
        <textarea
          value={customText}
          onChange={e => setCustomText(e.target.value)}
          placeholder="Optional: paste custom text to summarize (leave blank to use uploaded PDF)"
          className="w-full border border-gray-300 rounded-lg p-3 text-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button
          onClick={generate}
          disabled={loading}
          className="mt-3 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          <FileText size={16} />
          {loading ? 'Generating...' : 'Generate Summary'}
        </button>
      </Card>

      {loading && <Loader message="Generating summary..." />}

      {summary && !loading && (
        <Card title="Summary">
          <MarkdownRenderer content={summary} />
        </Card>
      )}
    </div>
  )
}
