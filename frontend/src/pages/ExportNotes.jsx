import { useState } from 'react'
import { Download } from 'lucide-react'
import Card from '../components/Card'
import api from '../api'

export default function ExportNotes() {
  const [title, setTitle] = useState('My Study Notes')
  const [content, setContent] = useState('')
  const [filename, setFilename] = useState('study_notes')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const exportPDF = async () => {
    if (!content.trim()) { setError('Please add some content'); return }
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/export-pdf',
        { title, content, filename },
        { responseType: 'blob' }
      )
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url
      a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      setError('Failed to export PDF')
    } finally {
      setLoading(false)
    }
  }

  const templates = [
    {
      label: 'Summary Template',
      content: `# Summary Notes\n\n## Key Concepts\n- Concept 1\n- Concept 2\n\n## Important Points\n**Point 1:** Description here\n\n**Point 2:** Description here\n\n## Conclusion\nSummary conclusion here.`
    },
    {
      label: 'Q&A Template',
      content: `# Questions & Answers\n\n## 2-Mark Questions\n\nQ1. Question here?\nAnswer: Short answer here.\n\nQ2. Question here?\nAnswer: Short answer here.\n\n## Important Definitions\n- **Term 1:** Definition\n- **Term 2:** Definition`
    },
  ]

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">Export Notes as PDF</h1>
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Document Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Filename</label>
            <input value={filename} onChange={e => setFilename(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          {templates.map(t => (
            <button key={t.label} onClick={() => setContent(t.content)}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-gray-600">
              {t.label}
            </button>
          ))}
        </div>

        <label className="text-sm font-medium text-gray-700">Content (supports Markdown)</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Write your notes here... Supports # headings, **bold**, - bullet points, etc."
          className="mt-1 w-full border border-gray-300 rounded-lg p-3 text-sm h-64 resize-none font-mono focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          onClick={exportPDF}
          disabled={loading}
          className="mt-3 bg-rose-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-rose-700 disabled:opacity-50 flex items-center gap-2"
        >
          <Download size={16} />
          {loading ? 'Exporting...' : 'Export as PDF'}
        </button>
      </Card>
    </div>
  )
}
