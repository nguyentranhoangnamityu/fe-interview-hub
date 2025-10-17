import { Navigate, Route, Routes } from 'react-router-dom'

import { LoginPage } from '../screens/LoginPage'
import { NotFoundPage } from '../screens/NotFoundPage'
import { DashboardPage } from '../screens/DashboardPage'
import { KnowledgeBaseLessonPage } from '../screens/KnowledgeBaseLessonPage'
import { KnowledgeBasePage } from '../screens/KnowledgeBasePage'
import { QuizPage } from '../screens/QuizPage'
import { MockInterviewPage } from '../screens/MockInterviewPage'
import { MockInterviewLevelPage } from '../screens/MockInterviewLevelPage'
import { MockInterviewAIPage } from '../screens/MockInterviewAIPage'
import { AIInterviewPage } from '../screens/AIInterviewPage'
import { ComponentInterviewReviewPage } from '../screens/ComponentInterviewReviewPage'
import { ProtectedRoute } from './ProtectedRoute'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/knowledge-base"
        element={
          <ProtectedRoute>
            <KnowledgeBasePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/knowledge-base/:lessonId"
        element={
          <ProtectedRoute>
            <KnowledgeBaseLessonPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/knowledge-base/:lessonId/quiz"
        element={
          <ProtectedRoute>
            <QuizPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/knowledge-base/:lessonId/mock-interview"
        element={
          <ProtectedRoute>
            <MockInterviewLevelPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/knowledge-base/:lessonId/mock-interview/:level"
        element={
          <ProtectedRoute>
            <MockInterviewAIPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-interview"
        element={
          <ProtectedRoute>
            <AIInterviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/component-interview-review"
        element={
          <ProtectedRoute>
            <ComponentInterviewReviewPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
