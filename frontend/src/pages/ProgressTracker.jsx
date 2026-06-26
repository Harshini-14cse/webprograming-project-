import { useState, useEffect } from 'react'
import { BarChart3, Plus, Trash2 } from 'lucide-react'
import Card from '../components/Card'
import api from '../api'

export default function ProgressTracker() {
  const [progress, setProgress] = useState(null)
  const [topic, setTopic] = useState('')
  const [duration, setDuration] = useState(30)
  const [activity, setActivity] = useState('reading')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const load = () => {
    api.get('/progress').then(r => setProgress(r.data)).catch(() => {})
  }

  useEffect(() => { load() }, [])

  const logSession = async () => {
    if (!topic.trim()) return
    try {
      await api.post('/log-session', { topic: topic.trim(), duration_minutes: duration, activity })
      setSuccess('Session logged!')
      setTopic('')
      load()
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to log session')
    }
  }

  const reset = async () => {
    if (!confirm('Reset all progress data?')) return
    await api.delete('/reset-progress')
    load()
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Progress Tracker</h1>
        <button onClick={reset} className="text-red-500 text-sm hover:underline flex items-center gap-1">
          <Trash2 size={14} /> Reset
        </button>
      </div>

      {progress && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Sessions', value: progress.total_sessions, color: 'text-blue-600' },
            { label: 'Topics', value: progress.topics_studied?.length || 0, color: 'text-green-600' },
            { label: 'Minutes', value: progress.total_study_time_minutes, color: 'text-purple-600' },
            { label: 'Avg Score', value: `${progress.average_quiz_score}%`, color: 'text-orange-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <Card title="Log Study Session">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Topic</label>
            <input value={topic} onChange={e => setTopic(e.target.value)}
              placeholder="e.g., Data Structures"
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Duration (minutes)</label>
            <input type="number" min={1} value={duration} onChange={e => setDuration(Number(e.target.value))}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Activity</label>
            <select value={activity} onChange={e => setActivity(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="reading">Reading</option>
              <option value="practice">Practice</option>
              <option value="quiz">Quiz</option>
              <option value="revision">Revision</option>
              <option value="notes">Notes</option>
            </select>
          </div>
        </div>
        {success && <p className="text-green-600 text-sm mb-2">{success}</p>}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button onClick={logSession} disabled={!topic.trim()}
          className="bg-lime-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-lime-700 disabled:opacity-50 flex items-center gap-2">
          <Plus size={16} /> Log Session
        </button>
      </Card>

      {progress?.topics_studied?.length > 0 && (
        <Card title="Topics Studied">
          <div className="flex flex-wrap gap-2">
            {progress.topics_studied.map(t => (
              <span key={t} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{t}</span>
            ))}
          </div>
        </Card>
      )}

      {progress?.quiz_scores?.length > 0 && (
        <Card title="Quiz History">
          <div className="space-y-2">
            {progress.quiz_scores.map((s, i) => {
              const pct = Math.round((s.score / s.total) * 100)
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-24 truncate">{s.topic}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${pct >= 70 ? 'bg-green-500' : pct >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-12 text-right">{pct}%</span>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {progress?.recent_sessions?.length > 0 && (
        <Card title="Recent Sessions">
          <div className="space-y-2">
            {[...progress.recent_sessions].reverse().map((s, i) => (
              <div key={i} className="flex items-center gap-3 text-sm border-b border-gray-100 pb-2">
                <span className="font-medium text-gray-800">{s.topic}</span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-500">{s.duration_minutes} min</span>
                <span className="text-gray-400">·</span>
                <span className="text-blue-500 capitalize">{s.activity}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
