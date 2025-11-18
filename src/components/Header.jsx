import { useEffect } from 'react'

function Header({ onSetup }) {
  useEffect(() => {
    // Trigger default seed once on mount
    if (onSetup) onSetup()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <header className="text-center mb-10">
      <h1 className="text-4xl font-bold text-white tracking-tight">AI Money Manager</h1>
      <p className="text-blue-200 mt-2">Fast manual entry or paste any screen text to auto-extract transactions</p>
    </header>
  )
}

export default Header
