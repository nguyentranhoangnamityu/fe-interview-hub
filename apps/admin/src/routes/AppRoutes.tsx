import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '../screens/LoginPage'
import { DashboardPage } from '../screens/DashboardPage'
import { LessonsPage } from '../screens/LessonsPage'
import { LessonDetailPage } from '../screens/LessonDetailPage'
import { UsersPage } from '../screens/UsersPage'
import { ProgressPage } from '../screens/ProgressPage'
import { SettingsPage } from '../screens/SettingsPage'
import { ProtectedRoute } from './ProtectedRoute'
import { AdminLayout } from '../components/AdminLayout'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="lessons" element={<LessonsPage />} />
        <Route path="lessons/:lessonId" element={<LessonDetailPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="progress" element={<ProgressPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}
