import { useState } from 'react'
import { AlignLeft } from 'lucide-react'
import Card from '../components/Card'
import Loader from '../components/Loader'
import MarkdownRenderer from '../components/MarkdownRenderer'
import api from '../api'

export default function Questions2Mark() {
  const [numQ, setNumQ] = useState(5)
  const [customText, setCustomText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const generate = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/generate-2mark', { num_questions: numQ, custom_text: customText })
      setResult(res.data.questions)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate questions')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">2-Mark Questions</h1>
      <Card>
        <div className="flex items-center gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Number of Questions</label>
            <input
              type="number" min={1} max={20}
              value={numQ}
              onChange={e => setNumQ(Number(e.target.value))}
              className="mt-1 w-32 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
        <textarea
          value={customText}
          onChange={e => setCustomText(e.target.value)}
          placeholder="Optional: paste custom text (leave blank to use uploaded PDF)"
          className="w-full border border-gray-300 rounded-lg p-3 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button
          onClick={generate}
          disabled={loading}
          className="mt-3 bg-pink-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-pink-700 disabled:opacity-50 flex items-center gap-2"
        >
          <AlignLeft size={16} />
          {loading ? 'Generating...' : 'Generate 2-Mark Questions'}
        </button>
      </Card>

      {loading && <Loader message="Generating 2-mark questions..." />}

      {result && !loading && (
        <Card title="2-Mark Questions & Answers">
          <MarkdownRenderer content={result} />
        </Card>
      )}
    </div>
  )
}
