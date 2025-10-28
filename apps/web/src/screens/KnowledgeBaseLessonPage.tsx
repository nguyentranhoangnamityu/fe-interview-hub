import { useEffect, useMemo } from 'react'
import { Button } from '@fehub/ui'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { useAuth } from '../providers/AuthProvider'
import {
  type Lesson,
  type LessonProgressStatus,
  useKnowledgeBase,
} from '../providers/KnowledgeBaseProvider'

const difficultyBadge: Record<string, string> = {
  'Cơ bản': 'bg-rose-500/80 text-white dark:bg-rose-400/40',
  'Trung bình': 'bg-amber-500/80 text-white dark:bg-amber-400/40',
  'Nâng cao': 'bg-indigo-500/80 text-white dark:bg-indigo-400/40',
}

const progressStatusMeta: Record<
  LessonProgressStatus,
  { label: string; helper: string; className: string; icon: string }
> = {
  completed: {
    label: 'Hoàn thành',
    helper: 'Bạn đã hoàn thiện toàn bộ mục trong bài học.',
    icon: '✓',
    className:
      'bg-gradient-to-r from-emerald-500/15 to-emerald-400/25 text-emerald-600 dark:from-emerald-400/20 dark:to-emerald-500/20 dark:text-emerald-200',
  },
  in_progress: {
    label: 'Đang học',
    helper: 'Tiếp tục đánh dấu các mục đã đọc để hoàn tất.',
    icon: '⏳',
    className:
      'bg-gradient-to-r from-sky-500/15 via-indigo-500/15 to-indigo-500/20 text-sky-600 dark:from-sky-500/20 dark:via-indigo-500/20 dark:to-indigo-500/25 dark:text-sky-200',
  },
  not_started: {
    label: 'Chưa học',
    helper: 'Bắt đầu đọc các mục bên dưới và đánh dấu hoàn thành.',
    icon: '→',
    className:
      'border border-slate-200/60 bg-white text-slate-600 dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-200',
  },
}

