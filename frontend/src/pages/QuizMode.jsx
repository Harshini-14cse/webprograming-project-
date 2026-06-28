import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { GraduationCap, CheckCircle2, XCircle, RotateCcw, Trophy, ArrowRight } from 'lucide-react'
import api from '@/api'
import PageHeader from '@/components/PageHeader'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Textarea, Label, Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { LoadingState } from '@/components/ui/Spinner'
import { cn } from '@/lib/cn'

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
    const isCorrect = opt.charAt(0) === questions[current].correct
    setSelected(opt)
    if (isCorrect) setScore((s) => s + 1)
    setAnswers((prev) => [
      ...prev,
      { question: questions[current].question, selected: opt, correct: questions[current].correct, isCorrect },
    ])
  }

  const next = () => {
    if (current + 1 >= questions.length) {
      setFinished(true)
      api.post('/log-quiz-score', { topic: 'Quiz', score, total: questions.length }).catch(() => {})
      const finalPct = Math.round((score / questions.length) * 100)
      if (finalPct >= 70) {
        confetti({ particleCount: 140, spread: 75, origin: { y: 0.6 }, colors: ['#8b5cf6', '#6366f1', '#a78bfa', '#c4b5fd'] })
      }
    } else {
      setCurrent((c) => c + 1)
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

  const pct = questions.length ? Math.round((score / questions.length) * 100) : 0

  // ---------- Results ----------
  if (finished) {
    const tone = pct >= 70 ? 'emerald' : pct >= 40 ? 'amber' : 'red'
    return (
      <div>
        <PageHeader icon={GraduationCap} title="Quiz Results" />
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="overflow-hidden">
            <div
              className={cn(
                'flex flex-col items-center px-6 py-10 text-center',
                tone === 'emerald' && 'bg-gradient-to-b from-emerald-500/15 to-transparent',
                tone === 'amber' && 'bg-gradient-to-b from-amber-500/15 to-transparent',
                tone === 'red' && 'bg-gradient-to-b from-red-500/15 to-transparent'
              )}
            >
              <div
                className={cn(
                  'flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-[var(--shadow-glow)]',
                  tone === 'emerald' && 'bg-emerald-500',
                  tone === 'amber' && 'bg-amber-500',
                  tone === 'red' && 'bg-red-500'
                )}
              >
                <Trophy className="h-8 w-8" />
              </div>
              <p
                className={cn(
                  'mt-5 text-5xl font-bold',
                  tone === 'emerald' && 'text-emerald-300',
                  tone === 'amber' && 'text-amber-300',
                  tone === 'red' && 'text-red-300'
                )}
              >
                {pct}%
              </p>
              <p className="mt-1 text-slate-400">
                {score} of {questions.length} correct
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-100">
                {pct >= 70 ? '🎉 Excellent work!' : pct >= 40 ? '👍 Good effort!' : '📚 Keep practicing!'}
              </p>
            </div>

            <div className="space-y-2.5 p-6">
              {answers.map((a, i) => (
                <div
                  key={i}
                  className={cn(
                    'rounded-xl border p-3.5',
                    a.isCorrect ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    {a.isCorrect ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        Q{i + 1}. {a.question}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {a.isCorrect ? (
                          <span className="text-emerald-300">Your answer: {a.selected}</span>
                        ) : (
                          <>
                            <span className="text-red-300">You: {a.selected}</span>
                            <span className="mx-1.5 text-slate-600">•</span>
                            <span className="text-emerald-300">Correct: {a.correct}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <Button onClick={reset} className="mt-3 w-full" size="lg">
                <RotateCcw className="h-4 w-4" /> Take another quiz
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  // ---------- Setup ----------
  if (questions.length === 0) {
    return (
      <div>
        <PageHeader icon={GraduationCap} title="Quiz Mode" description="Test yourself with an interactive, scored quiz." />
        <Card className="p-6">
          <Label>Number of questions</Label>
          <Input type="number" min={1} max={20} value={numQ} onChange={(e) => setNumQ(Number(e.target.value))} className="max-w-[180px]" />
          <div className="mt-4">
            <Label>Custom text (optional)</Label>
            <Textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Leave empty to use your uploaded PDF…"
              className="h-24"
            />
          </div>
          {error && (
            <Alert variant="error" className="mt-4">
              {error}
            </Alert>
          )}
          <Button onClick={startQuiz} loading={loading} size="lg" className="mt-4 w-full">
            {loading ? 'Preparing quiz…' : 'Start Quiz'}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </Button>
        </Card>
        {loading && <LoadingState message="Building your quiz…" />}
      </div>
    )
  }

  // ---------- Active quiz ----------
  const q = questions[current]
  return (
    <div>
      <PageHeader icon={GraduationCap} title="Quiz Mode" />
      <Card className="p-6 sm:p-8">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-400">
            Question {current + 1} of {questions.length}
          </span>
          <span className="font-semibold text-brand-300">Score: {score}</span>
        </div>
        <div className="mb-7 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-400"
            initial={{ width: 0 }}
            animate={{ width: `${(current / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <h2 className="text-lg font-semibold text-slate-100 sm:text-xl">{q.question}</h2>
            <div className="mt-6 space-y-3">
              {q.options?.map((opt, j) => {
                const isCorrect = opt.charAt(0) === q.correct
                const isSelected = opt === selected
                return (
                  <button
                    key={j}
                    onClick={() => handleSelect(opt)}
                    disabled={selected !== null}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all',
                      selected === null && 'border-white/10 bg-white/[0.02] hover:border-brand-400/40 hover:bg-brand-500/10',
                      selected !== null && isCorrect && 'border-emerald-400/50 bg-emerald-500/15 text-emerald-200',
                      selected !== null && isSelected && !isCorrect && 'border-red-400/50 bg-red-500/15 text-red-200',
                      selected !== null && !isSelected && !isCorrect && 'border-white/10 text-slate-500'
                    )}
                  >
                    {selected !== null && isCorrect && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />}
                    {selected !== null && isSelected && !isCorrect && <XCircle className="h-5 w-5 shrink-0 text-red-400" />}
                    <span>{opt}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Button onClick={next} size="lg" className="mt-6 w-full">
              {current + 1 >= questions.length ? 'Finish quiz' : 'Next question'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </Card>
    </div>
  )
}
