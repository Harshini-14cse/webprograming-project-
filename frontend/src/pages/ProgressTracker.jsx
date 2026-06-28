import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Plus, Trash2, Layers, Target, Clock, Award } from 'lucide-react'
import api from '@/api'
import PageHeader from '@/components/PageHeader'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Input, Select, Label } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { accentClasses } from '@/config/nav'
import { cn } from '@/lib/cn'

function CircularProgress({ value }) {
  const r = 52
  const c = 2 * Math.PI * r
  const offset = c - (value / 100) * c
  const tone = value >= 70 ? '#10b981' : value >= 40 ? '#f59e0b' : '#ef4444'
  return (
    <div className="relative flex h-36 w-36 items-center justify-center">
      <svg className="h-36 w-36 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={tone}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-3xl font-bold text-slate-900">{value}%</p>
        <p className="text-xs text-slate-400">avg score</p>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <Card className="p-5">
      <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', accent)}>
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-4 text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-0.5 text-sm text-slate-500">{label}</p>
    </Card>
  )
}

export default function ProgressTracker() {
  const [progress, setProgress] = useState(null)
  const [topic, setTopic] = useState('')
  const [duration, setDuration] = useState(30)
  const [activity, setActivity] = useState('reading')
  const [success, setSuccess] = useState('')

  const load = () => api.get('/progress').then((r) => setProgress(r.data)).catch(() => {})
  useEffect(() => {
    load()
  }, [])

  const logSession = async () => {
    if (!topic.trim()) return
    try {
      await api.post('/log-session', {
        topic: topic.trim(),
        duration_minutes: duration,
        activity,
      })
      setSuccess('Session logged!')
      setTopic('')
      load()
      setTimeout(() => setSuccess(''), 2500)
    } catch {
      /* handled silently */
    }
  }

  const reset = async () => {
    if (!confirm('Reset all progress data?')) return
    await api.delete('/reset-progress')
    load()
  }

  const avg = progress?.average_quiz_score ?? 0

  return (
    <div>
      <PageHeader
        icon={BarChart3}
        title="Progress Tracker"
        description="Track study sessions, topics and quiz performance over time."
        actions={
          <Button variant="ghost" size="sm" onClick={reset}>
            <Trash2 className="h-4 w-4" /> Reset
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Layers} label="Sessions" value={progress?.total_sessions ?? 0} accent={accentClasses.brand} />
        <StatCard icon={Target} label="Topics" value={progress?.topics_studied?.length ?? 0} accent={accentClasses.emerald} />
        <StatCard icon={Clock} label="Minutes" value={progress?.total_study_time_minutes ?? 0} accent={accentClasses.violet} />
        <StatCard icon={Award} label="Quizzes taken" value={progress?.quiz_scores?.length ?? 0} accent={accentClasses.orange} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Avg score donut */}
        <Card className="flex flex-col items-center justify-center p-6">
          <h3 className="mb-4 self-start font-semibold text-slate-900">Quiz Performance</h3>
          <CircularProgress value={avg} />
          <p className="mt-4 text-center text-sm text-slate-500">
            {avg >= 70 ? 'Great consistency — keep it up!' : avg >= 40 ? 'Solid progress so far.' : 'Take a few quizzes to build momentum.'}
          </p>
        </Card>

        {/* Log session */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="mb-4 font-semibold text-slate-900">Log a study session</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-3">
              <Label>Topic</Label>
              <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Data Structures" />
            </div>
            <div>
              <Label>Duration (min)</Label>
              <Input type="number" min={1} value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
            </div>
            <div className="sm:col-span-2">
              <Label>Activity</Label>
              <Select value={activity} onChange={(e) => setActivity(e.target.value)}>
                <option value="reading">Reading</option>
                <option value="practice">Practice</option>
                <option value="quiz">Quiz</option>
                <option value="revision">Revision</option>
                <option value="notes">Notes</option>
              </Select>
            </div>
          </div>
          {success && <p className="mt-3 text-sm font-medium text-emerald-600">{success}</p>}
          <Button onClick={logSession} disabled={!topic.trim()} className="mt-4">
            <Plus className="h-4 w-4" /> Log session
          </Button>
        </Card>
      </div>

      {/* Topics */}
      {progress?.topics_studied?.length > 0 && (
        <Card className="mt-6 p-6">
          <h3 className="mb-4 font-semibold text-slate-900">Topics studied</h3>
          <div className="flex flex-wrap gap-2">
            {progress.topics_studied.map((t) => (
              <Badge key={t} variant="brand">
                {t}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Quiz history */}
      {progress?.quiz_scores?.length > 0 && (
        <Card className="mt-6 p-6">
          <h3 className="mb-4 font-semibold text-slate-900">Quiz history</h3>
          <div className="space-y-3">
            {progress.quiz_scores.map((s, i) => {
              const p = Math.round((s.score / s.total) * 100)
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-28 truncate text-sm text-slate-600">{s.topic}</span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      className={cn(
                        'h-full rounded-full',
                        p >= 70 ? 'bg-emerald-500' : p >= 40 ? 'bg-amber-500' : 'bg-red-500'
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${p}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                  <span className="w-10 text-right text-sm font-semibold text-slate-700">{p}%</span>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Recent sessions */}
      {progress?.recent_sessions?.length > 0 && (
        <Card className="mt-6 p-6">
          <h3 className="mb-4 font-semibold text-slate-900">Recent sessions</h3>
          <div className="divide-y divide-slate-100">
            {[...progress.recent_sessions].reverse().map((s, i) => (
              <div key={i} className="flex items-center gap-3 py-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <Clock className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">{s.topic}</p>
                  <p className="text-xs text-slate-400">{s.duration_minutes} minutes</p>
                </div>
                <Badge variant="slate" className="capitalize">
                  {s.activity}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
