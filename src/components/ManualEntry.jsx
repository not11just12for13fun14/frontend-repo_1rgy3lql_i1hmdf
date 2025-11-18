import { useState } from 'react'

function ManualEntry({ onAdd }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0,10),
    amount: '',
    direction: 'expense',
    description: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.amount || !form.description) return
    const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
    const payload = {
      ...form,
      date: new Date(form.date).toISOString(),
      amount: Number(form.amount)
    }
    await fetch(`${baseUrl}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    setForm({ ...form, amount: '', description: '' })
    if (onAdd) onAdd()
  }

  return (
    <form onSubmit={submit} className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-blue-200 mb-1">Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full rounded bg-slate-900/70 border border-slate-700 text-white px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Amount</label>
          <input type="number" step="0.01" name="amount" value={form.amount} onChange={handleChange} className="w-full rounded bg-slate-900/70 border border-slate-700 text-white px-3 py-2" placeholder="0.00" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-blue-200 mb-1">Type</label>
          <select name="direction" value={form.direction} onChange={handleChange} className="w-full rounded bg-slate-900/70 border border-slate-700 text-white px-3 py-2">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Description</label>
          <input name="description" value={form.description} onChange={handleChange} className="w-full rounded bg-slate-900/70 border border-slate-700 text-white px-3 py-2" placeholder="e.g., Groceries at Target" />
        </div>
      </div>
      <div className="flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded">Add</button>
      </div>
    </form>
  )
}

export default ManualEntry
