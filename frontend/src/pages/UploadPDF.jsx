import { useState, useRef } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import Card from '../components/Card'
import api from '../api'

export default function UploadPDF() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const inputRef = useRef()

  const handleDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f?.type === 'application/pdf') setFile(f)
    else setError('Please drop a PDF file')
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setError('')
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload PDF</h1>
      <Card>
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <Upload className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 font-medium">Drag & drop a PDF here</p>
          <p className="text-gray-400 text-sm mt-1">or click to browse</p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={e => { setFile(e.target.files[0]); setError(''); setResult(null) }}
          />
        </div>

        {file && (
          <div className="mt-4 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <FileText className="text-blue-500" size={20} />
            <span className="text-sm text-gray-700 flex-1 truncate">{file.name}</span>
            <span className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</span>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle size={16} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {result && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
              <CheckCircle size={18} />
              Successfully uploaded!
            </div>
            <p className="text-sm text-gray-600">File: {result.filename}</p>
            <p className="text-sm text-gray-600">Characters extracted: {result.char_count}</p>
            {result.preview && (
              <details className="mt-2">
                <summary className="text-sm text-blue-600 cursor-pointer">Preview text</summary>
                <p className="text-xs text-gray-500 mt-2 bg-white p-3 rounded border max-h-32 overflow-y-auto">
                  {result.preview}
                </p>
              </details>
            )}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          {uploading ? 'Uploading...' : 'Upload PDF'}
        </button>
      </Card>
    </div>
  )
}
