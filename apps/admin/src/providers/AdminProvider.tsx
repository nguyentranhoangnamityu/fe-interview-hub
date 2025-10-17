import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react'
import type { TechStack, CreateLessonPayload, UpdateLessonPayload } from '@fehub/types'
import { apiClient } from '../lib/apiClient'

interface AdminStats {
  totalUsers: number
  totalLessons: number
  totalProgress: number
  averageCompletionRate: number
  recentSignups: number
  activeUsers: number
}

interface User {
  id: string
  name: string
  email: string
  picture?: string
  joinDate: string
  status: 'active' | 'suspended'
}

interface Lesson {
  id: string
  title: string
  description: string
  difficulty: string
  estimatedTime: number
  techStack: string
  tags: string[]
  status?: string
  students?: number
  completionRate?: number
}

interface Activity {
  id: string
  type: string
  message: string
  timestamp: string
  userId?: string
  lessonId?: string
}

interface AdminContextType {
  // Stats
  stats: AdminStats | null
  loading: boolean
  error: string | null
  
  // Users
  users: User[]
  usersLoading: boolean
  
  // Lessons
  lessons: Lesson[]
  lessonsLoading: boolean
  techStacks: TechStack[]
  techStacksLoading: boolean
  
  // Activities
  activities: Activity[]
  activitiesLoading: boolean
  
