import { useState } from 'react'
import { BookOpen, CheckCircle, XCircle, RotateCcw } from 'lucide-react'
import Card from '../components/Card'
import Loader from '../components/Loader'
import api from '../api'

export default function QuizMode() {
  const [numQ, setNumQ] = useState(5)
  const [customText, setCustomText] = useState('')
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)
  const [error, setError] = useState('')

  const startQuiz = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/generate-mcq', {
        num_questions: numQ,
        difficulty: 'medium',
        custom_text: customText,
      })
      setQuestions(res.data.questions)
      setCurrent(0)
      setSelected(null)
      setScore(0)
      setAnswers([])
      setFinished(false)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load quiz')
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (opt) => {
    if (selected !== null) return
    const letter = opt.charAt(0)
    const isCorrect = letter === questions[current].correct
    setSelected(opt)
    if (isCorrect) setScore(s => s + 1)
    setAnswers(prev => [...prev, { question: questions[current].question, selected: opt, correct: questions[current].correct, isCorrect }])
  }

  const next = () => {
    if (current + 1 >= questions.length) {
      setFinished(true)
      // Log score to backend
      api.post('/log-quiz-score', { topic: 'Quiz', score, total: questions.length }).catch(() => {})
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
    }
  }

  const reset = () => {
    setQuestions([])
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setAnswers([])
    setFinished(false)
  }

  const pct = Math.round((score / questions.length) * 100)

  if (finished) {
    return (
      <div className="p-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Quiz Results</h1>
        <Card>
          <div className="text-center py-6">
            <div className={`text-6xl font-bold mb-2 ${pct >= 70 ? 'text-green-600' : pct >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
              {pct}%
            </div>
            <p className="text-gray-600">{score} / {questions.length} correct</p>
            <p className="mt-2 text-lg font-medium">
              {pct >= 70 ? '🎉 Excellent!' : pct >= 40 ? '👍 Good effort!' : '📚 Keep studying!'}
            </p>
          </div>
          <div className="space-y-3 mt-4">
            {answers.map((a, i) => (
              <div key={i} className={`p-3 rounded-lg border ${a.isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                <p className="text-sm font-medium text-gray-800">Q{i + 1}. {a.question}</p>
                <p className="text-xs mt-1">
                  {a.isCorrect
                    ? <span className="text-green-700">✓ Correct: {a.selected}</span>
                    : <span className="text-red-700">✗ You: {a.selected} | Correct: {a.correct}</span>
                  }
                </p>
              </div>
            ))}
          </div>
          <button onClick={reset} className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
            <RotateCcw size={16} /> Take Another Quiz
          </button>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Quiz Mode</h1>

      {questions.length === 0 && (
        <Card>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Number of Questions</label>
              <input
                type="number" min={1} max={20}
                value={numQ}
                onChange={e => setNumQ(Number(e.target.value))}
                className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
          <textarea
            value={customText}
            onChange={e => setCustomText(e.target.value)}
            placeholder="Optional: paste text (uses uploaded PDF if blank)"
            className="w-full border border-gray-300 rounded-lg p-3 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button
            onClick={startQuiz}
            disabled={loading}
            className="mt-3 w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <BookOpen size={16} />
            {loading ? 'Loading Quiz...' : 'Start Quiz'}
          </button>
        </Card>
      )}

      {loading && <Loader message="Preparing quiz questions..." />}

      {questions.length > 0 && !finished && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Question {current + 1} of {questions.length}</span>
            <span className="text-sm font-semibold text-blue-600">Score: {score}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${((current) / questions.length) * 100}%` }}
            />
          </div>
          <p className="text-lg font-semibold text-gray-900 mb-6">{questions[current].question}</p>
          <div className="space-y-3">
            {questions[current].options?.map((opt, j) => {
              const letter = opt.charAt(0)
              const isCorrect = letter === questions[current].correct
              const isSelected = opt === selected
              return (
                <button
                  key={j}
                  onClick={() => handleSelect(opt)}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                    selected === null
                      ? 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                      : isCorrect
                      ? 'bg-green-100 border-green-500 text-green-800'
                      : isSelected
                      ? 'bg-red-100 border-red-400 text-red-700'
                      : 'border-gray-200 text-gray-400'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {selected !== null && isCorrect && <CheckCircle size={16} className="text-green-600" />}
                    {selected !== null && isSelected && !isCorrect && <XCircle size={16} className="text-red-500" />}
                    {opt}
                  </span>
                </button>
              )
            })}
          </div>
          {selected && (
            <button
              onClick={next}
              className="mt-5 w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700"
            >
              {current + 1 >= questions.length ? 'Finish Quiz' : 'Next Question'}
            </button>
          )}
        </Card>
      )}
    </div>
  )
}
