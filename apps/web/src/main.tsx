import { StrictMode } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import '@fehub/ui/styles.css'
import './index.css'
import { AuthProvider } from './providers/AuthProvider'
import { KnowledgeBaseProvider } from './providers/KnowledgeBaseProvider'
import App from './App.tsx'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

if (!googleClientId) {
  console.warn('VITE_GOOGLE_CLIENT_ID is not configured. Google login will not work.')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <KnowledgeBaseProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </KnowledgeBaseProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
