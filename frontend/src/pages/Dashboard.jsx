import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Upload, FileText, Lightbulb, HelpCircle, BookOpen,
  AlignLeft, AlignJustify, Clock, BarChart3, Download, CheckCircle
} from 'lucide-react'
import api from '../api'

const features = [
  { to: '/upload', icon: Upload, title: 'Upload PDF', desc: 'Upload study material', color: 'bg-blue-50 text-blue-600' },
  { to: '/summary', icon: FileText, title: 'AI Summary', desc: 'Auto-summarize content', color: 'bg-green-50 text-green-600' },
  { to: '/concepts', icon: Lightbulb, title: 'Concept Explainer', desc: 'Deep-dive explanations', color: 'bg-yellow-50 text-yellow-600' },
  { to: '/mcq', icon: HelpCircle, title: 'MCQ Generator', desc: 'Generate practice MCQs', color: 'bg-purple-50 text-purple-600' },
  { to: '/quiz', icon: BookOpen, title: 'Quiz Mode', desc: 'Test your knowledge', color: 'bg-indigo-50 text-indigo-600' },
  { to: '/2mark', icon: AlignLeft, title: '2-Mark Questions', desc: 'Short answer questions', color: 'bg-pink-50 text-pink-600' },
  { to: '/13mark', icon: AlignJustify, title: '13-Mark Questions', desc: 'Long answer questions', color: 'bg-orange-50 text-orange-600' },
  { to: '/doubt', icon: HelpCircle, title: 'Doubt Solver', desc: 'AI-powered Q&A', color: 'bg-teal-50 text-teal-600' },
  { to: '/timetable', icon: Clock, title: 'Study Timetable', desc: 'Plan your schedule', color: 'bg-cyan-50 text-cyan-600' },
  { to: '/progress', icon: BarChart3, title: 'Progress Tracker', desc: 'Track your learning', color: 'bg-lime-50 text-lime-600' },
  { to: '/export', icon: Download, title: 'Export Notes', desc: 'Download as PDF', color: 'bg-rose-50 text-rose-600' },
]

export default function Dashboard() {
  const [pdfStatus, setPdfStatus] = useState(null)
  const [progress, setProgress] = useState(null)

  useEffect(() => {
    api.get('/pdf-status').then(r => setPdfStatus(r.data)).catch(() => {})
    api.get('/progress').then(r => setProgress(r.data)).catch(() => {})
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to LearnBuddy AI</h1>
        <p className="text-blue-100 text-lg">Your intelligent study companion powered by Groq AI</p>
        {pdfStatus?.uploaded && (
          <div className="mt-4 flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2 w-fit">
            <CheckCircle size={16} />
            <span className="text-sm">PDF loaded: {pdfStatus.filename}</span>
          </div>
        )}
      </div>

      {progress && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Study Sessions', value: progress.total_sessions },
            { label: 'Topics Studied', value: progress.topics_studied?.length || 0 },
            { label: 'Study Minutes', value: progress.total_study_time_minutes },
            { label: 'Avg Quiz Score', value: `${progress.average_quiz_score}%` },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {!pdfStatus?.uploaded && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
          <Upload className="text-blue-500 shrink-0" size={20} />
          <p className="text-blue-700 text-sm">
            <Link to="/upload" className="font-semibold underline">Upload a PDF</Link> to unlock AI-powered features like summaries, MCQs, and doubt solving.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map(({ to, icon: Icon, title, desc, color }) => (
          <Link key={to} to={to}
            className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 hover:shadow-md hover:border-blue-300 transition-all"
          >
            <div className={`p-3 rounded-xl ${color}`}>
              <Icon size={22} />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{title}</div>
              <div className="text-sm text-gray-500">{desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
