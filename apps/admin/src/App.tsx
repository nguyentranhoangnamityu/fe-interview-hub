import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes/AppRoutes'
import { AdminAuthProvider } from './providers/AdminAuthProvider'
import { AdminProvider } from './providers/AdminProvider'
import { useDynamicTitle } from './hooks/useDynamicTitle'

const AppContent = () => {
  useDynamicTitle()
  
  return <AppRoutes />
}

const App = () => {
  return (
    <AdminAuthProvider>
      <AdminProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AdminProvider>
    </AdminAuthProvider>
  )
}

export default App
