import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, FileText, Check, FileDown } from 'lucide-react'
import api from '@/api'
import PageHeader from '@/components/PageHeader'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Input, Textarea, Label } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'

const templates = [
  {
    label: 'Summary notes',
    content:
      '# Summary Notes\n\n## Key Concepts\n- Concept 1\n- Concept 2\n\n## Important Points\n**Point 1:** Description here\n\n**Point 2:** Description here\n\n## Conclusion\nWrap-up here.',
  },
  {
    label: 'Q&A sheet',
    content:
      '# Questions & Answers\n\n## 2-Mark Questions\n\nQ1. Question here?\nAnswer: Short answer here.\n\nQ2. Question here?\nAnswer: Short answer here.\n\n## Definitions\n- **Term 1:** Definition\n- **Term 2:** Definition',
  },
]

export default function ExportNotes() {
  const [title, setTitle] = useState('My Study Notes')
  const [filename, setFilename] = useState('study_notes')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const exportPDF = async () => {
    if (!content.trim()) {
      setError('Please add some content first')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await api.post(
        '/export-pdf',
        { title, content, filename },
        { responseType: 'blob' }
      )
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url
      a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
      setDone(true)
      setTimeout(() => setDone(false), 2500)
    } catch {
      setError('Failed to export PDF')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        icon={Download}
        title="Export Notes"
        description="Turn your notes into a clean, downloadable PDF."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-3">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Document title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label>File name</Label>
              <Input value={filename} onChange={(e) => setFilename(e.target.value)} />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="self-center text-xs font-medium text-slate-400">Templates:</span>
            {templates.map((t) => (
              <button
                key={t.label}
                onClick={() => setContent(t.content)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <Label>Content (Markdown supported)</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your notes… use # headings, **bold**, and - bullets."
              className="h-72 font-mono text-[0.85rem]"
            />
          </div>

          {error && (
            <Alert variant="error" className="mt-4">
              {error}
            </Alert>
          )}

          <Button onClick={exportPDF} loading={loading} size="lg" className="mt-5 w-full">
            <FileDown className="h-4 w-4" />
            {loading ? 'Generating PDF…' : 'Export as PDF'}
          </Button>
        </Card>

        {/* Preview / status */}
        <div className="lg:col-span-2">
          <Card className="flex h-full flex-col items-center justify-center p-8 text-center">
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-[var(--shadow-lifted)]">
                    <Check className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-800">PDF downloaded!</h3>
                  <p className="mt-1 text-sm text-slate-500">Check your downloads folder.</p>
                </motion.div>
              ) : (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                    <FileText className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-700">Ready to export</h3>
                  <p className="mt-1 max-w-xs text-sm text-slate-500">
                    Your notes will be formatted with headings, bullets and bold text into a clean PDF.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </div>
  )
}
