import { useState } from 'react'
import { motion } from 'framer-motion'
import { ScrollText, Sparkles, Copy, Check } from 'lucide-react'
import api from '@/api'
import PageHeader from '@/components/PageHeader'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Textarea, Label, Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { SkeletonText } from '@/components/ui/Skeleton'
import MarkdownRenderer from '@/components/MarkdownRenderer'

export default function Questions13Mark() {
  const [numQ, setNumQ] = useState(3)
  const [customText, setCustomText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/generate-13mark', { num_questions: numQ, custom_text: customText })
      setResult(res.data.questions)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate questions')
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div>
      <PageHeader icon={ScrollText} title="13-Mark Questions" description="Generate detailed long-answer questions with comprehensive model answers." />

      <Card className="p-6">
        <div className="max-w-[200px]">
          <Label>Number of questions</Label>
          <Input type="number" min={1} max={10} value={numQ} onChange={(e) => setNumQ(Number(e.target.value))} />
        </div>
        <div className="mt-4">
          <Label>Custom text (optional)</Label>
          <Textarea value={customText} onChange={(e) => setCustomText(e.target.value)} placeholder="Leave empty to use your uploaded PDF…" className="h-24" />
        </div>
        {error && (
          <Alert variant="error" className="mt-4">
            {error}
          </Alert>
        )}
        <Button onClick={generate} loading={loading} className="mt-4">
          <Sparkles className="h-4 w-4" />
          {loading ? 'Generating…' : 'Generate Questions'}
        </Button>
      </Card>

      {loading && (
        <Card className="mt-6 p-6">
          <SkeletonText lines={9} />
        </Card>
      )}

      {result && !loading && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-orange-500/10 to-transparent px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/15 text-orange-300">
                  <ScrollText className="h-4 w-4" />
                </span>
                <h3 className="font-semibold text-slate-100">Model Answers</h3>
                <Badge variant="warning">13 marks each</Badge>
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
              <MarkdownRenderer content={result} />
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
