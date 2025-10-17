import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import {
  type CreateLessonPayload,
  type Lesson,
  type LessonProgress,
  type LessonProgressStatus,
  type LessonQuizResult,
  type TechStack,
  type UpdateLessonPayload,
} from '@fehub/types'

import { apiClient } from '../lib/apiClient'
import { useAuth } from './AuthProvider'

const deepClone = <T,>(value: T): T =>
  typeof structuredClone === 'function'
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value)) as T

type BaseDataCache = {
  techStacks: Record<string, TechStack>
  lessons: Lesson[]
}

let baseDataCache: BaseDataCache | null = null
let baseDataPromise: Promise<BaseDataCache> | null = null

type UserDataCache = {
  progress: Record<string, LessonProgress>
  quizzes: Record<string, LessonQuizResult>
}

const userDataCache = new Map<string, UserDataCache>()
const userDataPromises = new Map<string, Promise<UserDataCache>>()

type KnowledgeBaseContextValue = {
  techStacks: Record<string, TechStack>
  lessons: Lesson[]
  getLesson: (lessonId: string) => Lesson | undefined
  getLessonsByTechStack: (techStackId: string) => Lesson[]
  createLesson: (lesson: CreateLessonPayload) => Promise<Lesson>
  updateLesson: (lessonId: string, updates: UpdateLessonPayload) => Promise<Lesson | undefined>
  deleteLesson: (lessonId: string) => Promise<void>
  progress: Record<string, LessonProgress>
  getLessonProgress: (
    lessonId: string,
  ) => { record: LessonProgress | null; completionRate: number; totalSections: number }
  toggleSectionCompletion: (lessonId: string, sectionId: string) => Promise<void>
  setLessonStatus: (lessonId: string, status: LessonProgressStatus) => Promise<void>
  quizResults: Record<string, LessonQuizResult>
  submitQuiz: (lessonId: string, answers: Record<string, string>) => Promise<LessonQuizResult | null>
  resetQuiz: (lessonId: string) => Promise<void>
  getQuizSummary: (
    lessonId: string,
  ) => {
    result: LessonQuizResult | null
    totalQuestions: number
    totalPoints: number
  }
}

const KnowledgeBaseContext = createContext<KnowledgeBaseContextValue | undefined>(undefined)

const defaultProgressRecord = (): LessonProgress => ({
  status: 'not_started',
  completedSectionIds: [],
  updatedAt: new Date().toISOString(),
})

