import { useCallback, useState } from 'react'
import Header from './components/Header'
import ManualEntry from './components/ManualEntry'
import TextExtractor from './components/TextExtractor'
import TransactionsList from './components/TransactionsList'

function App() {
  const [refreshKey, setRefreshKey] = useState(0)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const bump = () => setRefreshKey((k) => k + 1)
  const setupDefaults = useCallback(async () => {
    try {
      await fetch(`${baseUrl}/api/setup/defaults`, { method: 'POST' })
    } catch {}
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen p-6">
        <Header onSetup={setupDefaults} />

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <div className="space-y-6">
            <ManualEntry onAdd={bump} />
            <TextExtractor onParsed={() => {}} onAdd={bump} />
          </div>
          <TransactionsList refreshKey={refreshKey} />
        </div>

        <div className="mt-10 text-center text-blue-300/60 text-sm">Data is stored securely and persists. You can paste any receipt or statement text and we’ll do the rest.</div>
      </div>
    </div>
  )
}

export default App