const formatMinutes = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes} phút`
  }
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest === 0 ? `${hours} giờ` : `${hours} giờ ${rest} phút`
}

const renderSectionBody = (section: Lesson['sections'][number]['body']) =>
  section.map((block, index) => {
    if (block.type === 'paragraph') {
      return (
        <p key={`paragraph-${index}`} className="mb-4 leading-7 text-slate-700 dark:text-slate-200">
          {block.text}
        </p>
      )
    }

    if (block.type === 'list') {
      return (
        <ul
          key={`list-${index}`}
          className="mb-6 list-disc space-y-3 pl-8 leading-7 text-slate-700 marker:text-indigo-500 dark:text-slate-200"
        >
          {block.items.map((item, itemIndex) => (
            <li key={`${itemIndex}-${item}`} className="leading-7 pl-2">{item}</li>
          ))}
        </ul>
      )
    }

    if (block.type === 'code' && !block.snippet.includes('Hình ảnh')) {
      return (
        <div key={`code-${index}`} className="my-6">
          <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm leading-relaxed text-slate-100 shadow-lg">
            <code className="font-mono">{block.snippet}</code>
          </pre>
        </div>
      )
    }

    if (block.type === 'image') {
      const imageBlock = block as Extract<typeof block, { type: 'image' }>
      return (
        <div key={`image-${index}`} className="my-4 flex justify-center">
          <div className="w-full overflow-hidden rounded-xl border border-indigo-200/70 shadow-lg dark:border-slate-700">
            <img
              src={imageBlock.url}
              alt={imageBlock.alt}
              className="max-h-[300px] w-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+'
                target.classList.add('opacity-50')
              }}
            />
          </div>
        </div>
      )
    }

    return null
  })

export const KnowledgeBaseLessonPage = () => {
  const { lessonId = '' } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    getLesson,
    getLessonProgress,
    toggleSectionCompletion,
    setLessonStatus,
  } = useKnowledgeBase()

  const lesson = useMemo(() => (lessonId ? getLesson(lessonId) : undefined), [getLesson, lessonId])

  useEffect(() => {
    if (!lesson && lessonId) {
      // Điều hướng về trang danh sách nếu không tìm thấy bài học
      navigate('/knowledge-base', { replace: true })
    }
  }, [lesson, lessonId, navigate])

  if (!lesson) {
    return null
  }


  const progressSummary = getLessonProgress(lesson.id)
  const { record } = progressSummary
  const completionPercent = Math.round(progressSummary.completionRate * 100)
  const currentStatus = record?.status ?? 'not_started'

  const handleToggleSection = (sectionId: string) => {
    if (!user) {
      return
    }
    void toggleSectionCompletion(lesson.id, sectionId)
  }

  const handleStatusChange = (status: LessonProgressStatus) => {
    if (!user) {
      return
    }
    void setLessonStatus(lesson.id, status)
  }

  const statusOptions: LessonProgressStatus[] = ['not_started', 'in_progress', 'completed']

  const statusMeta = progressStatusMeta[currentStatus]

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#eef2ff] text-slate-900 dark:bg-background dark:text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-[-12rem] h-[26rem] w-[26rem] rounded-full bg-indigo-300/40 blur-3xl dark:bg-indigo-600/20" />
        <div className="absolute -right-24 bottom-[-10rem] h-[28rem] w-[28rem] rounded-full bg-sky-200/45 blur-3xl dark:bg-sky-500/25" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.75),_transparent_58%)] dark:bg-none" />
      </div>
      <div className="relative">
        <div className="relative flex w-full flex-col gap-12 px-6 sm:px-10 xl:px-16 py-10 lg:flex-row lg:items-start lg:gap-16 lg:py-14">
          {/* Sidebar */}
          <aside className="flex w-full flex-col gap-6 lg:w-[360px] xl:w-[400px]">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Button asChild variant="outline" size="sm">
                  <Link to="/knowledge-base">← Quay lại</Link>
                </Button>
                <Button asChild variant="secondary" size="sm">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              </div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-indigo-500">
                Bài học
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white lg:text-3xl">
                {lesson.title}
              </h1>
              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {lesson.description}
              </p>
            </div>

            {/* Lesson Info Card */}
            <div className="rounded-3xl border border-indigo-200/70 bg-white/85 p-6 shadow-xl shadow-indigo-200/30 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
              <div className="space-y-4">
                {lesson.coverImage ? (
                  <div className="overflow-hidden rounded-2xl border border-indigo-200/60 bg-slate-100 shadow-inner shadow-indigo-100/40 dark:border-slate-700">
                    <img
                      alt={lesson.coverImage.alt}
                      className="h-32 w-full object-cover"
                      src={lesson.coverImage.url}
                    />
                  </div>
                ) : null}
                
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                      difficultyBadge[lesson.difficulty] ?? 'bg-indigo-500/70 text-white'
                    }`}
                  >
                    {lesson.difficulty}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                    ⏱ {formatMinutes(lesson.estimatedTime)}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {lesson.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-indigo-100/80 px-3 py-1 text-xs font-medium uppercase tracking-wide text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress Card */}
            <div
              className={`rounded-3xl border bg-white/85 p-6 shadow-xl shadow-indigo-200/30 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none ${statusMeta.className}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{statusMeta.icon}</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-500 dark:text-indigo-200">
                    Tiến độ
                  </p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {statusMeta.label} — {completionPercent}%
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{statusMeta.helper}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <Button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    size="sm"
                    variant={status === currentStatus ? 'default' : 'outline'}
                  >
                    {progressStatusMeta[status].icon} {progressStatusMeta[status].label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Resources */}
            {lesson.resources && lesson.resources.length > 0 ? (
              <div className="rounded-3xl border border-indigo-200/70 bg-white/85 p-6 shadow-xl shadow-indigo-200/30 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-500 dark:text-indigo-200">
                  Tài nguyên tham khảo
                </p>
                <ul className="mt-4 space-y-3 text-sm">
                  {lesson.resources.map((resource) => (
                    <li key={resource.url}>
                      <a
                        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 hover:underline dark:text-indigo-300"
                        href={resource.url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        ↗ {resource.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Quiz Link */}
            {lesson.quizzes && lesson.quizzes.length > 0 ? (
              <div className="rounded-3xl border border-indigo-200/70 bg-white/85 p-6 shadow-xl shadow-indigo-200/30 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
                <Link
                  to={`/knowledge-base/${lesson.id}/quiz`}
                  className="group flex items-center gap-3 rounded-2xl border border-transparent bg-indigo-50/80 p-4 text-sm transition hover:border-indigo-300 hover:bg-indigo-100/80 dark:bg-indigo-500/10 dark:hover:border-indigo-500 dark:hover:bg-indigo-500/20"
                >
                  <div className="rounded-full bg-indigo-500/10 p-2 group-hover:bg-indigo-500/20">
                    <span className="text-lg">🧠</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      Quiz ôn tập
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {lesson.quizzes.length} câu hỏi trắc nghiệm
                    </p>
                  </div>
                  <span className="text-indigo-500 group-hover:text-indigo-600">→</span>
                </Link>
              </div>
            ) : null}

            {/* Mock Interview Link */}
            {lesson.mockPrompts && lesson.mockPrompts.length > 0 ? (
              <div className="rounded-3xl border border-indigo-200/70 bg-white/85 p-6 shadow-xl shadow-indigo-200/30 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
                <Link
                  to={`/knowledge-base/${lesson.id}/mock-interview`}
                  className="group flex items-center gap-3 rounded-2xl border border-transparent bg-indigo-50/80 p-4 text-sm transition hover:border-indigo-300 hover:bg-indigo-100/80 dark:bg-indigo-500/10 dark:hover:border-indigo-500 dark:hover:bg-indigo-500/20"
                >
                  <div className="rounded-full bg-indigo-500/10 p-2 group-hover:bg-indigo-500/20">
                    <span className="text-lg">💼</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      Mock Interview
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Phỏng vấn với AI
                    </p>
                  </div>
                  <span className="text-indigo-500 group-hover:text-indigo-600">→</span>
                </Link>
              </div>
            ) : null}

          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-8 lg:pl-6 xl:pl-10">
            <article className="space-y-6">
              {lesson.sections.map((section) => {
                const isCompleted = record?.completedSectionIds.includes(section.id) ?? false
                return (
                  <section
                    key={section.id}
                    className="rounded-3xl border border-indigo-200/70 bg-white/90 p-6 shadow-xl shadow-indigo-200/30 dark:border-slate-800 dark:bg-slate-900/70"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                          {section.title}
                        </h2>
                        <p className="text-xs uppercase tracking-[0.25em] text-indigo-400">
                          Mục kiến thức
                        </p>
                      </div>
                      <label className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-300">
                        <input
                          checked={isCompleted}
                          className="h-4 w-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600"
                          onChange={() => handleToggleSection(section.id)}
                          type="checkbox"
                        />
                        Đã hoàn thành
                      </label>
                    </div>
                    <div className="mt-6 space-y-6 text-base leading-relaxed">
                      {renderSectionBody(section.body)}
                    </div>
                  </section>
                )
              })}

            </article>
          </main>
        </div>

        <footer className="border-t border-indigo-200/60 bg-white/80 py-10 text-center text-sm text-slate-500 backdrop-blur dark:border-slate-800 dark:bg-background/70 dark:text-slate-400">
          <p>
            Nội dung được biên tập từ các buổi mock interview. Hãy quay lại thường xuyên để xem thêm bài
            học mới.
          </p>
        </footer>
      </div>
    </div>
  )
}
