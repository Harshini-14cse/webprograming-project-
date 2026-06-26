import { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import Card from '../components/Card'
import Loader from '../components/Loader'
import api from '../api'

export default function MCQGenerator() {
  const [numQ, setNumQ] = useState(10)
  const [difficulty, setDifficulty] = useState('medium')
  const [customText, setCustomText] = useState('')
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState([])
  const [error, setError] = useState('')
  const [revealed, setRevealed] = useState({})

  const generate = async () => {
    setLoading(true)
    setError('')
    setRevealed({})
    try {
      const res = await api.post('/generate-mcq', {
        num_questions: numQ,
        difficulty,
        custom_text: customText,
      })
      setQuestions(res.data.questions)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate MCQs')
    } finally {
      setLoading(false)
    }
  }

  const toggle = (id) => setRevealed(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">MCQ Generator</h1>
      <Card>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Number of Questions</label>
            <input
              type="number"
              min={1} max={30}
              value={numQ}
              onChange={e => setNumQ(Number(e.target.value))}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Difficulty</label>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
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
          className="mt-3 bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
        >
          <HelpCircle size={16} />
          {loading ? 'Generating...' : 'Generate MCQs'}
        </button>
      </Card>

      {loading && <Loader message="Generating MCQ questions..." />}

      {questions.length > 0 && !loading && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">{questions.length} questions generated. Click to reveal answers.</p>
          {questions.map((q, i) => (
            <div key={q.id || i} className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="font-medium text-gray-900 mb-3">
                Q{i + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.options?.map((opt, j) => {
                  const letter = opt.charAt(0)
                  const isCorrect = letter === q.correct
                  return (
                    <div
                      key={j}
                      className={`px-3 py-2 rounded-lg text-sm border ${
                        revealed[i]
                          ? isCorrect
                            ? 'bg-green-50 border-green-400 text-green-800 font-semibold'
                            : 'border-gray-200 text-gray-500'
                          : 'border-gray-200 text-gray-700'
                      }`}
                    >
                      {opt}
                    </div>
                  )
                })}
              </div>
              {revealed[i] && q.explanation && (
                <p className="mt-3 text-sm text-blue-700 bg-blue-50 p-3 rounded-lg">
                  <strong>Explanation:</strong> {q.explanation}
                </p>
              )}
              <button
                onClick={() => toggle(i)}
                className="mt-3 text-sm text-blue-600 hover:underline"
              >
                {revealed[i] ? 'Hide Answer' : 'Show Answer'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
