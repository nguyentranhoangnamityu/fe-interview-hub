import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { Button } from '@fehub/ui'
import { Link } from 'react-router-dom'

import { useAuth } from '../providers/AuthProvider'
import { useKnowledgeBase, type Lesson, type TechStack } from '../providers/KnowledgeBaseProvider'

type LessonStatusKey = 'completed' | 'in_progress' | 'not_started'

const statusStyles: Record<LessonStatusKey, { label: string; className: string; icon?: string }> = {
  completed: {
    label: 'Hoàn thành',
    icon: '✓',
    className:
      'bg-gradient-to-r from-emerald-500/15 to-emerald-400/25 text-emerald-600 dark:from-emerald-400/20 dark:to-emerald-500/20 dark:text-emerald-200',
  },
  in_progress: {
    label: 'Đang học',
    icon: '⏳',
    className:
      'bg-gradient-to-r from-sky-500/15 via-indigo-500/15 to-indigo-500/20 text-sky-600 dark:from-sky-500/20 dark:via-indigo-500/20 dark:to-indigo-500/25 dark:text-sky-200',
  },
  not_started: {
    label: 'Chưa học',
    icon: '→',
    className:
      'border border-slate-200/60 bg-slate-50 text-slate-600 dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-200',
  },
}

const progressFillStyles: Record<LessonStatusKey, string> = {
  completed: 'bg-gradient-to-r from-emerald-400 to-lime-400 dark:from-emerald-400 dark:to-lime-400',
  in_progress: 'bg-gradient-to-r from-sky-500 via-indigo-500 to-indigo-600',
  not_started: 'bg-slate-300 dark:bg-slate-600',
}

