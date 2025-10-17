import type {
  CreateLessonPayload,
  Lesson,
  LessonProgress,
  LessonQuizResult,
  TechStack,
  UpdateLessonPayload,
} from '@fehub/types'

import { knowledgeBaseRepository } from '../repositories/knowledgeBaseRepository'

type QuizSubmissionPayload = {
  userId: string
  answers: Record<string, string>
}

type User = {
  id: string
  name: string
  email: string
  picture?: string
  joinDate: string
  status: 'active' | 'suspended'
}

type CreateUserPayload = {
  id?: string
  name: string
  email: string
  picture?: string
}

type UpdateUserPayload = {
  name?: string
  email?: string
  picture?: string
  status?: 'active' | 'suspended'
}

type UserStats = {
  totalLessons: number
  completedLessons: number
  inProgressLessons: number
  completionRate: number
  totalTimeSpent: number
  averageTimePerLesson: number
}

type AdminDashboardStats = {
  totalUsers: number
  totalLessons: number
  totalProgress: number
  averageCompletionRate: number
  recentSignups: number
  activeUsers: number
}

type Activity = {
  id: string
  type: 'user_signup' | 'lesson_completed' | 'lesson_created' | 'user_suspended'
  message: string
  timestamp: string
  userId?: string
  lessonId?: string
}

type ProgressOverview = {
  totalUsers: number
  totalLessons: number
  completedLessons: number
  inProgressLessons: number
  notStartedLessons: number
  averageCompletionRate: number
}

type StatsByTechStack = {
  techStack: string
  totalLessons: number
  completedLessons: number
  completionRate: number
}[]

type StatsByTime = {
  period: string
  data: {
    date: string
    completed: number
    inProgress: number
    newUsers: number
  }[]
}

export const knowledgeBaseService = {
  async getTechStacks(): Promise<TechStack[]> {
    return knowledgeBaseRepository.getTechStacks()
  },

  async getTechStackRecord(): Promise<Record<string, TechStack>> {
    return knowledgeBaseRepository.getTechStacksRecord()
  },

  async listLessons(techStack?: string): Promise<Lesson[]> {
    if (techStack) {
      return knowledgeBaseRepository.listLessonsByTechStack(techStack)
    }
    return knowledgeBaseRepository.listLessons()
  },

  async getLesson(id: string): Promise<Lesson | undefined> {
    return knowledgeBaseRepository.getLesson(id)
  },

  async createLesson(payload: CreateLessonPayload): Promise<Lesson> {
    return knowledgeBaseRepository.createLesson(payload)
  },

  async updateLesson(id: string, updates: UpdateLessonPayload): Promise<Lesson | undefined> {
    return knowledgeBaseRepository.updateLesson(id, updates)
  },

  async deleteLesson(id: string): Promise<boolean> {
    return knowledgeBaseRepository.deleteLesson(id)
  },

  async listProgress(userId: string): Promise<Record<string, LessonProgress>> {
    return knowledgeBaseRepository.listProgressForUser(userId)
  },

  async saveProgress(
    userId: string,
    lessonId: string,
    progress: LessonProgress,
  ): Promise<LessonProgress> {
    return knowledgeBaseRepository.saveProgress(userId, lessonId, progress)
  },

  async deleteProgress(userId: string, lessonId: string): Promise<void> {
    await knowledgeBaseRepository.deleteProgress(userId, lessonId)
  },

  async listQuizResults(userId: string): Promise<Record<string, LessonQuizResult>> {
    return knowledgeBaseRepository.listQuizResultsForUser(userId)
  },

  async gradeQuiz(
    lessonId: string,
    submission: QuizSubmissionPayload,
  ): Promise<LessonQuizResult | null> {
    const lesson = await knowledgeBaseRepository.getLesson(lessonId)
    if (!lesson || !lesson.quizzes || lesson.quizzes.length === 0) {
      return null
    }
    const questions = lesson.quizzes
    let score = 0
    let totalPoints = 0
    questions.forEach((question) => {
      totalPoints += question.points
      if (submission.answers[question.id] === question.correctOptionId) {
        score += question.points
      }
    })
    const result: LessonQuizResult = {
      answers: submission.answers,
      score,
      totalPoints,
      completedAt: new Date().toISOString(),
    }
    await knowledgeBaseRepository.saveQuizResult(submission.userId, lessonId, result)
    return result
  },

  async deleteQuizResult(userId: string, lessonId: string): Promise<void> {
    await knowledgeBaseRepository.deleteQuizResult(userId, lessonId)
  },

  // User management methods
  async listUsers(options: { page: number; limit: number; status?: string }): Promise<{ users: User[]; total: number; page: number; limit: number }> {
    return knowledgeBaseRepository.listUsers(options)
  },

  async getUser(userId: string): Promise<User | undefined> {
    return knowledgeBaseRepository.getUser(userId)
  },

  async createUser(payload: CreateUserPayload): Promise<User> {
    return knowledgeBaseRepository.createUser(payload)
  },

  async syncUser(payload: { id: string; name: string; email: string; picture?: string }): Promise<User> {
    return knowledgeBaseRepository.syncUser(payload)
  },

  async updateUser(userId: string, updates: UpdateUserPayload): Promise<User | undefined> {
    return knowledgeBaseRepository.updateUser(userId, updates)
  },

  async deleteUser(userId: string): Promise<boolean> {
    return knowledgeBaseRepository.deleteUser(userId)
  },

  async getUserStats(userId: string): Promise<UserStats> {
    return knowledgeBaseRepository.getUserStats(userId)
  },

  // Admin dashboard methods
  async getAdminDashboardStats(): Promise<AdminDashboardStats> {
    return knowledgeBaseRepository.getAdminDashboardStats()
  },

  async getRecentActivities(limit: number): Promise<Activity[]> {
    return knowledgeBaseRepository.getRecentActivities(limit)
  },

  async getProgressOverview(): Promise<ProgressOverview> {
    return knowledgeBaseRepository.getProgressOverview()
  },

  async getStatsByTechStack(): Promise<StatsByTechStack> {
    return knowledgeBaseRepository.getStatsByTechStack()
  },

  async getStatsByTime(period: string): Promise<StatsByTime> {
    return knowledgeBaseRepository.getStatsByTime(period)
  },
}