export const KnowledgeBaseProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [techStacks, setTechStacks] = useState<Record<string, TechStack>>({})
  const [lessons, setLessons] = useState<Lesson[]>([])
  const lessonsRef = useRef(lessons)
  const [progress, setProgress] = useState<Record<string, LessonProgress>>({})
  const progressRef = useRef(progress)
  const [quizResults, setQuizResults] = useState<Record<string, LessonQuizResult>>({})
  const quizResultsRef = useRef(quizResults)
  const hasFetchedBaseData = useRef(false)
  const fetchedUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    lessonsRef.current = lessons
  }, [lessons])

  useEffect(() => {
    progressRef.current = progress
  }, [progress])

  useEffect(() => {
    quizResultsRef.current = quizResults
  }, [quizResults])

  useEffect(() => {
    let mounted = true

    const applyBaseData = (payload: BaseDataCache) => {
      setTechStacks(deepClone(payload.techStacks))
      setLessons(deepClone(payload.lessons))
      hasFetchedBaseData.current = true
    }

    if (hasFetchedBaseData.current && baseDataCache) {
      applyBaseData(baseDataCache)
      return () => {
        mounted = false
      }
    }

    const promise =
      baseDataPromise ??
      (baseDataPromise = (async () => {
        const [stacksRecord, lessonList] = await Promise.all([
          apiClient.getTechStacksRecord(),
          apiClient.listLessons(),
        ])
        return {
          techStacks: deepClone(stacksRecord),
          lessons: deepClone(lessonList),
        }
      })())

    const load = async () => {
      try {
        const payload = await promise
        baseDataCache = {
          techStacks: deepClone(payload.techStacks),
          lessons: deepClone(payload.lessons),
        }
        if (!mounted) {
          return
        }
        applyBaseData(payload)
      } catch (error) {
        if (baseDataPromise === promise) {
          baseDataPromise = null
        }
        console.error('Failed to bootstrap knowledge base', error)
      } finally {
        if (baseDataPromise === promise) {
          baseDataPromise = null
        }
      }
    }

    void load()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    let mounted = true

    if (!user) {
      setProgress({})
      setQuizResults({})
      fetchedUserIdRef.current = null
      return () => {
        mounted = false
      }
    }

    const cached = userDataCache.get(user.id)
    if (cached) {
      setProgress(deepClone(cached.progress))
      setQuizResults(deepClone(cached.quizzes))
      fetchedUserIdRef.current = user.id
      return () => {
        mounted = false
      }
    }

    const promise =
      userDataPromises.get(user.id) ??
      (() => {
        const request = (async () => {
          const [progressData, quizData] = await Promise.all([
            apiClient.listProgress(user.id),
            apiClient.listQuizResults(user.id),
          ])
          return {
            progress: deepClone(progressData),
            quizzes: deepClone(quizData),
          }
        })()
        userDataPromises.set(user.id, request)
        return request
      })()

    const loadUserData = async () => {
      try {
        const payload = await promise
        userDataCache.set(user.id, {
          progress: deepClone(payload.progress),
          quizzes: deepClone(payload.quizzes),
        })
        if (!mounted) {
          return
        }
        setProgress(deepClone(payload.progress))
        setQuizResults(deepClone(payload.quizzes))
        fetchedUserIdRef.current = user.id
      } catch (error) {
        if (userDataPromises.get(user.id) === promise) {
          userDataPromises.delete(user.id)
        }
        fetchedUserIdRef.current = null
        console.error('Failed to load user knowledge data', error)
      } finally {
        if (userDataPromises.get(user.id) === promise) {
          userDataPromises.delete(user.id)
        }
      }
    }

    void loadUserData()
    return () => {
      mounted = false
    }
  }, [user])

  const getLesson = useCallback((lessonId: string) => {
    return lessonsRef.current.find((lesson) => lesson.id === lessonId)
  }, [])

  const getLessonsByTechStack = useCallback((techStackId: string) => {
    return lessonsRef.current.filter((lesson) => lesson.techStack === techStackId)
  }, [])

  const createLesson = useCallback(async (lesson: CreateLessonPayload) => {
    const created = await apiClient.createLesson(lesson)
    setLessons((prev) => {
      const next = [...prev, created]
      if (baseDataCache) {
        baseDataCache = {
          techStacks: baseDataCache.techStacks,
          lessons: deepClone(next),
        }
      }
      return next
    })
    setTechStacks((prev) => {
      const stack = prev[created.techStack]
      if (!stack) {
        return prev
      }
      const lessonIds = stack.lessons.includes(created.id)
        ? stack.lessons
        : [...stack.lessons, created.id]
      const nextStacks = {
        ...prev,
        [created.techStack]: {
          ...stack,
          lessons: lessonIds,
        },
      }
      if (baseDataCache) {
        baseDataCache = {
          techStacks: deepClone(nextStacks),
          lessons: baseDataCache.lessons,
        }
      }
      return nextStacks
    })
    return created
  }, [])

  const updateLesson = useCallback(async (lessonId: string, updates: UpdateLessonPayload) => {
    try {
      const previousLesson = lessonsRef.current.find((lesson) => lesson.id === lessonId)
      const updated = await apiClient.updateLesson(lessonId, updates)
      if (!updated) {
        return undefined
      }
      setLessons((prev) => {
        const next = prev.map((lesson) => (lesson.id === lessonId ? { ...lesson, ...updated } : lesson))
        if (baseDataCache) {
          baseDataCache = {
            techStacks: baseDataCache.techStacks,
            lessons: deepClone(next),
          }
        }
        return next
      })
      if (previousLesson && previousLesson.techStack !== updated.techStack) {
        setTechStacks((prev) => {
          const nextStacks = { ...prev }
          const previousStack = nextStacks[previousLesson.techStack]
          if (previousStack) {
            nextStacks[previousLesson.techStack] = {
              ...previousStack,
              lessons: previousStack.lessons.filter((id) => id !== lessonId),
            }
          }
          const newStack = nextStacks[updated.techStack]
          if (newStack) {
            nextStacks[updated.techStack] = {
              ...newStack,
              lessons: newStack.lessons.includes(lessonId)
                ? newStack.lessons
                : [...newStack.lessons, lessonId],
            }
          }
          if (baseDataCache) {
            baseDataCache = {
              techStacks: deepClone(nextStacks),
              lessons: baseDataCache.lessons,
            }
          }
          return nextStacks
        })
      }
      return updated
    } catch (error) {
      console.error('Failed to update lesson', error)
      throw error
    }
  }, [])

  const deleteLesson = useCallback(
    async (lessonId: string) => {
      const lessonToDelete = lessonsRef.current.find((lesson) => lesson.id === lessonId)
      await apiClient.deleteLesson(lessonId)
      setLessons((prev) => {
        const next = prev.filter((lesson) => lesson.id !== lessonId)
        if (baseDataCache) {
          baseDataCache = {
            techStacks: baseDataCache.techStacks,
            lessons: deepClone(next),
          }
        }
        return next
      })
      if (lessonToDelete) {
        setTechStacks((prev) => {
          const stack = prev[lessonToDelete.techStack]
          if (!stack) {
            return prev
          }
          const nextStacks = {
            ...prev,
            [lessonToDelete.techStack]: {
              ...stack,
              lessons: stack.lessons.filter((id) => id !== lessonId),
            },
          }
          if (baseDataCache) {
            baseDataCache = {
              techStacks: deepClone(nextStacks),
              lessons: baseDataCache.lessons,
            }
          }
          return nextStacks
        })
      }
      if (user) {
        setProgress((prev) => {
          const next = { ...prev }
          delete next[lessonId]
          const entry = userDataCache.get(user.id)
          if (entry) {
            userDataCache.set(user.id, {
              progress: deepClone(next),
              quizzes: deepClone(entry.quizzes),
            })
          }
          return next
        })
        setQuizResults((prev) => {
          const next = { ...prev }
          delete next[lessonId]
          const entry = userDataCache.get(user.id)
          if (entry) {
            userDataCache.set(user.id, {
              progress: deepClone(entry.progress),
              quizzes: deepClone(next),
            })
          }
          return next
        })
      }
    },
    [user],
  )

  const updateProgressForUser = useCallback(
    async (lessonId: string, updater: (current: LessonProgress) => LessonProgress) => {
      if (!user) {
        console.warn('Progress tracking requires user to be logged in')
        return
      }

      const current = progressRef.current[lessonId] ?? defaultProgressRecord()
      const next = updater(current)
      const previous = progressRef.current[lessonId]

      setProgress((prev) => {
        const nextState = {
          ...prev,
          [lessonId]: next,
        }
        const cacheEntry =
          userDataCache.get(user.id) ?? {
            progress: {},
            quizzes: {},
          }
        userDataCache.set(user.id, {
          progress: deepClone(nextState),
          quizzes: deepClone(cacheEntry.quizzes),
        })
        return nextState
      })

      try {
        await apiClient.saveProgress(user.id, lessonId, next)
      } catch (error) {
        console.error('Failed to persist progress', error)
        setProgress((prev) => {
          if (!previous) {
            const restored = { ...prev }
            delete restored[lessonId]
            if (userDataCache.has(user.id)) {
              const entry = userDataCache.get(user.id)!
              userDataCache.set(user.id, {
                progress: deepClone(restored),
                quizzes: deepClone(entry.quizzes),
              })
            }
            return restored
          }
          const restored = {
            ...prev,
            [lessonId]: previous,
          }
          if (userDataCache.has(user.id)) {
            const entry = userDataCache.get(user.id)!
            userDataCache.set(user.id, {
              progress: deepClone(restored),
              quizzes: deepClone(entry.quizzes),
            })
          }
          return restored
        })
      }
    },
    [user],
  )

  const toggleSectionCompletion = useCallback(
    async (lessonId: string, sectionId: string) => {
      const lesson = getLesson(lessonId)
      if (!lesson || !user) {
        return
      }

      await updateProgressForUser(lessonId, (current) => {
        const completedSet = new Set(current.completedSectionIds)
        if (completedSet.has(sectionId)) {
          completedSet.delete(sectionId)
        } else {
          completedSet.add(sectionId)
        }

        const completed = Array.from(completedSet)
        const totalSections = lesson.sections.length
        let status: LessonProgressStatus = current.status

        if (totalSections === 0) {
          status = 'completed'
        } else if (completed.length === 0) {
          status = 'not_started'
        } else if (completed.length === totalSections) {
          status = 'completed'
        } else {
          status = 'in_progress'
        }

        return {
          status,
          completedSectionIds: completed,
          updatedAt: new Date().toISOString(),
        }
      })
    },
    [getLesson, updateProgressForUser, user],
  )

  const setLessonStatus = useCallback(
    async (lessonId: string, status: LessonProgressStatus) => {
      if (!user) {
        return
      }
      const lesson = getLesson(lessonId)
      if (!lesson) {
        return
      }

      await updateProgressForUser(lessonId, (current) => {
        let completedSectionIds = current.completedSectionIds

        if (status === 'completed') {
          completedSectionIds = lesson.sections.map((section) => section.id)
        } else if (status === 'not_started') {
          completedSectionIds = []
        }

        return {
          ...current,
          status,
          completedSectionIds,
          updatedAt: new Date().toISOString(),
        }
      })
    },
    [getLesson, updateProgressForUser, user],
  )

  const getLessonProgress = useCallback(
    (lessonId: string) => {
      const lesson = getLesson(lessonId)
      const record = progress[lessonId] ?? null
      const totalSections = lesson?.sections.length ?? 0
      const completed = record?.completedSectionIds.length ?? 0
      const completionRate = totalSections === 0 ? 0 : completed / totalSections

      return { record, completionRate, totalSections }
    },
    [getLesson, progress],
  )

  const submitQuiz = useCallback(
    async (lessonId: string, answers: Record<string, string>) => {
      if (!user) {
        console.warn('Quiz submission requires user to be logged in')
        return null
      }
      const lesson = getLesson(lessonId)
      if (!lesson || !lesson.quizzes || lesson.quizzes.length === 0) {
        return null
      }

      try {
        const result = await apiClient.submitQuiz(lessonId, { userId: user.id, answers })
        setQuizResults((prev) => {
          const nextState = {
            ...prev,
            [lessonId]: result,
          }
          const cacheEntry = userDataCache.get(user.id) ?? {
            progress: {},
            quizzes: {},
          }
          userDataCache.set(user.id, {
            progress: deepClone(cacheEntry.progress),
            quizzes: deepClone(nextState),
          })
          return nextState
        })
        return result
      } catch (error) {
        console.error('Failed to submit quiz', error)
        return null
      }
    },
    [getLesson, user],
  )

  const resetQuiz = useCallback(
    async (lessonId: string) => {
      if (!user) {
        return
      }
      const previous = quizResultsRef.current[lessonId]
      setQuizResults((prev) => {
        if (!prev[lessonId]) {
          return prev
        }
        const next = { ...prev }
        delete next[lessonId]
        if (userDataCache.has(user.id)) {
          const entry = userDataCache.get(user.id)!
          userDataCache.set(user.id, {
            progress: deepClone(entry.progress),
            quizzes: deepClone(next),
          })
        }
        return next
      })
      try {
        await apiClient.deleteQuizResult(user.id, lessonId)
      } catch (error) {
        console.error('Failed to reset quiz', error)
        if (previous) {
          setQuizResults((prev) => {
            const restored = {
              ...prev,
              [lessonId]: previous,
            }
            const entry = userDataCache.get(user.id)
            if (entry) {
              userDataCache.set(user.id, {
                progress: deepClone(entry.progress),
                quizzes: deepClone(restored),
              })
            }
            return restored
          })
        }
      }
    },
    [user],
  )

  const getQuizSummary = useCallback(
    (lessonId: string) => {
      const lesson = getLesson(lessonId)
      const totalQuestions = lesson?.quizzes?.length ?? 0
      const totalPoints = lesson?.quizzes?.reduce((sum, q) => sum + q.points, 0) ?? 0
      const result = quizResults[lessonId] ?? null
      return { result, totalQuestions, totalPoints }
    },
    [getLesson, quizResults],
  )

  const value = useMemo(
    () => ({
      techStacks,
      lessons,
      getLesson,
      getLessonsByTechStack,
      createLesson,
      updateLesson,
      deleteLesson,
      progress,
      getLessonProgress,
      toggleSectionCompletion,
      setLessonStatus,
      quizResults,
      submitQuiz,
      resetQuiz,
      getQuizSummary,
    }),
    [
      techStacks,
      lessons,
      getLesson,
      getLessonsByTechStack,
      createLesson,
      updateLesson,
      deleteLesson,
      progress,
      getLessonProgress,
      toggleSectionCompletion,
      setLessonStatus,
      quizResults,
      submitQuiz,
      resetQuiz,
      getQuizSummary,
    ],
  )

  return <KnowledgeBaseContext.Provider value={value}>{children}</KnowledgeBaseContext.Provider>
}

export const useKnowledgeBase = () => {
  const context = useContext(KnowledgeBaseContext)
  if (!context) {
    throw new Error('useKnowledgeBase must be used within a KnowledgeBaseProvider')
  }
  return context
}

export type { Lesson, LessonProgressStatus, TechStack } from '@fehub/types'
