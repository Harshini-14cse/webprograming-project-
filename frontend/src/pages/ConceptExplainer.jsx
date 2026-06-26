import { useState } from 'react'
import { Lightbulb } from 'lucide-react'
import Card from '../components/Card'
import Loader from '../components/Loader'
import MarkdownRenderer from '../components/MarkdownRenderer'
import api from '../api'

export default function ConceptExplainer() {
  const [concept, setConcept] = useState('')
  const [usePdf, setUsePdf] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const explain = async () => {
    if (!concept.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/explain-concept', { concept, use_pdf: usePdf })
      setResult(res.data.explanation)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to explain concept')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">Concept Explainer</h1>
      <Card>
        <input
          value={concept}
          onChange={e => setConcept(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && explain()}
          placeholder="Enter a concept to explain (e.g., 'recursion', 'photosynthesis')"
          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex items-center gap-2 mt-3">
          <input
            id="usePdf"
            type="checkbox"
            checked={usePdf}
            onChange={e => setUsePdf(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="usePdf" className="text-sm text-gray-600">Use uploaded PDF as context</label>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button
          onClick={explain}
          disabled={loading || !concept.trim()}
          className="mt-3 bg-yellow-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-yellow-600 disabled:opacity-50 flex items-center gap-2"
        >
          <Lightbulb size={16} />
          {loading ? 'Explaining...' : 'Explain Concept'}
        </button>
      </Card>

      {loading && <Loader message="Explaining concept..." />}

      {result && !loading && (
        <Card title={`Explanation: ${concept}`}>
          <MarkdownRenderer content={result} />
        </Card>
      )}
    </div>
  )
}
