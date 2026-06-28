import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, Sparkles, FileSearch } from 'lucide-react'
import api from '@/api'
import PageHeader from '@/components/PageHeader'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { SkeletonText } from '@/components/ui/Skeleton'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { cn } from '@/lib/cn'

const suggestions = ['Recursion', 'Photosynthesis', 'Normalization', 'Big-O Notation', 'Osmosis']

export default function ConceptExplainer() {
  const [concept, setConcept] = useState('')
  const [usePdf, setUsePdf] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [activeConcept, setActiveConcept] = useState('')
  const [error, setError] = useState('')

  const explain = async (value) => {
    const c = (value ?? concept).trim()
    if (!c) return
    setConcept(c)
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/explain-concept', { concept: c, use_pdf: usePdf })
      setResult(res.data.explanation)
      setActiveConcept(res.data.concept || c)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to explain concept')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        icon={Lightbulb}
        title="Concept Explainer"
        description="Get a clear breakdown of any topic — with examples and analogies."
      />

      <Card className="p-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            icon={Lightbulb}
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && explain()}
            placeholder="Enter a concept, e.g. 'dynamic programming'"
            className="flex-1"
          />
          <Button onClick={() => explain()} loading={loading} className="sm:w-auto">
            <Sparkles className="h-4 w-4" /> Explain
          </Button>
        </div>

        <button onClick={() => setUsePdf((v) => !v)} className="mt-4 flex items-center gap-2.5 text-sm">
          <span className={cn('relative h-6 w-10 rounded-full transition-colors', usePdf ? 'bg-brand-600' : 'bg-white/15')}>
            <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', usePdf ? 'left-[1.125rem]' : 'left-0.5')} />
          </span>
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <FileSearch className="h-4 w-4 text-slate-500" />
            Use uploaded PDF as context
          </span>
        </button>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="self-center text-xs font-medium text-slate-500">Try:</span>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => explain(s)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 transition-colors hover:border-brand-400/40 hover:bg-brand-500/10 hover:text-brand-200"
            >
              {s}
            </button>
          ))}
        </div>

        {error && (
          <Alert variant="error" className="mt-4">
            {error}
          </Alert>
        )}
      </Card>

      {loading && (
        <Card className="mt-6 p-6">
          <SkeletonText lines={7} />
        </Card>
      )}

      {result && !loading && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <Card className="overflow-hidden">
            <div className="flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-amber-500/10 to-transparent px-6 py-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
                <Lightbulb className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-amber-300/80">Concept</p>
                <h3 className="font-semibold capitalize text-slate-100">{activeConcept}</h3>
              </div>
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
