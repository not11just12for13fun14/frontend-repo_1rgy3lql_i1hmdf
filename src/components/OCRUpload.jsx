import { useState } from 'react'

export default function OCRUpload({ onParsed }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch(`${baseUrl}/api/ocr`, { method: 'POST', body: formData })
      const data = await res.json()
      setResult(data)
      onParsed && onParsed(data)
    } catch (e) {
      console.error(e)
      alert('OCR failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
      <h3 className="text-white font-semibold mb-2">Extract from Screenshot</h3>
      <form onSubmit={submit} className="flex flex-col sm:flex-row items-start gap-3">
        <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0] || null)} className="text-slate-300" />
        <button disabled={loading || !file} className="bg-purple-500 hover:bg-purple-600 disabled:opacity-60 text-white px-4 py-2 rounded-lg">Extract</button>
      </form>
      {result && (
        <div className="mt-3 text-slate-300">
          <p className="text-sm opacity-80 mb-1">Raw:</p>
          <pre className="bg-slate-900/60 p-2 rounded text-xs overflow-auto">{result.text}</pre>
          <p className="text-sm opacity-80 mt-2 mb-1">Suggested:</p>
          <div className="space-y-1">
            {result.suggested?.map((tx, idx) => (
              <div key={idx} className="flex items-center justify-between bg-slate-900/60 border border-slate-700 rounded px-2 py-1">
                <span className="text-slate-200">{tx.description}</span>
                <span className={tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}>
                  {tx.type === 'income' ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