const formatMinutes = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes} phút`
  }
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest === 0 ? `${hours} giờ` : `${hours} giờ ${rest} phút`
}

const difficultyBadge: Record<string, string> = {
  'Cơ bản': 'bg-rose-500/80 text-white dark:bg-rose-400/40',
  'Trung bình': 'bg-amber-500/80 text-white dark:bg-amber-400/40',
  'Nâng cao': 'bg-indigo-500/80 text-white dark:bg-indigo-400/40',
}

const cardGradientByDifficulty: Record<string, string> = {
  'Cơ bản': 'from-rose-200/45 via-rose-100/40 to-slate-100/40',
  'Trung bình': 'from-amber-200/40 via-amber-100/40 to-slate-100/40',
  'Nâng cao': 'from-indigo-200/45 via-sky-200/40 to-slate-100/40',
}

const getCardGradient = (difficulty: string) =>
  cardGradientByDifficulty[difficulty] ?? 'from-indigo-200/40 via-sky-200/35 to-violet-200/35'

const normalize = (value: string) => value.toLowerCase().normalize('NFKD')

const slugFrom = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `section-${Date.now()}`

type ContentBlock = Lesson['sections'][number]['body'][number]

const buildBodyFromContent = (content: string): ContentBlock[] => {
  const lines = content.split('\n').map((line) => line.trim())
  const blocks: ContentBlock[] = []
  let listBuffer: string[] = []

  const flushList = () => {
    if (listBuffer.length > 0) {
      blocks.push({
        type: 'list',
        items: [...listBuffer],
      })
      listBuffer = []
    }
  }

  lines.forEach((line) => {
    if (!line) {
      flushList()
      return
    }

    if (line.startsWith('- ')) {
      listBuffer.push(line.slice(2).trim())
      return
    }

    flushList()
    blocks.push({
      type: 'paragraph',
      text: line,
    })
  })

  flushList()

  return blocks
}

// Ảnh dự phòng theo tech stack để đảm bảo luôn có ảnh phù hợp với nội dung
const fallbackCovers: Record<string, string> = {
  js: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop',
  ts: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1600&auto=format&fit=crop',
  react: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1600&auto=format&fit=crop',
  vue: 'https://images.unsplash.com/photo-1515871204537-9d3b16d3c5d0?q=80&w=1600&auto=format&fit=crop',
  node: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop',
  css: 'https://images.unsplash.com/photo-1505685296765-3a2736de412f?q=80&w=1600&auto=format&fit=crop',
  html: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop',
}

const defaultCover = 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1600&auto=format&fit=crop'

type LessonFormState = {
  title: string
  description: string
  difficulty: string
  estimatedTime: string
  techStack: string
  tags: string
  sectionTitle: string
  content: string
  coverUrl: string
  coverAlt: string
}

const defaultLessonForm = (): LessonFormState => ({
  title: '',
  description: '',
  difficulty: 'Trung bình',
  estimatedTime: '30',
  techStack: 'js',
  tags: '',
  sectionTitle: 'Ghi chú tổng quan',
  content: '',
  coverUrl: '',
  coverAlt: '',
})

const matchesFilters = (
  lesson: Lesson,
  searchTerm: string,
  difficulty: string | null,
  techStack: string | null,
  activeTags: string[],
) => {
  const textSearch =
    !searchTerm ||
    normalize(lesson.title).includes(searchTerm) ||
    normalize(lesson.description).includes(searchTerm) ||
    lesson.tags.some((tag) => normalize(tag).includes(searchTerm))

  const difficultyMatch = !difficulty || lesson.difficulty === difficulty
  const techStackMatch = !techStack || lesson.techStack === techStack

  const tagMatch =
    activeTags.length === 0 ||
    activeTags.every((tag) => lesson.tags.map((item) => item.toLowerCase()).includes(tag))

  return textSearch && difficultyMatch && techStackMatch && tagMatch
}

export const KnowledgeBasePage = () => {
  const {
    techStacks,
    lessons,
    getLessonProgress,
    getLessonsByTechStack,
    createLesson,
    updateLesson,
    deleteLesson,
  } = useKnowledgeBase()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [selectedTechStack, setSelectedTechStack] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const customLessons = useMemo(
    () => lessons.filter((lesson) => lesson.origin !== 'seed'),
    [lessons],
  )
  const [selectedLessonId, setSelectedLessonId] = useState<'new' | string>('new')
  const [formState, setFormState] = useState<LessonFormState>(() => defaultLessonForm())
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error' | 'deleted'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (selectedLessonId === 'new') {
      setFormState(defaultLessonForm())
      return
    }

    const lesson = lessons.find((item) => item.id === selectedLessonId)
    if (!lesson) {
      setFormState(defaultLessonForm())
      return
    }

    const firstSection = lesson.sections[0]
    const lines: string[] = []
    if (firstSection) {
      firstSection.body.forEach((block) => {
        if (block.type === 'paragraph') {
          lines.push(block.text)
        } else if (block.type === 'list') {
          block.items.forEach((item) => lines.push(`- ${item}`))
        } else if (block.type === 'code') {
          lines.push(block.snippet)
        }
      })
    }

    setFormState({
      title: lesson.title,
      description: lesson.description,
      difficulty: lesson.difficulty,
      estimatedTime: String(lesson.estimatedTime),
      techStack: lesson.techStack,
      tags: lesson.tags.join(', '),
      sectionTitle: firstSection?.title ?? 'Ghi chú tổng quan',
      content: lines.join('\n'),
      coverUrl: lesson.coverImage?.url ?? '',
      coverAlt: lesson.coverImage?.alt ?? '',
    })
  }, [lessons, selectedLessonId])

  useEffect(() => {
    if (saveStatus === 'idle') {
      return
    }
    const timeout = window.setTimeout(() => {
      setSaveStatus('idle')
      setErrorMessage(null)
    }, 2500)
    return () => window.clearTimeout(timeout)
  }, [saveStatus])

  const normalizedSearch = normalize(searchTerm)

  const difficulties = useMemo(
    () => Array.from(new Set(lessons.map((lesson) => lesson.difficulty))),
    [lessons],
  )

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    lessons.forEach((lesson) => {
      lesson.tags.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet)
  }, [lessons])

  const filteredLessons = useMemo(
    () =>
      lessons
        .filter((lesson) =>
          matchesFilters(
            lesson,
            normalizedSearch,
            selectedDifficulty,
            selectedTechStack,
            selectedTags.map((item) => item.toLowerCase()),
          ),
        )
        .sort((a, b) => a.title.localeCompare(b.title)),
    [lessons, normalizedSearch, selectedDifficulty, selectedTechStack, selectedTags],
  )

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    )
  }

  const handleInputChange =
    (field: keyof LessonFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.value
      setFormState((prev) => ({
        ...prev,
        [field]: value,
      }))
    }

  const handleSaveLesson = async () => {
    if (!formState.title.trim() || !formState.description.trim()) {
      setErrorMessage('Vui lòng nhập tiêu đề và mô tả.')
      setSaveStatus('error')
      return
    }

    const estimatedMinutes = Number.parseInt(formState.estimatedTime, 10)
    if (Number.isNaN(estimatedMinutes) || estimatedMinutes <= 0) {
      setErrorMessage('Thời lượng ước tính phải là số phút hợp lệ.')
      setSaveStatus('error')
      return
    }

    const tags = formState.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

    const sectionBody = buildBodyFromContent(formState.content)
    const sectionTitle = formState.sectionTitle.trim() || 'Ghi chú tổng quan'

    if (sectionBody.length === 0) {
      sectionBody.push({
        type: 'paragraph',
        text: 'Đang cập nhật nội dung...',
      })
    }

    const coverUrl = formState.coverUrl.trim()
    const coverImage = coverUrl
      ? {
          url: coverUrl,
          alt: formState.coverAlt.trim() || formState.title.trim(),
        }
      : undefined
    try {
      if (selectedLessonId === 'new') {
        const newLesson = await createLesson({
          title: formState.title.trim(),
          description: formState.description.trim(),
          difficulty: formState.difficulty,
          estimatedTime: estimatedMinutes,
          techStack: formState.techStack,
          tags,
          sections: [
            {
              id: `${slugFrom(formState.sectionTitle || formState.title)}-section`,
              title: sectionTitle,
              body: sectionBody,
            },
          ],
          resources: [],
          coverImage,
        })
        setSelectedLessonId(newLesson.id)
      } else {
        await updateLesson(selectedLessonId, {
          title: formState.title.trim(),
          description: formState.description.trim(),
          difficulty: formState.difficulty,
          estimatedTime: estimatedMinutes,
          techStack: formState.techStack,
          tags,
          sections: [
            {
              id: `${selectedLessonId}-section`,
              title: sectionTitle,
              body: sectionBody,
            },
          ],
          coverImage,
        })
      }
      setErrorMessage(null)
      setSaveStatus('success')
    } catch (error) {
      console.error('Failed to save lesson', error)
      setSaveStatus('error')
      setErrorMessage('Không thể lưu bài học. Vui lòng thử lại.')
    }
  }

  const handleDeleteLesson = async () => {
    if (selectedLessonId === 'new') {
      return
    }
    try {
      await deleteLesson(selectedLessonId)
      setSelectedLessonId('new')
      setFormState(defaultLessonForm())
      setErrorMessage(null)
      setSaveStatus('deleted')
    } catch (error) {
      console.error('Failed to delete lesson', error)
      setSaveStatus('error')
      setErrorMessage('Không thể xoá bài học. Vui lòng thử lại.')
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#eef2ff] text-slate-900 dark:bg-background dark:text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-[-12rem] h-[26rem] w-[26rem] rounded-full bg-indigo-300/40 blur-3xl dark:bg-indigo-600/20" />
        <div className="absolute -right-24 bottom-[-10rem] h-[28rem] w-[28rem] rounded-full bg-sky-200/45 blur-3xl dark:bg-sky-500/25" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.75),_transparent_58%)] dark:bg-none" />
      </div>
      <div className="relative">
        <div className="relative flex w-full flex-col gap-2 sm:gap-2 md:gap-6 px-3 sm:px-6 md:px-10 xl:px-16 py-6 sm:py-8 md:py-10 lg:flex-row lg:items-start lg:gap-6 lg:py-14">
          <aside className="flex w-full flex-col gap-6 lg:w-[360px] xl:w-[400px]">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Button asChild variant="outline" size="sm">
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <span>←</span>
                    Dashboard
                  </Link>
                </Button>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-indigo-500">
                  Knowledge Base
                </p>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white lg:text-4xl">
                Thư viện luyện thi phỏng vấn frontend
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Đọc miễn phí ghi chú JavaScript chất lượng cao. Đăng nhập để đồng bộ tiến độ và quản lý
                lộ trình luyện phỏng vấn của bạn.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3">
              {user ? (
                <div className="w-full rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Xin chào, {user.name.split(' ')[0]} 👋
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">
                    Tiếp tục hành trình học tập của bạn nhé.
                  </p>
                </div>
              ) : (
                <div className="w-full space-y-3 text-sm">
                  <p className="text-slate-600 dark:text-slate-300">
                    Đăng nhập để lưu tiến độ học và hiển thị thống kê trên dashboard.
                  </p>
                  <Button asChild variant="default">
                    <Link to="/login">Đăng nhập</Link>
                  </Button>
                </div>
              )}
            </div>
            <div className="rounded-2xl sm:rounded-3xl border border-indigo-200/70 bg-white/85 p-4 sm:p-6 shadow-xl shadow-indigo-200/30 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
              <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                Tìm kiếm
              </label>
              <div className="relative mt-3">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  🔍
                </span>
                <input
                  className="h-10 sm:h-11 w-full rounded-full border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-600/30"
                  placeholder="Tìm bài theo từ khoá, tag..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                  Tech Stack
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition ${
                      !selectedTechStack
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:border-indigo-400 dark:bg-indigo-500/10 dark:text-indigo-300'
                        : 'border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-400 dark:hover:text-indigo-300'
                    }`}
                    onClick={() => setSelectedTechStack(null)}
                    type="button"
                  >
                    <span>🔧</span>
                    Tất cả
                  </button>
                  {Object.values(techStacks).map((techStack) => (
                    <button
                      key={techStack.id}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition ${
                        selectedTechStack === techStack.id
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:border-indigo-400 dark:bg-indigo-500/10 dark:text-indigo-300'
                          : 'border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-400 dark:hover:text-indigo-300'
                      }`}
                      onClick={() =>
                        setSelectedTechStack(
                          selectedTechStack === techStack.id ? null : techStack.id,
                        )
                      }
                      type="button"
                    >
                      <span>{techStack.logo}</span>
                      {techStack.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                  Độ khó
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      !selectedDifficulty
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:border-indigo-400 dark:bg-indigo-500/10 dark:text-indigo-300'
                        : 'border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-400 dark:hover:text-indigo-300'
                    }`}
                    onClick={() => setSelectedDifficulty(null)}
                    type="button"
                  >
                    Tất cả
                  </button>
                  {difficulties.map((difficulty) => (
                    <button
                      key={difficulty}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        selectedDifficulty === difficulty
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:border-indigo-400 dark:bg-indigo-500/10 dark:text-indigo-300'
                          : 'border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-400 dark:hover:text-indigo-300'
                      }`}
                      onClick={() =>
                        setSelectedDifficulty(
                          selectedDifficulty === difficulty ? null : difficulty,
                        )
                      }
                      type="button"
                    >
                      {difficulty}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                  Tag
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {allTags.map((tag) => {
                    const active = selectedTags.includes(tag)
                    return (
                      <button
                        key={tag}
                        className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-wide transition ${
                          active
                            ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900'
                            : 'border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white'
                        }`}
                        onClick={() => handleTagToggle(tag)}
                        type="button"
                      >
                        #{tag}
                      </button>
                    )
                  })}
                </div>
              </div>
              {selectedTechStack || selectedDifficulty || selectedTags.length > 0 ? (
                <div className="mt-6 space-y-3 rounded-2xl border border-indigo-200/60 bg-indigo-50/70 p-4 text-xs text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-200">
                  <p className="font-semibold uppercase tracking-[0.3em]">Đang lọc</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTechStack ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100">
                        <span>{techStacks[selectedTechStack]?.logo}</span>
                        {techStacks[selectedTechStack]?.name}
                        <button
                          className="text-[10px] uppercase tracking-[0.2em]"
                          onClick={() => setSelectedTechStack(null)}
                          type="button"
                        >
                          ✕
                        </button>
                      </span>
                    ) : null}
                    {selectedDifficulty ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100">
                        {selectedDifficulty}
                        <button
                          className="text-[10px] uppercase tracking-[0.2em]"
                          onClick={() => setSelectedDifficulty(null)}
                          type="button"
                        >
                          ✕
                        </button>
                      </span>
                    ) : null}
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100"
                      >
                        #{tag}
                        <button
                          className="text-[10px] uppercase tracking-[0.2em]"
                          onClick={() => handleTagToggle(tag)}
                          type="button"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </aside>
          <main className="flex-1 space-y-6 sm:space-y-8 md:space-y-12 lg:pl-6 xl:pl-10">
            <div>
              {filteredLessons.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                    Không tìm thấy bài học phù hợp
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Hãy thử thay đổi từ khoá hoặc xoá bộ lọc để xem thêm nội dung.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4 sm:gap-6">
                  {filteredLessons.map((lesson) => {
                    const { record, completionRate } = getLessonProgress(lesson.id)
                    const percent = Math.round(completionRate * 100)
                    const status: LessonStatusKey = record?.status ?? 'not_started'
                    const chip = statusStyles[status]
                    const safePercent = Math.min(100, Math.max(0, percent))
                    return (
                      <Link
                        key={lesson.id}
                        className="group relative flex w-full flex-col gap-2 sm:gap-3 overflow-hidden rounded-2xl sm:rounded-[32px] border border-transparent bg-white/90 p-2.5 sm:p-3 md:p-4 shadow-xl shadow-indigo-100/40 transition hover:-translate-y-0.5 hover:shadow-indigo-300/40 sm:flex-row sm:gap-4 dark:bg-slate-900/70 dark:shadow-none dark:hover:border-indigo-500/40"
                        to={`/knowledge-base/${lesson.id}`}
                      >
                        <div
                          className={`relative aspect-[16/9] w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br sm:aspect-[4/5] sm:w-44 sm:flex-shrink-0 ${getCardGradient(lesson.difficulty)} dark:from-indigo-500/20 dark:via-sky-500/20 dark:to-violet-500/20`}
                        >
                          <img
                            alt={lesson.coverImage?.alt || lesson.title}
                            className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 ease-out group-hover:scale-[1.05]"
                            loading="lazy"
                            decoding="async"
                            onError={(event) => {
                              const tech = lesson.techStack as string
                              const fallback = (fallbackCovers as Record<string, string>)[tech] || defaultCover
                              if (event.currentTarget.src !== fallback) {
                                event.currentTarget.src = fallback
                              }
                            }}
                            src={lesson.coverImage?.url || (fallbackCovers as Record<string, string>)[lesson.techStack] || defaultCover}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent dark:from-slate-950/70 rounded-2xl sm:rounded-3xl" />
                          <span
                            className={`absolute left-3 sm:left-4 top-3 sm:top-4 inline-flex rounded-full px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md shadow-lg ${difficultyBadge[lesson.difficulty] ?? 'bg-white/30 text-slate-900'}`}
                          >
                            {lesson.difficulty}
                          </span>
                        </div>
                        <div className="flex flex-1 flex-col gap-2 sm:gap-3 justify-between">
                          <div className="space-y-2 sm:space-y-3">
                            <h2 className="text-base sm:text-lg font-semibold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-200 md:text-xl">
                              {lesson.title}
                            </h2>
                            <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2">
                              {lesson.description}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 sm:gap-3">
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800 sm:px-3">
                              <span>{techStacks[lesson.techStack]?.logo}</span>
                              <span className="hidden sm:inline">{techStacks[lesson.techStack]?.name}</span>
                            </span>
                            <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800 sm:px-3">
                              {lesson.sections.length} mục
                            </span>
                            <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800 sm:px-3">
                              {formatMinutes(lesson.estimatedTime)}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {lesson.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-indigo-100/80 px-2 py-1 text-xs font-medium uppercase tracking-wide text-indigo-600 transition group-hover:bg-indigo-500/15 dark:bg-indigo-500/10 dark:text-indigo-200 sm:px-3"
                              >
                                #{tag}
                              </span>
                            ))}
                            {lesson.tags.length > 3 && (
                              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300 sm:px-3">
                                +{lesson.tags.length - 3}
                              </span>
                            )}
                          </div>
                          <div className="flex w-full items-center justify-between gap-3 border-t border-slate-200/70 pt-3 dark:border-slate-800/70">
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium ${chip.className}`}>
                                <span>{chip.icon}</span>
                                <span>{chip.label}</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                {user ? `${safePercent}%` : 'Chưa đăng nhập'}
                              </span>
                              <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden dark:bg-slate-700">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${user ? progressFillStyles[status] : 'bg-slate-300 dark:bg-slate-600'}`}
                                  style={{ width: user ? `${safePercent}%` : '0%' }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
        {/* {user ? (
          <section className="mt-12 rounded-3xl border border-indigo-200/70 bg-white/90 p-8 shadow-xl shadow-indigo-200/20 dark:border-slate-800 dark:bg-slate-900/70">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-500">
                  Quản lý kiến thức (beta)
                </p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                  Tạo hoặc chỉnh sửa bài học tuỳ chỉnh
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Các bài học này sẽ được lưu trên trình duyệt của bạn để tiện chỉnh sửa trước khi đồng
                  bộ lên cơ sở dữ liệu thật.
                </p>
              </div>
              <div className="text-sm">
                {saveStatus === 'success' ? (
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-500">
                    Đã lưu bài học
                  </span>
                ) : saveStatus === 'deleted' ? (
                  <span className="rounded-full bg-rose-500/15 px-3 py-1 text-rose-500">
                    Đã xoá bài học
                  </span>
                ) : saveStatus === 'error' && errorMessage ? (
                  <span className="rounded-full bg-rose-500/15 px-3 py-1 text-rose-500">
                    {errorMessage}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300">
                Chọn bài học
                <select
                  className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-600/30"
                  onChange={(event) =>
                    setSelectedLessonId(event.target.value as typeof selectedLessonId)
                  }
                  value={selectedLessonId}
                >
                  <option value="new">+ Tạo bài học mới</option>
                  {customLessons.map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300">
                Tiêu đề
                <input
                  className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-600/30"
                  onChange={handleInputChange('title')}
                  placeholder="Ví dụ: Giải thuật debounce"
                  value={formState.title}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300">
                Mô tả ngắn
                <input
                  className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-600/30"
                  onChange={handleInputChange('description')}
                  placeholder="Tóm tắt 1-2 câu..."
                  value={formState.description}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300">
                Ảnh minh hoạ (URL)
                <input
                  className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-600/30"
                  onChange={handleInputChange('coverUrl')}
                  placeholder="https://..."
                  value={formState.coverUrl}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300">
                Mô tả ảnh (alt text)
                <input
                  className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-600/30"
                  onChange={handleInputChange('coverAlt')}
                  placeholder="Mô tả ngắn giúp accessibility"
                  value={formState.coverAlt}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300">
                Tech Stack
                <select
                  className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-600/30"
                  onChange={handleInputChange('techStack')}
                  value={formState.techStack}
                >
                  {Object.values(techStacks).map((techStack) => (
                    <option key={techStack.id} value={techStack.id}>
                      {techStack.logo} {techStack.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300">
                Độ khó
                <select
                  className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-600/30"
                  onChange={handleInputChange('difficulty')}
                  value={formState.difficulty}
                >
                  <option value="Cơ bản">Cơ bản</option>
                  <option value="Trung bình">Trung bình</option>
                  <option value="Nâng cao">Nâng cao</option>
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300">
                Thời lượng (phút)
                <input
                  className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-600/30"
                  onChange={handleInputChange('estimatedTime')}
                  type="number"
                  value={formState.estimatedTime}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300">
                Tag (phân cách bởi dấu phẩy)
                <input
                  className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-600/30"
                  onChange={handleInputChange('tags')}
                  placeholder="javascript, async, pattern"
                  value={formState.tags}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300 sm:col-span-2">
                Tiêu đề mục kiến thức
                <input
                  className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-600/30"
                  onChange={handleInputChange('sectionTitle')}
                  placeholder="Ví dụ: Ghi chú tổng quan"
                  value={formState.sectionTitle}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300 sm:col-span-2">
                Nội dung chính
                <textarea
                  className="min-h-[160px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-600/30"
                  onChange={handleInputChange('content')}
                  placeholder="Nhập nội dung, xuống dòng để tách ý..."
                  value={formState.content}
                />
              </label>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Các thao tác sẽ được đồng bộ hoá với backend ngay khi bạn lưu lại.
              </div>
              <div className="flex gap-3">
                {selectedLessonId !== 'new' ? (
                  <Button onClick={() => void handleDeleteLesson()} type="button" variant="destructive">
                    Xoá
                  </Button>
                ) : null}
                <Button onClick={() => void handleSaveLesson()} type="button">
                  Lưu bài học
                </Button>
              </div>
            </div>
          </section>
        ) : null} */}
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
