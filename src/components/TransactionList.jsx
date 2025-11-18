import { useEffect, useState } from 'react'

export default function TransactionList({ refreshSignal }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ type: '', category: '' })

  const load = async () => {
    setLoading(true)
    try {
      const qs = new URLSearchParams()
      if (filters.type) qs.set('type', filters.type)
      if (filters.category) qs.set('category', filters.category)
      const res = await fetch(`${baseUrl}/api/transactions?${qs.toString()}`)
      const data = await res.json()
      setItems(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])
  useEffect(() => { load() }, [refreshSignal])
  useEffect(() => { load() }, [filters])

  const total = items.reduce((acc, it) => acc + (it.type === 'expense' ? -Math.abs(it.amount) : Math.abs(it.amount)), 0)

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-3">
        <h3 className="text-white font-semibold">Recent Transactions</h3>
        <div className="flex gap-2">
          <select value={filters.type} onChange={(e)=>setFilters(f=>({...f, type:e.target.value}))} className="bg-slate-900 text-white border border-slate-700 rounded px-3 py-2">
            <option value="">All</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <input value={filters.category} onChange={(e)=>setFilters(f=>({...f, category:e.target.value}))} placeholder="Category" className="bg-slate-900 text-white border border-slate-700 rounded px-3 py-2" />
        </div>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <div className="space-y-2">
          {items.length === 0 && (
            <p className="text-slate-400">No transactions yet.</p>
          )}
          {items.map((it) => (
            <div key={it._id?.$oid || Math.random()} className="flex items-center justify-between bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${it.type === 'income' ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
                <div>
                  <p className="text-white font-medium">{it.description}</p>
                  <p className="text-slate-400 text-sm">{it.category || 'Uncategorized'} • {new Date(it.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className={`font-semibold ${it.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {it.type === 'income' ? '+' : '-'}${Math.abs(it.amount).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between">
        <span className="text-slate-300">Net</span>
        <span className={`font-semibold ${total>=0 ? 'text-emerald-400' : 'text-rose-400'}`}>${total.toFixed(2)}</span>
      </div>
    </div>
  )
}
