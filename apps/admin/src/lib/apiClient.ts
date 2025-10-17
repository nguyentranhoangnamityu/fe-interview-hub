const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<{ data: T }> {
    const url = `${this.baseURL}${endpoint}`

    const headers: HeadersInit = {
      'Cache-Control': 'no-cache',
      ...options.headers,
    }

    const shouldIncludeJson = options.body !== undefined && options.method !== 'GET'
    if (shouldIncludeJson) {
      headers['Content-Type'] = headers['Content-Type'] ?? 'application/json'
    }

    const config: RequestInit = {
      ...options,
      headers,
    }

    console.log(`API Request: ${config.method || 'GET'} ${url}`)
    const response = await fetch(url, config)
    console.log(`API Response: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    if (response.status === 204) {
      return { data: undefined as T }
    }

    const text = await response.text()
    const json = text ? JSON.parse(text) : undefined
    const payload =
      json && typeof json === 'object' && 'data' in json
        ? (json.data as T)
        : (json as T)
    console.log('API Data:', payload)
    return { data: payload }
  }

  async getDashboardStats() {
    const timestamp = Date.now()
    return this.request(`/admin/dashboard/stats?t=${timestamp}`)
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

    return this.request(endpoint)
  }

  async createUser(userData: { name: string; email: string; picture?: string }) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async updateUser(userId: string, updates: any) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async deleteUser(userId: string) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE',
    })
  }

  async getLessons(techStack?: string) {
    const timestamp = Date.now()
    const endpoint = techStack ? `/lessons?techStack=${techStack}&t=${timestamp}` : `/lessons?t=${timestamp}`
    return this.request(endpoint)
  }

  async getTechStacks() {
    const timestamp = Date.now()
    return this.request(`/tech-stacks?t=${timestamp}`)
  }

  async createLesson(lessonData: any) {
    return this.request('/lessons', {
      method: 'POST',
      body: JSON.stringify(lessonData),
    })
  }

  async updateLesson(lessonId: string, updates: any) {
    const encodedId = encodeURIComponent(lessonId)
    return this.request(`/lessons/${encodedId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async deleteLesson(lessonId: string) {
    const encodedId = encodeURIComponent(lessonId)
    const endpoint = `/lessons/${encodedId}`

    console.log(`API Request: DELETE ${this.baseURL}${endpoint}`)
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Cache-Control': 'no-cache',
      },
    })

    console.log(`API Response: ${response.status} ${response.statusText}`)

    if (!response.ok && response.status !== 204) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return { data: undefined as T }
  }

  async getRecentActivities(limit = 10) {
    return this.request(`/admin/activities?limit=${limit}`)
  }

  async getProgressStats() {
    return this.request('/admin/progress/overview')
  }

  async getLessonProgress(lessonId: string) {
    return this.request(`/admin/progress/lessons/${lessonId}`)
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
