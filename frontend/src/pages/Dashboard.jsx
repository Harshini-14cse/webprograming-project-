import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Upload,
  FileText,
  CheckCircle2,
  ArrowRight,
  Clock,
  Layers,
  Target,
  Flame,
  Sparkles,
} from 'lucide-react'
import api from '@/api'
import { navSections, accentClasses } from '@/config/nav'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
}
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

const featureItems = navSections
  .flatMap((s) => s.items)
  .filter((i) => i.to !== '/')

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-0.5 text-sm text-slate-500">{label}</p>
    </Card>
  )
}

export default function Dashboard() {
  const [pdfStatus, setPdfStatus] = useState(null)
  const [progress, setProgress] = useState(null)

  useEffect(() => {
    api.get('/pdf-status').then((r) => setPdfStatus(r.data)).catch(() => {})
    api.get('/progress').then((r) => setProgress(r.data)).catch(() => {})
  }, [])

  return (
    <div className="space-y-8">
      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-600 to-indigo-700 p-8 text-white shadow-[var(--shadow-lifted)] sm:p-10"
      >
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-indigo-400/20 blur-2xl" />
        <div className="relative max-w-2xl">
          <Badge variant="brand" className="bg-white/15 text-white ring-white/20">
            <Sparkles className="h-3.5 w-3.5" /> AI Study Assistant
          </Badge>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Study smarter with LearnBuddy AI
          </h1>
          <p className="mt-3 max-w-xl text-brand-50/90">
            Upload your notes and instantly generate summaries, quizzes, model
            answers and more — all powered by fast, free AI.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/upload">
              <Button className="bg-white text-brand-700 hover:bg-brand-50">
                <Upload className="h-4 w-4" /> Upload PDF
              </Button>
            </Link>
            <Link to="/summary">
              <Button
                variant="outline"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/40"
              >
                Generate Summary <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {pdfStatus?.uploaded && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white/15 px-3.5 py-2 text-sm backdrop-blur">
              <CheckCircle2 className="h-4 w-4" />
              <span className="font-medium">{pdfStatus.filename}</span>
              <span className="text-white/70">loaded as context</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Layers}
          label="Study sessions"
          value={progress?.total_sessions ?? 0}
          accent={accentClasses.brand}
        />
        <StatCard
          icon={Target}
          label="Topics studied"
          value={progress?.topics_studied?.length ?? 0}
          accent={accentClasses.emerald}
        />
        <StatCard
          icon={Clock}
          label="Study minutes"
          value={progress?.total_study_time_minutes ?? 0}
          accent={accentClasses.violet}
        />
        <StatCard
          icon={Flame}
          label="Avg quiz score"
          value={`${progress?.average_quiz_score ?? 0}%`}
          accent={accentClasses.orange}
        />
      </div>

      {/* Upload nudge */}
      {pdfStatus && !pdfStatus.uploaded && (
        <Card className="flex flex-col items-start gap-4 border-brand-100 bg-brand-50/40 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-600 shadow-[var(--shadow-soft)]">
              <Upload className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-slate-800">No study material yet</p>
              <p className="text-sm text-slate-500">
                Upload a PDF to unlock summaries, quizzes and doubt solving.
              </p>
            </div>
          </div>
          <Link to="/upload">
            <Button>Upload now</Button>
          </Link>
        </Card>
      )}

      {/* Feature grid */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Study tools</h2>
          <span className="text-sm text-slate-400">{featureItems.length} features</span>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {featureItems.map((f) => {
            const Icon = f.icon
            return (
              <motion.div key={f.to} variants={item}>
                <Link to={f.to}>
                  <Card hover className="group h-full p-5">
                    <div className="flex items-start gap-4">
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accentClasses[f.accent]}`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-slate-900">{f.label}</p>
                          <ArrowRight className="h-4 w-4 -translate-x-1 text-slate-300 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-brand-500" />
                        </div>
                        <p className="mt-0.5 text-sm text-slate-500">{f.description}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Recent activity */}
      {progress?.recent_sessions?.length > 0 && (
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-900">Recent activity</h2>
          </div>
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
                <Badge variant="brand" className="capitalize">
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
