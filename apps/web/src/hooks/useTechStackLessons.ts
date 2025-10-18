import { useCallback, useEffect, useMemo, useState } from 'react'

import { useKnowledgeBase } from '../providers/KnowledgeBaseProvider'

type LoadOptions = {
  force?: boolean
}

export const useTechStackLessons = (techStackId: string | undefined) => {
  const {
    techStacks,
    getLessonsByTechStack,
    fetchLessonsByTechStack,
  } = useKnowledgeBase()

  const lessons = useMemo(
    () => (techStackId ? getLessonsByTechStack(techStackId) : []),
    [getLessonsByTechStack, techStackId],
  )
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const stacksLoaded = useMemo(() => Object.keys(techStacks).length > 0, [techStacks])
  const stack = techStackId ? techStacks[techStackId] ?? null : null
  const isUnknownStack = Boolean(techStackId) && stacksLoaded && !stack

  const loadLessons = useCallback(
    async ({ force = false }: LoadOptions = {}) => {
      if (!techStackId) {
        return
      }
      if (!force && lessons.length > 0) {
        setStatus('idle')
        setError(null)
        return
      }
      setStatus('loading')
      setError(null)
      try {
        await fetchLessonsByTechStack(techStackId)
        setStatus('idle')
      } catch (err) {
        console.error('Failed to load lessons for tech stack', techStackId, err)
        setStatus('error')
        setError('Không thể tải bài học. Vui lòng thử lại.')
      }
    },
    [fetchLessonsByTechStack, lessons.length, techStackId],
  )

  useEffect(() => {
    if (!techStackId) {
      return
    }
    void loadLessons()
  }, [loadLessons, techStackId])

  return {
    stack,
    lessons,
    status,
    error,
    stacksLoaded,
    isUnknownStack,
    retry: () => void loadLessons({ force: true }),
  }
}

