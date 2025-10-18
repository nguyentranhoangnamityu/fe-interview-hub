import type {
  CreateInterviewPrepPayload,
  CreateLessonPayload,
  InterviewPrep,
  Lesson,
  TechStack,
  UpdateInterviewPrepPayload,
  UpdateLessonPayload,
} from '@fehub/types'

export type AdminStats = {
  totalUsers: number
  totalLessons: number
  totalProgress: number
  averageCompletionRate: number
  recentSignups: number
  activeUsers: number
}

export type AdminUser = {
  id: string
  name: string
  email: string
  picture?: string
  joinDate: string
  status: 'active' | 'suspended'
}

export type AdminActivity = {
  id: string
  type: string
  message: string
  timestamp: string
  userId?: string
  lessonId?: string
}

type UsersApiResponse = { users: AdminUser[] } | AdminUser[]
type LessonsApiResponse = { lessons: Lesson[] } | Lesson[]
type TechStacksApiResponse = { techStacks: TechStack[] } | TechStack[]

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

class ApiClient {
  constructor(private readonly baseURL: string) {}

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<{ data: T }> {
    const url = `${this.baseURL}${endpoint}`

    const headers = new Headers(options.headers ?? {})
    if (!headers.has('Cache-Control')) {
      headers.set('Cache-Control', 'no-cache')
    }

    const shouldIncludeJson = options.body !== undefined && options.method !== 'GET'
    if (shouldIncludeJson && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const message = await response.text()
      throw new Error(message || `HTTP error! status: ${response.status}`)
    }

    if (response.status === 204) {
      return { data: undefined as T }
    }

    const text = await response.text()
    const json = text ? JSON.parse(text) : undefined
    const payload =
      json && typeof json === 'object' && 'data' in json
        ? (json as { data: T }).data
        : (json as T)

    return { data: payload }
  }

  async getDashboardStats() {
    const timestamp = Date.now()
    return this.request<AdminStats>(`/admin/dashboard/stats?t=${timestamp}`)
  }

  async getUsers(options: { page?: number; limit?: number; status?: string } = {}) {
    const timestamp = Date.now()
    const params = new URLSearchParams()
    if (options.page) params.append('page', options.page.toString())
    if (options.limit) params.append('limit', options.limit.toString())
    if (options.status) params.append('status', options.status)
    params.append('t', timestamp.toString())

    const queryString = params.toString()
    const endpoint = `/users?${queryString}`

    return this.request<UsersApiResponse>(endpoint)
  }

  async createUser(userData: { name: string; email: string; picture?: string }) {
    return this.request<AdminUser>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async updateUser(userId: string, updates: Partial<AdminUser>) {
    return this.request<AdminUser>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async deleteUser(userId: string) {
    await this.request<undefined>(`/users/${userId}`, {
      method: 'DELETE',
    })
  }

  async getLessons(techStack?: string) {
    const timestamp = Date.now()
    const endpoint = techStack ? `/lessons?techStack=${techStack}&t=${timestamp}` : `/lessons?t=${timestamp}`
    return this.request<LessonsApiResponse>(endpoint)
  }

  async getTechStacks() {
    const timestamp = Date.now()
    return this.request<TechStacksApiResponse>(`/tech-stacks?t=${timestamp}`)
  }

  async createLesson(lessonData: CreateLessonPayload) {
    return this.request<Lesson>('/lessons', {
      method: 'POST',
      body: JSON.stringify(lessonData),
    })
  }

  async updateLesson(lessonId: string, updates: UpdateLessonPayload) {
    const encodedId = encodeURIComponent(lessonId)
    return this.request<Lesson>(`/lessons/${encodedId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async deleteLesson(lessonId: string) {
    const encodedId = encodeURIComponent(lessonId)
    await this.request<undefined>(`/lessons/${encodedId}`, {
      method: 'DELETE',
    })
  }

  async getInterviewPreps() {
    const timestamp = Date.now()
    return this.request<InterviewPrep[]>(`/interview-preps?t=${timestamp}`)
  }

  async getInterviewPrep(prepId: string) {
    const encodedId = encodeURIComponent(prepId)
    return this.request<InterviewPrep>(`/interview-preps/${encodedId}`)
  }

  async createInterviewPrep(payload: CreateInterviewPrepPayload) {
    return this.request<InterviewPrep>('/interview-preps', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async updateInterviewPrep(prepId: string, payload: UpdateInterviewPrepPayload) {
    const encodedId = encodeURIComponent(prepId)
    return this.request<InterviewPrep>(`/interview-preps/${encodedId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  }

  async deleteInterviewPrep(prepId: string) {
    const encodedId = encodeURIComponent(prepId)
    await this.request<undefined>(`/interview-preps/${encodedId}`, {
      method: 'DELETE',
    })
  }

  async getRecentActivities(limit = 10) {
    return this.request<AdminActivity[]>(`/admin/activities?limit=${limit}`)
  }

  async getProgressStats() {
    return this.request<Record<string, unknown>>('/admin/progress/overview')
  }

  async getLessonProgress(lessonId: string) {
    return this.request<Record<string, unknown>>(`/admin/progress/lessons/${lessonId}`)
  }

  async getSystemInfo() {
    return Promise.resolve({
      data: {
        version: 'v1.0.0',
        lastUpdate: '2024-12-20',
        status: 'Hoạt động bình thường',
        dbSize: '2.4 GB',
      },
    })
  }

  async backupData() {
    return Promise.resolve({
      data: { message: 'Backup completed successfully' },
    })
  }

  async optimizeDatabase() {
    return Promise.resolve({
      data: { message: 'Database optimization completed' },
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
