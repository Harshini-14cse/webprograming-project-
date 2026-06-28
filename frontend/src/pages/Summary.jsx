import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Sparkles, Copy, Check } from 'lucide-react'
import api from '@/api'
import PageHeader from '@/components/PageHeader'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Textarea, Label } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { SkeletonText } from '@/components/ui/Skeleton'
import MarkdownRenderer from '@/components/MarkdownRenderer'

export default function Summary() {
  const [customText, setCustomText] = useState('')
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/summary', { custom_text: customText })
      setSummary(res.data.summary)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate summary')
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div>
      <PageHeader
        icon={FileText}
        title="AI Summary"
        description="Turn your uploaded PDF or any text into a clear, structured summary."
      />

      <Card className="p-6">
        <Label>Custom text (optional)</Label>
        <Textarea
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Leave empty to summarize your uploaded PDF, or paste text here…"
          className="h-32"
        />
        {error && (
          <Alert variant="error" className="mt-4">
            {error}
          </Alert>
        )}
        <Button onClick={generate} loading={loading} className="mt-4">
          <Sparkles className="h-4 w-4" />
          {loading ? 'Summarizing…' : 'Generate Summary'}
        </Button>
      </Card>

      {loading && (
        <Card className="mt-6 p-6">
          <SkeletonText lines={6} />
        </Card>
      )}

      {summary && !loading && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                  <FileText className="h-4 w-4" />
                </span>
                <h3 className="font-semibold text-slate-100">Summary</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={copy}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copy
                  </>
                )}
              </Button>
            </div>
            <div className="p-6">
              <MarkdownRenderer content={summary} />
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
