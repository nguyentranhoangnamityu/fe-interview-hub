import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@fehub/ui'

import { TechStackLogo } from '../components/TechStackLogo'
import { useKnowledgeBase } from '../providers/KnowledgeBaseProvider'

const lessonStatusConfig: Record<
  'not_started' | 'in_progress' | 'completed',
  { label: string; className: string }
> = {
  not_started: {
    label: 'Chưa học',
    className: 'bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-200',
  },
  in_progress: {
    label: 'Đang học',
    className:
      'bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-200 dark:ring-1 dark:ring-sky-500/20',
  },
  completed: {
    label: 'Hoàn thành',
    className:
      'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200 dark:ring-1 dark:ring-emerald-500/20',
  },
}

const withAlpha = (hexColor: string, alpha: number) => {
  const sanitized = hexColor.replace('#', '')
  if (!/^[0-9a-fA-F]{3,6}$/.test(sanitized)) {
    return `rgba(79, 70, 229, ${alpha})`
  }

  const hex = sanitized.length === 3 ? sanitized.split('').map((c) => c + c).join('') : sanitized
  const value = Number.parseInt(hex, 16)
  const r = (value >> 16) & 255
  const g = (value >> 8) & 255
  const b = value & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const KnowledgeBaseExplorerStackPage = () => {
  const navigate = useNavigate()
  const { techStackId } = useParams<{ techStackId: string }>()
  const {
    techStacks,
    getLessonsByTechStack,
    getLessonProgress,
    fetchLessonsByTechStack,
  } = useKnowledgeBase()

  const stack = techStackId ? techStacks[techStackId] ?? null : null
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const stacksLoaded = useMemo(() => Object.keys(techStacks).length > 0, [techStacks])

  const lessons = useMemo(
    () => (techStackId ? getLessonsByTechStack(techStackId) : []),
    [techStackId, getLessonsByTechStack],
  )

  const loadLessons = useCallback(
    async ({ force }: { force?: boolean } = {}) => {
      if (!techStackId) {
        return
      }
      if (!force && getLessonsByTechStack(techStackId).length > 0) {
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
    [techStackId, fetchLessonsByTechStack, getLessonsByTechStack],
  )

  useEffect(() => {
    if (!techStackId) {
      return
    }
    void loadLessons()
  }, [techStackId, loadLessons])

  useEffect(() => {
    if (!techStackId || !stacksLoaded) {
      return
    }
    if (!stack) {
      navigate('/knowledge-base/explorer', { replace: true })
    }
  }, [stack, techStackId, stacksLoaded, navigate])

  const handleRetry = () => {
    void loadLessons({ force: true })
  }

  if (!techStackId) {
    return null
  }

  if (!stack) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50/50 px-4 py-8 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4 text-slate-600 dark:text-slate-300">
          <svg
            className="h-10 w-10 animate-spin text-indigo-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-9-9" />
          </svg>
          <p className="text-base font-medium">Đang tải thông tin tech stack...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 px-4 py-8 sm:px-6 lg:px-10 xl:px-12 dark:bg-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <header
          className="relative overflow-hidden rounded-3xl border border-indigo-100/60 bg-white/80 p-8 shadow-xl shadow-indigo-200/30 dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-none sm:p-10"
          style={{
            background: `linear-gradient(135deg, ${withAlpha(stack.color, 0.12)}, ${withAlpha(
              stack.color,
              0.02,
            )})`,
            borderColor: withAlpha(stack.color, 0.3),
          }}
        >
          <div className="absolute -left-16 top-1/2 hidden h-40 w-40 -translate-y-1/2 rounded-full bg-indigo-200/30 blur-2xl dark:bg-indigo-500/10 lg:block" />
          <div className="absolute -right-20 -top-10 hidden h-48 w-48 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-500/10 lg:block" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl space-y-4">
              <Button asChild variant="ghost" size="sm">
                <Link to="/knowledge-base/explorer" className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Quay lại Explorer
                </Link>
              </Button>
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/80 p-2 shadow-lg ring-1 ring-white/40 dark:bg-slate-900/80 dark:ring-slate-700/80">
                  <TechStackLogo
                    techStackId={stack.id}
                    name={stack.name}
                    fallback={stack.logo}
                    className="h-full w-full"
                  />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-300">
                    Tech Stack
                  </p>
                  <h1 className="mt-1 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl dark:text-white">
                    {stack.name}
                  </h1>
                </div>
              </div>
              <p className="text-base text-slate-600 sm:text-lg dark:text-slate-300">{stack.description}</p>
            </div>
            <div className="rounded-2xl bg-white/80 px-6 py-4 text-center shadow-lg shadow-indigo-200/40 dark:bg-slate-900/80 dark:shadow-none">
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-300">{lessons.length}</p>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-300">Bài học khả dụng</p>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none sm:p-8">
          {status === 'loading' && lessons.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-100/50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/50">
              <div className="mx-auto flex max-w-sm flex-col items-center gap-4 text-slate-600 dark:text-slate-300">
                <svg
                  className="h-10 w-10 animate-spin text-indigo-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-9-9" />
                </svg>
                <p className="text-base font-medium">Đang tải danh sách bài học...</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Vui lòng chờ trong giây lát.</p>
              </div>
            </div>
          ) : status === 'error' ? (
            <div className="rounded-2xl border border-dashed border-rose-300 bg-rose-50/70 p-8 text-center dark:border-rose-500/40 dark:bg-rose-500/10">
              <p className="text-base font-semibold text-rose-600 dark:text-rose-300">{error}</p>
              <Button onClick={handleRetry} variant="outline" className="mt-4">
                Thử lại
              </Button>
            </div>
          ) : lessons.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-100/50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/50">
              <p className="text-base font-medium text-slate-700 dark:text-slate-200">
                Chưa có bài học nào thuộc stack này. Hãy quay lại sau nhé!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 xl:grid-cols-2">
              {lessons.map((lesson) => {
                const { record, completionRate, totalSections } = getLessonProgress(lesson.id)
                const statusBadge = lessonStatusConfig[record?.status ?? 'not_started']

                return (
                  <article
                    key={lesson.id}
                    className="flex h-full flex-col rounded-2xl border border-slate-200/70 bg-white/90 p-6 transition-shadow hover:shadow-2xl hover:shadow-indigo-200/40 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:shadow-none"
                  >
                    <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{lesson.title}</h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{lesson.description}</p>
                      </div>
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusBadge.className}`}>
                        <span className="h-2 w-2 rounded-full bg-current" />
                        {statusBadge.label}
                      </span>
                    </header>

                    <div className="mt-6 flex flex-wrap gap-3 text-xs font-medium text-slate-500 dark:text-slate-300">
                      <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800/70">
                        Độ khó: {lesson.difficulty}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800/70">
                        {lesson.estimatedTime} phút học
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800/70">
                        {totalSections} mục nội dung
                      </span>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span>Tiến độ</span>
                        <span>{Math.round(completionRate * 100)}%</span>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-yellow-400 transition-all"
                          style={{ width: `${Math.round(completionRate * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button asChild variant="default">
                        <Link to={`/knowledge-base/${lesson.id}`}>Mở bài học</Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link to={`/knowledge-base/${lesson.id}/quiz`}>Làm quiz</Link>
                      </Button>
                      <Button asChild variant="secondary">
                        <Link to={`/knowledge-base/${lesson.id}/mock-interview`}>Mock Interview</Link>
                      </Button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
