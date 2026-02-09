// Placeholder - will be replaced with full providers from iot-frontend
import { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'

interface ProvidersProps {
  children: ReactNode
}

function Providers({ children }: ProvidersProps) {
  return (
    <BrowserRouter basename="/app">
      {children}
    </BrowserRouter>
  )
}

export default Providers
