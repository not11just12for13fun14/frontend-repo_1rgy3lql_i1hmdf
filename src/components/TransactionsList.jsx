import { useEffect, useState } from 'react'

function TransactionsList({ refreshKey }) {
  const [items, setItems] = useState([])
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${baseUrl}/api/transactions`)
      const data = await res.json()
      setItems(data)
    }
    load()
  }, [refreshKey])

  const totalExpense = items.filter(i => i.direction === 'expense').reduce((s, i) => s + i.amount, 0)
  const totalIncome = items.filter(i => i.direction === 'income').reduce((s, i) => s + i.amount, 0)

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">Recent</h3>
        <div className="text-sm text-blue-200/80">
          <span className="mr-3">Expense: -${totalExpense.toFixed(2)}</span>
          <span>Income: +${totalIncome.toFixed(2)}</span>
        </div>
      </div>
      <div className="divide-y divide-slate-700/70">
        {items.length === 0 && (
          <div className="text-blue-200/70 text-sm">No transactions yet</div>
        )}
        {items.map((t) => (
          <div key={t._id} className="py-2 flex items-center justify-between">
            <div>
              <div className="text-white">{t.description || t.merchant || 'Untitled'}</div>
              <div className="text-xs text-blue-200/70">{new Date(t.date).toLocaleString()}</div>
            </div>
            <div className={t.direction === 'expense' ? 'text-red-400' : 'text-emerald-400'}>
              {t.direction === 'expense' ? '-' : '+'}${Number(t.amount).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TransactionsList
