import { useState } from 'react'

function TextExtractor({ onParsed, onAdd }) {
  const [raw, setRaw] = useState('')
  const [parsed, setParsed] = useState(null)
  const [loading, setLoading] = useState(false)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const parse = async () => {
    if (!raw.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: raw })
      })
      const data = await res.json()
      setParsed(data)
      if (onParsed) onParsed(data)
    } finally {
      setLoading(false)
    }
  }

  const save = async () => {
    if (!parsed) return
    const payload = {
      ...parsed,
      date: new Date(parsed.date).toISOString(),
    }
    await fetch(`${baseUrl}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    setRaw('')
    setParsed(null)
    if (onAdd) onAdd()
  }

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4 space-y-3">
      <label className="block text-sm text-blue-200">Paste any receipt or statement text</label>
      <textarea value={raw} onChange={(e) => setRaw(e.target.value)} rows={5} className="w-full rounded bg-slate-900/70 border border-slate-700 text-white px-3 py-2" placeholder="Paste here..." />
      <div className="flex gap-2">
        <button onClick={parse} disabled={loading} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded">{loading ? 'Parsing...' : 'Extract'}</button>
        {parsed && <button onClick={save} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded">Save</button>}
      </div>
      {parsed && (
        <div className="text-sm text-blue-100/80">
          <div><span className="text-blue-300">Date:</span> {new Date(parsed.date).toLocaleString()}</div>
          <div><span className="text-blue-300">Amount:</span> {parsed.amount}</div>
          <div><span className="text-blue-300">Type:</span> {parsed.direction}</div>
          <div><span className="text-blue-300">Description:</span> {parsed.description}</div>
        </div>
      )}
    </div>
  )
}

export default TextExtractor