  // Actions
  fetchDashboardStats: () => Promise<void>
  fetchUsers: (options?: { page?: number; limit?: number; status?: string }) => Promise<void>
  fetchLessons: (techStack?: string) => Promise<void>
  fetchTechStacks: () => Promise<void>
  fetchRecentActivities: (limit?: number) => Promise<void>
  createUser: (userData: { name: string; email: string; picture?: string }) => Promise<void>
  updateUser: (userId: string, updates: any) => Promise<void>
  deleteUser: (userId: string) => Promise<void>
  createLesson: (lessonData: CreateLessonPayload) => Promise<void>
  updateLesson: (lessonId: string, updates: UpdateLessonPayload) => Promise<void>
  deleteLesson: (lessonId: string) => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

interface AdminProviderProps {
  children: ReactNode
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [users, setUsers] = useState<User[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [lessonsLoading, setLessonsLoading] = useState(false)
  const [techStacks, setTechStacks] = useState<TechStack[]>([])
  const [techStacksLoading, setTechStacksLoading] = useState(false)
  
  const [activities, setActivities] = useState<Activity[]>([])
  const [activitiesLoading, setActivitiesLoading] = useState(false)
  const hasLoadedInitialData = useRef(false)

  const fetchDashboardStats = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiClient.getDashboardStats()
      setStats(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async (options: { page?: number; limit?: number; status?: string } = {}) => {
    setUsersLoading(true)
    try {
      const response = await apiClient.getUsers(options)
      console.log('Users response:', response) // Debug log
      
      // API client wraps response in { data: T }, so response.data is the actual API response
      const apiResponse = response.data
      
      // Handle users response - it might have a different structure
      let usersArray = []
      if (apiResponse) {
        if (apiResponse.users && Array.isArray(apiResponse.users)) {
          usersArray = apiResponse.users
        } else if (Array.isArray(apiResponse)) {
          usersArray = apiResponse
        } else if (typeof apiResponse === 'object') {
          usersArray = Object.values(apiResponse)
        }
      }
      
      console.log('Users array:', usersArray)
      setUsers(usersArray)
    } catch (err) {
      console.error('Failed to fetch users:', err)
      setUsers([]) // Set empty array on error
    } finally {
      setUsersLoading(false)
    }
  }

  const fetchLessons = async (techStack?: string) => {
    setLessonsLoading(true)
    try {
      const response = await apiClient.getLessons(techStack)
      console.log('Lessons response:', response) // Debug log
      console.log('Lessons response.data:', response.data) // Debug log
      console.log('Lessons response.data type:', typeof response.data) // Debug log
      console.log('Lessons response.data isArray:', Array.isArray(response.data)) // Debug log
      
      // API client wraps response in { data: T }, so response.data is the actual API response
      const apiResponse = response.data
      console.log('API Response data:', apiResponse)
      
      // Normalize different response shapes
      let lessonsArray: Lesson[] = []
      if (Array.isArray(apiResponse)) {
        lessonsArray = apiResponse
      } else if (apiResponse && typeof apiResponse === 'object') {
        const { lessons: lessonsField } = apiResponse as { lessons?: Lesson[] }

        if (Array.isArray(lessonsField)) {
          lessonsArray = lessonsField
        } else {
          const values = Object.values(apiResponse)
          const flattened = values.flatMap(value => Array.isArray(value) ? value : [value])
          lessonsArray = flattened.filter(
            (item): item is Lesson => item && typeof item === 'object' && 'title' in item
          )
        }
      }
      
      console.log('Lessons array:', lessonsArray)
      setLessons(lessonsArray)
      console.log('Lessons set successfully:', lessonsArray.length, 'items')
    } catch (err) {
      console.error('Failed to fetch lessons:', err)
      setLessons([]) // Set empty array on error
    } finally {
      setLessonsLoading(false)
    }
  }

  const fetchRecentActivities = async (limit = 10) => {
    setActivitiesLoading(true)
    try {
      const response = await apiClient.getRecentActivities(limit)
      console.log('Activities response:', response) // Debug log
      
      // API client wraps response in { data: T }, so response.data is the actual API response
      const apiResponse = response.data
      
      // Convert object with numeric keys to array
      let activitiesArray = []
      if (apiResponse) {
        if (Array.isArray(apiResponse)) {
          activitiesArray = apiResponse
        } else if (typeof apiResponse === 'object') {
          activitiesArray = Object.values(apiResponse)
        }
      }
      
      console.log('Activities array:', activitiesArray)
      setActivities(activitiesArray)
    } catch (err) {
      console.error('Failed to fetch activities:', err)
      setActivities([]) // Set empty array on error
    } finally {
      setActivitiesLoading(false)
    }
  }

  const fetchTechStacks = async () => {
    setTechStacksLoading(true)
    try {
      const response = await apiClient.getTechStacks()
      const apiResponse = response.data
      const stacksArray =
        apiResponse && typeof apiResponse === 'object' && Array.isArray((apiResponse as { data?: TechStack[] }).data)
          ? (apiResponse as { data: TechStack[] }).data
          : Array.isArray(apiResponse)
            ? (apiResponse as TechStack[])
            : []
      setTechStacks(stacksArray)
    } catch (err) {
      console.error('Failed to fetch tech stacks:', err)
      setTechStacks([])
    } finally {
      setTechStacksLoading(false)
    }
  }

  const createUser = async (userData: { name: string; email: string; picture?: string }) => {
    try {
      await apiClient.createUser(userData)
      await fetchUsers() // Refresh users list
    } catch (err) {
      console.error('Failed to create user:', err)
      throw err
    }
  }

  const updateUser = async (userId: string, updates: any) => {
    try {
      await apiClient.updateUser(userId, updates)
      await fetchUsers() // Refresh users list
    } catch (err) {
      console.error('Failed to update user:', err)
      throw err
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      await apiClient.deleteUser(userId)
      await fetchUsers() // Refresh users list
    } catch (err) {
      console.error('Failed to delete user:', err)
      throw err
    }
  }

  const createLesson = async (lessonData: CreateLessonPayload) => {
    try {
      await apiClient.createLesson(lessonData)
      await fetchLessons() // Refresh lessons list
    } catch (err) {
      console.error('Failed to create lesson:', err)
      throw err
    }
  }

  const updateLesson = async (lessonId: string, updates: UpdateLessonPayload) => {
    try {
      await apiClient.updateLesson(lessonId, updates)
      await fetchLessons() // Refresh lessons list
    } catch (err) {
      console.error('Failed to update lesson:', err)
      throw err
    }
  }

  const deleteLesson = async (lessonId: string) => {
    try {
      await apiClient.deleteLesson(lessonId)
      await fetchLessons() // Refresh lessons list
    } catch (err) {
      console.error('Failed to delete lesson:', err)
      throw err
    }
  }

  // Load initial data
  useEffect(() => {
    if (hasLoadedInitialData.current) {
      return
    }

    hasLoadedInitialData.current = true
    console.log('AdminProvider: Loading initial data...')

    const loadData = async () => {
      try {
        await Promise.all([
          fetchDashboardStats(),
          fetchUsers(),
          fetchLessons(),
          fetchRecentActivities(),
          fetchTechStacks(),
        ])
        console.log('AdminProvider: All data loaded successfully')
      } catch (error) {
        console.error('AdminProvider: Error loading data:', error)
      }
    }
    
    loadData()
  }, []) // Empty dependency array to run only once

  const value: AdminContextType = {
    stats,
    loading,
    error,
    users,
    usersLoading,
    lessons,
    lessonsLoading,
    techStacks,
    techStacksLoading,
    activities,
    activitiesLoading,
    fetchDashboardStats,
    fetchUsers,
    fetchLessons,
    fetchTechStacks,
    fetchRecentActivities,
    createUser,
    updateUser,
    deleteUser,
    createLesson,
    updateLesson,
    deleteLesson,
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}
