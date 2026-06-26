import { useState } from 'react'
import { Clock, Plus, X } from 'lucide-react'
import Card from '../components/Card'
import Loader from '../components/Loader'
import MarkdownRenderer from '../components/MarkdownRenderer'
import api from '../api'

export default function Timetable() {
  const [subjects, setSubjects] = useState([''])
  const [examDate, setExamDate] = useState('')
  const [dailyHours, setDailyHours] = useState(4)
  const [startDate, setStartDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const addSubject = () => setSubjects(prev => [...prev, ''])
  const removeSubject = (i) => setSubjects(prev => prev.filter((_, idx) => idx !== i))
  const updateSubject = (i, val) => setSubjects(prev => prev.map((s, idx) => idx === i ? val : s))

  const generate = async () => {
    const validSubjects = subjects.filter(s => s.trim())
    if (!validSubjects.length || !examDate) {
      setError('Please add at least one subject and set the exam date')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/generate-timetable', {
        subjects: validSubjects,
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
    <div className="p-6 space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">Study Timetable Generator</h1>
      <Card>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Subjects</label>
            {subjects.map((s, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  value={s}
                  onChange={e => updateSubject(i, e.target.value)}
                  placeholder={`Subject ${i + 1}`}
                  className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {subjects.length > 1 && (
                  <button onClick={() => removeSubject(i)} className="text-red-400 hover:text-red-600">
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button onClick={addSubject} className="text-blue-600 text-sm flex items-center gap-1 hover:underline">
              <Plus size={14} /> Add Subject
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Exam Date</label>
              <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Start Date (optional)</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Daily Study Hours</label>
              <input type="number" min={1} max={12} value={dailyHours} onChange={e => setDailyHours(Number(e.target.value))}
                className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={generate}
            disabled={loading}
            className="bg-cyan-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-cyan-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Clock size={16} />
            {loading ? 'Generating...' : 'Generate Timetable'}
          </button>
        </div>
      </Card>

      {loading && <Loader message="Creating your personalized timetable..." />}

      {result && !loading && (
        <Card title="Your Study Timetable">
          <MarkdownRenderer content={result} />
        </Card>
      )}
    </div>
  )
}
