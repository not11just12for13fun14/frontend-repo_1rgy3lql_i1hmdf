import { useState } from 'react'

export default function TransactionForm({ onCreated }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    description: '',
    category: '',
    amount: '',
    type: 'expense',
    source: 'manual',
  })
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!form.description || !form.amount) return
    setLoading(true)
    try {
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
      }
      const res = await fetch(`${baseUrl}/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to create transaction')
      setForm({ ...form, description: '', amount: '' })
      onCreated && onCreated()
    } catch (e) {
      console.error(e)
      alert('Could not save transaction')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-6 gap-3">
      <div className="sm:col-span-2">
        <label className="block text-sm text-slate-300 mb-1">Date</label>
        <input type="date" value={form.date} onChange={(e)=>setForm(f=>({...f, date:e.target.value}))} className="w-full bg-slate-900 text-white border border-slate-700 rounded px-3 py-2" />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm text-slate-300 mb-1">Description</label>
        <input value={form.description} onChange={(e)=>setForm(f=>({...f, description:e.target.value}))} placeholder="Coffee, Rent, Salary..." className="w-full bg-slate-900 text-white border border-slate-700 rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-1">Category</label>
        <input value={form.category} onChange={(e)=>setForm(f=>({...f, category:e.target.value}))} placeholder="Groceries" className="w-full bg-slate-900 text-white border border-slate-700 rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-1">Type</label>
        <select value={form.type} onChange={(e)=>setForm(f=>({...f, type:e.target.value}))} className="w-full bg-slate-900 text-white border border-slate-700 rounded px-3 py-2">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm text-slate-300 mb-1">Amount</label>
        <input type="number" step="0.01" value={form.amount} onChange={(e)=>setForm(f=>({...f, amount:e.target.value}))} placeholder="0.00" className="w-full bg-slate-900 text-white border border-slate-700 rounded px-3 py-2" />
      </div>
      <div className="sm:col-span-4 flex items-end gap-3">
        <button disabled={loading} type="submit" className="bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white px-4 py-2 rounded-lg">Add</button>
        <span className="text-slate-400 text-sm">Quickly log expenses and income manually.</span>
      </div>
    </form>
  )
}
