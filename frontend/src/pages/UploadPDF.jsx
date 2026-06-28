import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  X,
  ArrowRight,
  FileType2,
} from 'lucide-react'
import api from '@/api'
import PageHeader from '@/components/PageHeader'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'

export default function UploadPDF() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [pct, setPct] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  const pickFile = (f) => {
    if (!f) return
    if (f.type !== 'application/pdf') {
      setError('Please choose a PDF file')
      return
    }
    setError('')
    setResult(null)
    setFile(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    pickFile(e.dataTransfer.files[0])
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setError('')
    setPct(0)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) setPct(Math.round((e.loaded / e.total) * 100))
        },
      })
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <PageHeader
        icon={UploadCloud}
        title="Upload PDF"
        description="Add your study material — it becomes context for every AI tool."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-3">
          {/* Drop zone */}
          <div
            onClick={() => inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-all ${
              dragging
                ? 'border-brand-400 bg-brand-50'
                : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'
            }`}
          >
            <motion.div
              animate={dragging ? { y: -6, scale: 1.05 } : { y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 group-hover:bg-brand-100"
            >
              <UploadCloud className="h-8 w-8" />
            </motion.div>
            <p className="font-semibold text-slate-800">
              {dragging ? 'Drop your PDF here' : 'Drag & drop your PDF'}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              or <span className="font-medium text-brand-600">browse files</span> from your device
            </p>
            <p className="mt-3 text-xs text-slate-400">PDF only · up to ~20MB</p>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => pickFile(e.target.files[0])}
            />
          </div>

          {/* Selected file */}
          <AnimatePresence>
            {file && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 overflow-hidden"
              >
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
                    <FileType2 className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {(file.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                  {!uploading && (
                    <button
                      onClick={() => {
                        setFile(null)
                        setResult(null)
                      }}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {uploading && (
                  <div className="mt-3">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        className="h-full rounded-full bg-brand-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400">Uploading… {pct}%</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <Alert variant="error" className="mt-4">
              {error}
            </Alert>
          )}

          <Button
            onClick={handleUpload}
            loading={uploading}
            disabled={!file}
            size="lg"
            className="mt-5 w-full"
          >
            {uploading ? 'Uploading…' : 'Upload & Extract Text'}
          </Button>
        </Card>

        {/* Side panel */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    Upload complete
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Your document is ready to use across all tools.
                  </p>

                  <dl className="mt-5 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <dt className="text-slate-500">File</dt>
                      <dd className="max-w-[60%] truncate font-medium text-slate-800">
                        {result.filename}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-slate-500">Characters</dt>
                      <dd className="font-medium text-slate-800">
                        {result.char_count?.toLocaleString()}
                      </dd>
                    </div>
                  </dl>

                  {result.preview && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm font-medium text-brand-600">
                        Preview extracted text
                      </summary>
                      <p className="mt-2 max-h-40 overflow-y-auto rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-500">
                        {result.preview}
                      </p>
                    </details>
                  )}

                  <Link to="/summary">
                    <Button variant="outline" className="mt-5 w-full">
                      Generate a summary <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ) : (
              <motion.div key="tips" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    How it works
                  </h3>
                  <ol className="mt-4 space-y-3 text-sm text-slate-600">
                    {[
                      'Upload a PDF of your notes or textbook chapter.',
                      'We extract the text and keep it as context.',
                      'Every tool — summary, MCQ, doubts — uses it automatically.',
                    ].map((t, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                          {i + 1}
                        </span>
                        <span className="pt-0.5">{t}</span>
                      </li>
                    ))}
                  </ol>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
