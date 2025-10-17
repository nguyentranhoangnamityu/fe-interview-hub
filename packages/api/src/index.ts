import type {
  CreateLessonPayload,
  Lesson,
  LessonProgress,
  LessonQuizResult,
  TechStack,
  UpdateLessonPayload,
} from '@fehub/types'

export type ApiClientOptions = {
  baseUrl: string
}

export type ApiUser = {
  id: string
  name: string
  email: string
  picture?: string | null
  joinDate: string
  status: 'active' | 'suspended'
}

const parseResponse = async <T>(response: Response): Promise<{ data: T } | { error: Error }> => {
  if (response.status === 204) {
    return { data: undefined as T }
  }

  const text = await response.text()
  if (!text) {
    return { data: undefined as T }
  }

  try {
    const json = JSON.parse(text)
    const payload =
      json && typeof json === 'object' && 'data' in json
        ? (json.data as T)
        : (json as T)
    return { data: payload }
  } catch (error) {
    return { error: error as Error }
  }
}

export const createApiClient = ({ baseUrl }: ApiClientOptions) => {
  const request = async <T>(path: string, init?: RequestInit) => {
    const response = await fetch(`${baseUrl}${path}`, {
      cache: 'no-store',
      ...init,
    })
    const parsed = await parseResponse<T>(response)
    if ('error' in parsed) {
      throw parsed.error
    }
    return parsed.data
  }

  return {
    getTechStacks: () => request<TechStack[]>('/tech-stacks'),
    getTechStacksRecord: () => request<Record<string, TechStack>>('/tech-stacks/record'),
    listLessons: (techStack?: string) => {
      const query = techStack ? `?techStack=${encodeURIComponent(techStack)}` : ''
      return request<Lesson[]>(`/lessons${query}`)
    },
    getLesson: (lessonId: string) => request<Lesson>(`/lessons/${encodeURIComponent(lessonId)}`),
    createLesson: (payload: CreateLessonPayload) =>
      request<Lesson>('/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }),
    updateLesson: (lessonId: string, payload: UpdateLessonPayload) =>
      request<Lesson>(`/lessons/${encodeURIComponent(lessonId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }),
    deleteLesson: (lessonId: string) =>
      fetch(`${baseUrl}/lessons/${encodeURIComponent(lessonId)}`, {
        method: 'DELETE',
        cache: 'no-store',
      }).then(async (response) => {
        if (!response.ok && response.status !== 204) {
          throw new Error('Failed to delete lesson')
        }
        return undefined
      }),
    syncUser: (payload: { id: string; name: string; email: string; picture?: string }) =>
      request<ApiUser>('/users/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }),
    listProgress: (userId: string) => request<Record<string, LessonProgress>>(`/users/${userId}/progress`),
    saveProgress: (userId: string, lessonId: string, progress: LessonProgress) =>
      request<LessonProgress>(`/users/${userId}/progress/${encodeURIComponent(lessonId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(progress),
      }),
    deleteProgress: (userId: string, lessonId: string) =>
      fetch(`${baseUrl}/users/${userId}/progress/${encodeURIComponent(lessonId)}`, {
        method: 'DELETE',
        cache: 'no-store',
      }).then(async (response) => {
        if (!response.ok && response.status !== 204) {
          throw new Error('Failed to delete progress')
        }
        return undefined
      }),
    listQuizResults: (userId: string) =>
      request<Record<string, LessonQuizResult>>(`/users/${userId}/quizzes`),
    submitQuiz: (lessonId: string, payload: { userId: string; answers: Record<string, string> }) =>
      request<LessonQuizResult>(`/lessons/${encodeURIComponent(lessonId)}/quizzes/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }),
    deleteQuizResult: (userId: string, lessonId: string) =>
      fetch(`${baseUrl}/users/${userId}/quizzes/${encodeURIComponent(lessonId)}`, {
        method: 'DELETE',
        cache: 'no-store',
      }).then(async (response) => {
        if (!response.ok && response.status !== 204) {
          throw new Error('Failed to delete quiz result')
        }
        return undefined
      }),
  }
}
