import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../providers/AuthProvider'
import { AppLayout } from '../components/AppLayout'

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <AppLayout>{children}</AppLayout>
}
