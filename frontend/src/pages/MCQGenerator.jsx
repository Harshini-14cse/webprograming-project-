import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ListChecks, Sparkles, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import api from '@/api'
import PageHeader from '@/components/PageHeader'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Textarea, Select, Label, Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { LoadingState } from '@/components/ui/Spinner'
import { cn } from '@/lib/cn'

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
    setQuestions([])
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

  const toggle = (i) => setRevealed((p) => ({ ...p, [i]: !p[i] }))
  const revealAll = () => {
    const all = {}
    questions.forEach((_, i) => (all[i] = true))
    setRevealed(all)
  }

  return (
    <div>
      <PageHeader
        icon={ListChecks}
        title="MCQ Generator"
        description="Create multiple-choice practice questions with answers and explanations."
      />

      <Card className="p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Number of questions</Label>
            <Input type="number" min={1} max={30} value={numQ} onChange={(e) => setNumQ(Number(e.target.value))} />
          </div>
          <div>
            <Label>Difficulty</Label>
            <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Select>
          </div>
        </div>
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
        <Button onClick={generate} loading={loading} className="mt-4">
          <Sparkles className="h-4 w-4" />
          {loading ? 'Generating…' : 'Generate MCQs'}
        </Button>
      </Card>

      {loading && <LoadingState message="Generating your questions…" />}

      {questions.length > 0 && !loading && (
        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <Badge variant="brand">{questions.length} questions</Badge>
            <Button variant="ghost" size="sm" onClick={revealAll}>
              <Eye className="h-4 w-4" /> Reveal all
            </Button>
          </div>

          <div className="space-y-4">
            {questions.map((q, i) => {
              const isOpen = revealed[i]
              return (
                <motion.div key={q.id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <Card className="p-5">
                    <div className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-500/15 text-sm font-semibold text-brand-300">
                        {i + 1}
                      </span>
                      <p className="pt-0.5 font-medium text-slate-100">{q.question}</p>
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {q.options?.map((opt, j) => {
                        const letter = opt.charAt(0)
                        const isCorrect = letter === q.correct
                        return (
                          <div
                            key={j}
                            className={cn(
                              'rounded-xl border px-3.5 py-2.5 text-sm transition-colors',
                              isOpen && isCorrect
                                ? 'border-emerald-400/40 bg-emerald-500/10 font-medium text-emerald-200'
                                : 'border-white/10 text-slate-300'
                            )}
                          >
                            <span className="flex items-center gap-2">
                              {isOpen && isCorrect && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />}
                              {opt}
                            </span>
                          </div>
                        )
                      })}
                    </div>

                    <AnimatePresence>
                      {isOpen && q.explanation && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <p className="mt-3 rounded-xl border border-brand-500/20 bg-brand-500/10 px-4 py-3 text-sm text-slate-300">
                            <span className="font-semibold text-brand-300">Explanation: </span>
                            {q.explanation}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button onClick={() => toggle(i)} className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-300 hover:text-brand-200">
                      {isOpen ? (
                        <>
                          <EyeOff className="h-4 w-4" /> Hide answer
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" /> Show answer
                        </>
                      )}
                    </button>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
