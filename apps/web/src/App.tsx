import './App.css'

import { AppRoutes } from './routes/AppRoutes'
import { useDynamicTitle } from './hooks/useDynamicTitle'

const App = () => {
  useDynamicTitle()
  
  return <AppRoutes />
}

export default App
