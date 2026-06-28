import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarClock, Plus, X, Sparkles, BookOpen } from 'lucide-react'
import api from '@/api'
import PageHeader from '@/components/PageHeader'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { LoadingState } from '@/components/ui/Spinner'
import MarkdownRenderer from '@/components/MarkdownRenderer'

export default function Timetable() {
  const [subjects, setSubjects] = useState([''])
  const [examDate, setExamDate] = useState('')
  const [startDate, setStartDate] = useState('')
  const [dailyHours, setDailyHours] = useState(4)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const addSubject = () => setSubjects((p) => [...p, ''])
  const removeSubject = (i) => setSubjects((p) => p.filter((_, idx) => idx !== i))
  const updateSubject = (i, v) => setSubjects((p) => p.map((s, idx) => (idx === i ? v : s)))

  const generate = async () => {
    const valid = subjects.filter((s) => s.trim())
    if (!valid.length || !examDate) {
      setError('Add at least one subject and an exam date')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/generate-timetable', {
        subjects: valid,
        exam_date: examDate,
        daily_hours: dailyHours,
        start_date: startDate,
      })
      setResult(res.data.timetable)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate timetable')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        icon={CalendarClock}
        title="Study Timetable"
        description="Build a realistic, personalized study plan up to your exam."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Form */}
        <Card className="p-6 lg:col-span-2">
          <Label>Subjects</Label>
          <div className="space-y-2">
            {subjects.map((s, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  icon={BookOpen}
                  value={s}
                  onChange={(e) => updateSubject(i, e.target.value)}
                  placeholder={`Subject ${i + 1}`}
                />
                {subjects.length > 1 && (
                  <button
                    onClick={() => removeSubject(i)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addSubject}
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            <Plus className="h-4 w-4" /> Add subject
          </button>

          <div className="mt-5 space-y-4">
            <div>
              <Label>Exam date</Label>
              <Input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
            </div>
            <div>
              <Label>Start date (optional)</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <Label>Daily study hours</Label>
              <Input
                type="number"
                min={1}
                max={12}
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
              />
            </div>
          </div>

          {error && (
            <Alert variant="error" className="mt-4">
              {error}
            </Alert>
          )}

          <Button onClick={generate} loading={loading} className="mt-5 w-full">
            <Sparkles className="h-4 w-4" />
            {loading ? 'Building plan…' : 'Generate Timetable'}
          </Button>
        </Card>

        {/* Result */}
        <div className="lg:col-span-3">
          {loading && (
            <Card className="p-6">
              <LoadingState message="Crafting your study plan…" />
            </Card>
          )}

          {result && !loading && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="overflow-hidden">
                <div className="flex items-center gap-2 border-b border-slate-100 bg-gradient-to-r from-cyan-50 to-white px-6 py-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
                    <CalendarClock className="h-4 w-4" />
                  </span>
                  <h3 className="font-semibold text-slate-900">Your Study Plan</h3>
                </div>
                <div className="p-6">
                  <MarkdownRenderer content={result} />
                </div>
              </Card>
            </motion.div>
          )}

          {!result && !loading && (
            <Card className="flex h-full flex-col items-center justify-center p-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
                <CalendarClock className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-700">Your plan appears here</h3>
              <p className="mt-1 max-w-xs text-sm text-slate-500">
                Add your subjects and exam date, then generate a day-by-day schedule.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
