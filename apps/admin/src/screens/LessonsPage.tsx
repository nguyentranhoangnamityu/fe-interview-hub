import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  BookOpen,
  Loader2,
  Tags,
  Layers,
  Clock,
  X,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CreateLessonPayload, Lesson, LessonSection, TechStack } from '@fehub/types'
import { useAdmin } from '../providers/AdminProvider'

type LessonFormSubmitPayload = Omit<CreateLessonPayload, 'id'>

type SectionDraft = {
  id: string
  title: string
  content: string
}

type LessonFormModalProps = {
  mode: 'create' | 'edit'
  open: boolean
  onClose: () => void
  onSubmit: (values: LessonFormSubmitPayload) => Promise<void>
  initialLesson?: Lesson
  techStacks: TechStack[]
  difficulties: string[]
  submitting: boolean
  error: string | null
  techStacksLoading: boolean
}

type LessonDetailModalProps = {
  lesson: Lesson
  onClose: () => void
  techStacksMap: Map<string, string>
}

type ConfirmDeleteModalProps = {
  lesson?: Lesson | null
  onConfirm: () => Promise<void>
  onCancel: () => void
  loading: boolean
  error: string | null
}

const DEFAULT_DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced']

const generateId = (prefix: string) =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const blocksToText = (body: LessonSection['body']) =>
  body
    .map((block) => {
      if (block.type === 'paragraph') return block.text
      if (block.type === 'list') return block.items.join('\n')
      if (block.type === 'code') return `\`\`\`${block.language}\n${block.snippet}\n\`\`\``
      return ''
    })
    .filter(Boolean)
    .join('\n\n')

const textToBlocks = (content: string): LessonSection['body'] =>
  content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => ({
      type: 'paragraph' as const,
      text: paragraph,
    }))

const buildDifficultyOptions = (lessons: Lesson[]) => {
  const options = new Set<string>()
  lessons.forEach((lesson) => {
    if (lesson.difficulty) {
      options.add(lesson.difficulty)
    }
  })
  return options.size > 0 ? Array.from(options) : DEFAULT_DIFFICULTIES
}

const capitalize = (value: string) =>
  value
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

const LessonFormModal = ({
  mode,
  open,
  onClose,
  onSubmit,
  initialLesson,
  techStacks,
  difficulties,
  submitting,
  error,
  techStacksLoading,
}: LessonFormModalProps) => {
  const [title, setTitle] = useState(initialLesson?.title ?? '')
  const [description, setDescription] = useState(initialLesson?.description ?? '')
  const [difficulty, setDifficulty] = useState(initialLesson?.difficulty ?? difficulties[0] ?? 'Beginner')
  const [estimatedTime, setEstimatedTime] = useState(
    initialLesson?.estimatedTime ? String(initialLesson.estimatedTime) : '30',
  )
  const [techStack, setTechStack] = useState(initialLesson?.techStack ?? '')
  const [tagsInput, setTagsInput] = useState(initialLesson?.tags?.join(', ') ?? '')
  const [sections, setSections] = useState<SectionDraft[]>(
    initialLesson?.sections?.length
      ? initialLesson.sections.map((section) => ({
          id: section.id,
          title: section.title,
          content: blocksToText(section.body),
        }))
      : [
          {
            id: generateId('section'),
            title: '',
            content: '',
          },
        ],
  )
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    if (!initialLesson) {
      setTitle('')
      setDescription('')
      setDifficulty(difficulties[0] ?? 'Beginner')
      setEstimatedTime('30')
      setTechStack('')
      setTagsInput('')
      setSections([
        {
          id: generateId('section'),
          title: '',
          content: '',
        },
      ])
    } else {
      setTitle(initialLesson.title)
      setDescription(initialLesson.description)
      setDifficulty(initialLesson.difficulty || difficulties[0] || 'Beginner')
      setEstimatedTime(String(initialLesson.estimatedTime ?? 30))
      setTechStack(initialLesson.techStack)
      setTagsInput(initialLesson.tags?.join(', ') ?? '')
      setSections(
        initialLesson.sections.map((section) => ({
          id: section.id,
          title: section.title,
          content: blocksToText(section.body),
        })),
      )
    }

    setLocalError(null)
  }, [open, initialLesson, difficulties])

  const resetState = () => {
    if (!initialLesson) {
      setTitle('')
      setDescription('')
      setDifficulty(difficulties[0] ?? 'Beginner')
      setEstimatedTime('30')
      setTechStack('')
      setTagsInput('')
      setSections([
        {
          id: generateId('section'),
          title: '',
          content: '',
        },
      ])
    } else {
      setTitle(initialLesson.title)
      setDescription(initialLesson.description)
      setDifficulty(initialLesson.difficulty || difficulties[0] || 'Beginner')
      setEstimatedTime(String(initialLesson.estimatedTime ?? 30))
      setTechStack(initialLesson.techStack)
      setTagsInput(initialLesson.tags?.join(', ') ?? '')
      setSections(
        initialLesson.sections.map((section) => ({
          id: section.id,
          title: section.title,
          content: blocksToText(section.body),
        })),
      )
    }

    setLocalError(null)
  }

  const handleClose = () => {
    resetState()
    onClose()
  }

  const handleAddSection = () => {
    setSections((prev) => [...prev, { id: generateId('section'), title: '', content: '' }])
  }

  const handleRemoveSection = (id: string) => {
    setSections((prev) => (prev.length > 1 ? prev.filter((section) => section.id !== id) : prev))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLocalError(null)

    if (!title.trim()) {
      setLocalError('Vui lòng nhập tiêu đề bài học')
      return
    }

    if (!techStack.trim()) {
      setLocalError('Vui lòng chọn hoặc nhập tech stack')
      return
    }

    const parsedEstimatedTime = Number(estimatedTime)
    if (!Number.isFinite(parsedEstimatedTime) || parsedEstimatedTime <= 0) {
      setLocalError('Thời lượng ước tính phải là số dương')
      return
    }

    const cleanedSections = sections
      .map((section) => ({
        ...section,
        title: section.title.trim(),
        content: section.content.trim(),
      }))
      .filter((section) => section.title || section.content)

    if (cleanedSections.length === 0) {
      setLocalError('Cần ít nhất một chương mục cho bài học')
      return
    }

    const payload: LessonFormSubmitPayload = {
      title: title.trim(),
      description: description.trim(),
      difficulty: difficulty.trim(),
      estimatedTime: parsedEstimatedTime,
      techStack: techStack.trim(),
      tags: tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      sections: cleanedSections.map((section) => ({
        id: section.id,
        title: section.title || 'Nội dung',
        body: textToBlocks(section.content || section.title),
      })),
    }

    try {
      await onSubmit(payload)
      if (mode === 'create') {
        resetState()
      }
    } catch {
      // Error surfaced via parent error prop
    }
  }

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="flex h-full items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-slate-900"
        >
          <div className="flex max-h-[calc(100vh-2rem)] flex-col overflow-hidden sm:max-h-[calc(100vh-4rem)]">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4 dark:border-slate-800 sm:px-8 sm:py-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {mode === 'create' ? 'Tạo bài học mới' : 'Chỉnh sửa bài học'}
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Điền các thông tin cần thiết để quản lý nội dung bài học.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-1 flex-col overflow-hidden px-6 pb-6 sm:px-8 sm:pb-8"
            >
              <div className="flex-1 space-y-6 overflow-y-auto pr-2">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Tiêu đề
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                      placeholder="Nhập tiêu đề bài học"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Mô tả ngắn
                    </label>
                    <textarea
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      className="h-24 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                      placeholder="Mô tả ngắn gọn nội dung và mục tiêu của bài học"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Độ khó
                    </label>
                    <select
                      value={difficulty}
                      onChange={(event) => setDifficulty(event.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                    >
                      {difficulties.map((option) => (
                        <option key={option} value={option}>
                          {capitalize(option)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Thời lượng ước tính (phút)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={estimatedTime}
                      onChange={(event) => setEstimatedTime(event.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Tech stack
                    </label>
                    <input
                      type="text"
                      list="tech-stack-options"
                      value={techStack}
                      onChange={(event) => setTechStack(event.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                      placeholder="Ví dụ: react, vue, angular"
                    />
                    <datalist id="tech-stack-options">
                      {techStacks.map((stack) => (
                        <option key={stack.id} value={stack.id}>
                          {stack.name}
                        </option>
                      ))}
                    </datalist>
                    {techStacksLoading && (
                      <p className="mt-1 flex items-center text-xs text-slate-400">
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        Đang tải danh sách tech stack...
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Tags (ngăn cách bằng dấu phẩy)
                    </label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(event) => setTagsInput(event.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                      placeholder="state management, hooks, performance"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Nội dung bài học</h4>
                    <button
                      type="button"
                      onClick={handleAddSection}
                      className="text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      + Thêm chương mục
                    </button>
                  </div>
                  <div className="mt-3 space-y-4">
                    {sections.map((section, index) => (
                      <div key={section.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            Chương {index + 1}
                          </span>
                          {sections.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSection(section.id)}
                              className="text-sm text-slate-400 hover:text-red-500"
                            >
                              Xóa
                            </button>
                          )}
                        </div>
                        <div className="mt-3 space-y-3">
                          <div>
                            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                              Tiêu đề chương
                            </label>
                            <input
                              type="text"
                              value={section.title}
                              onChange={(event) =>
                                setSections((prev) =>
                                  prev.map((item) =>
                                    item.id === section.id ? { ...item, title: event.target.value } : item,
                                  ),
                                )
                              }
                              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                              placeholder="Ví dụ: Giới thiệu về Hooks"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                              Nội dung
                            </label>
                            <textarea
                              value={section.content}
                              onChange={(event) =>
                                setSections((prev) =>
                                  prev.map((item) =>
                                    item.id === section.id ? { ...item, content: event.target.value } : item,
                                  ),
                                )
                              }
                              className="h-32 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                              placeholder="Viết nội dung hoặc các ý chính, sử dụng xuống dòng để tách đoạn."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {(localError || error) && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
                    {localError || error}
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
                >
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {mode === 'create' ? 'Tạo bài học' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}


const LessonDetailModal = ({ lesson, onClose, techStacksMap }: LessonDetailModalProps) => (
  <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
    <div className="flex h-full items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900"
      >
        <div className="flex max-h-[calc(100vh-2rem)] flex-col overflow-hidden sm:max-h-[calc(100vh-4rem)]">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800 sm:px-8 sm:py-6">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{lesson.title}</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{lesson.description}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6 pr-4 sm:px-8">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center rounded-2xl bg-red-50 p-4 dark:bg-red-500/10">
                <Layers className="mr-3 h-5 w-5 text-red-500" />
                <div>
                  <p className="text-xs uppercase text-red-500">Tech stack</p>
                  <p className="text-sm font-medium text-red-700 dark:text-red-200">
                    {techStacksMap.get(lesson.techStack) ?? lesson.techStack}
                  </p>
                </div>
              </div>
              <div className="flex items-center rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-500/10">
                <Clock className="mr-3 h-5 w-5 text-emerald-500" />
                <div>
                  <p className="text-xs uppercase text-emerald-500">Thời lượng</p>
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-200">
                    {lesson.estimatedTime} phút
                  </p>
                </div>
              </div>
              <div className="flex items-center rounded-2xl bg-sky-50 p-4 dark:bg-sky-500/10">
                <BookOpen className="mr-3 h-5 w-5 text-sky-500" />
                <div>
                  <p className="text-xs uppercase text-sky-500">Độ khó</p>
                  <p className="text-sm font-medium text-sky-700 dark:text-sky-200">{capitalize(lesson.difficulty)}</p>
                </div>
              </div>
            </div>

            {lesson.tags && lesson.tags.length > 0 && (
              <div>
                <p className="flex items-center text-sm font-semibold text-slate-600 dark:text-slate-300">
                  <Tags className="mr-2 h-4 w-4" />
                  Từ khóa
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {lesson.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {lesson.sections.map((section, index) => (
                <div
                  key={section.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {index + 1}. {section.title}
                    </h3>
                    <span className="text-xs uppercase tracking-wider text-slate-400">Chương {index + 1}</span>
                  </div>
                  <div className="mt-3 space-y-3">
                    {section.body.map((block, blockIndex) => {
                      if (block.type === 'paragraph') {
                        return (
                          <p key={blockIndex} className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            {block.text}
                          </p>
                        )
                      }
                      if (block.type === 'list') {
                        return (
                          <ul key={blockIndex} className="ml-5 list-disc space-y-1 text-sm text-slate-600 dark:text-slate-300">
                            {block.items.map((item, itemIndex) => (
                              <li key={itemIndex}>{item}</li>
                            ))}
                          </ul>
                        )
                      }
                      if (block.type === 'code') {
                        return (
                          <pre
                            key={blockIndex}
                            className="overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100"
                          >
                            <code>{block.snippet}</code>
                          </pre>
                        )
                      }
                      return null
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 px-6 py-4 dark:border-slate-800 sm:px-8">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
)

const ConfirmDeleteModal = ({ lesson, onConfirm, onCancel, loading, error }: ConfirmDeleteModalProps) => {
  if (!lesson) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900"
      >
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Xóa bài học?</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Bạn có chắc chắn muốn xóa <span className="font-medium text-slate-700 dark:text-slate-200">{lesson.title}</span>? Hành động này không thể hoàn tác.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Xóa
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export const LessonsPage = () => {
  const navigate = useNavigate()
  const {
    lessons,
    lessonsLoading,
    techStacks,
    techStacksLoading,
    createLesson,
    updateLesson,
    deleteLesson,
    fetchTechStacks,
  } = useAdmin()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTechStack, setFilterTechStack] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [deleteCandidate, setDeleteCandidate] = useState<Lesson | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const safeLessons = Array.isArray(lessons) ? lessons : []

  const techStacksMap = useMemo(() => {
    const map = new Map<string, string>()
    techStacks.forEach((stack) => map.set(stack.id, stack.name))
    return map
  }, [techStacks])

  const difficultyOptions = useMemo(() => buildDifficultyOptions(safeLessons), [safeLessons])

  const techStackOptions = useMemo(() => {
    if (techStacks.length > 0) {
      return techStacks.map((stack) => ({
        value: stack.id,
        label: stack.name,
      }))
    }
    const unique = Array.from(new Set(safeLessons.map((lesson) => lesson.techStack).filter(Boolean)))
    return unique.map((value) => ({
      value,
      label: techStacksMap.get(value) ?? value,
    }))
  }, [safeLessons, techStacks, techStacksMap])

  const filteredLessons = safeLessons.filter((lesson) => {
    const title = lesson?.title || ''
    const techStackValue = lesson?.techStack || ''
    const tags = lesson?.tags || []

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      techStackValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tags.some((tag) => tag?.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesFilter = filterTechStack === 'all' || techStackValue === filterTechStack
    return matchesSearch && matchesFilter
  })

  const ensureTechStacks = () => {
    if (techStacks.length === 0 && !techStacksLoading) {
      fetchTechStacks().catch((error) => {
        console.error('Failed to refresh tech stacks:', error)
      })
    }
  }

  const handleCreateLesson = async (payload: LessonFormSubmitPayload) => {
    setFormError(null)
    setIsSubmitting(true)
    try {
      await createLesson(payload)
      setShowCreateModal(false)
    } catch (error) {
      console.error('Failed to create lesson:', error)
      setFormError(error instanceof Error ? error.message : 'Không thể tạo bài học, thử lại sau')
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateLesson = async (payload: LessonFormSubmitPayload) => {
    if (!editingLesson) {
      return
    }
    const lessonId = editingLesson.id?.trim()
    if (!lessonId) {
      setFormError('Không xác định được bài học cần cập nhật')
      return
    }
    setFormError(null)
    setIsSubmitting(true)
    try {
      await updateLesson(lessonId, payload)
      setEditingLesson(null)
    } catch (error) {
      console.error('Failed to update lesson:', error)
      setFormError(error instanceof Error ? error.message : 'Không thể cập nhật bài học, thử lại sau')
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteLesson = async () => {
    if (!deleteCandidate) {
      return
    }
    const lessonId = deleteCandidate.id?.trim()
    if (!lessonId) {
      setDeleteError('Không xác định được bài học cần xóa')
      return
    }
    setDeleteError(null)
    setIsDeleting(true)
    try {
      await deleteLesson(lessonId)
      setDeleteCandidate(null)
      setDeleteError(null)
    } catch (error) {
      console.error('Failed to delete lesson:', error)
      setDeleteError(error instanceof Error ? error.message : 'Không thể xóa bài học, thử lại sau')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50 text-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-[-8rem] h-[20rem] w-[20rem] rounded-full bg-gradient-to-r from-red-400/30 to-pink-400/30 blur-3xl animate-pulse" />
        <div className="absolute -right-24 bottom-[-10rem] h-[22rem] w-[22rem] rounded-full bg-gradient-to-r from-orange-400/30 to-red-400/30 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-red-400/20 to-pink-400/20 blur-3xl animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.8),_transparent_60%)] dark:bg-none" />
      </div>

      <div className="relative flex min-h-screen flex-col">
        <main className="flex w-full flex-1 flex-col gap-4 px-3 py-6 sm:px-4 sm:py-8 md:px-6 md:py-10">
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="rounded-2xl border border-red-200/70 bg-white/90 p-4 shadow-xl shadow-red-200/20 backdrop-blur-sm dark:border-slate-800 dark:bg-card/90 sm:rounded-3xl sm:p-6 md:p-8"
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-lg font-semibold tracking-tight text-red-700 dark:text-red-400 sm:text-xl">
                  Quản lý Bài học
                </h1>
                <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
                  Tạo, chỉnh sửa và xóa bài học để cập nhật nội dung phỏng vấn.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  ensureTechStacks()
                  setFormError(null)
                  setShowCreateModal(true)
                }}
                className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tạo bài học mới
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="rounded-2xl border border-red-200/70 bg-white/90 p-4 shadow-xl shadow-red-200/20 backdrop-blur-sm dark:border-slate-800 dark:bg-card/90 sm:rounded-3xl sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài học..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={filterTechStack}
                  onChange={(event) => setFilterTechStack(event.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">Tất cả tech stack</option>
                  {techStackOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="rounded-2xl border border-red-200/70 bg-white/95 p-4 shadow-xl shadow-red-200/20 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 sm:rounded-3xl sm:p-6"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-gradient-to-r from-red-50/60 to-pink-50/60 dark:from-slate-800 dark:to-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Bài học
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Tech stack
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Độ khó
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Thời gian
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Tags
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900/60">
                  {lessonsLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center">
                        <div className="flex items-center justify-center text-slate-500">
                          <Loader2 className="mr-2 h-5 w-5 animate-spin text-red-500" />
                          Đang tải danh sách bài học...
                        </div>
                      </td>
                    </tr>
                  ) : filteredLessons.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center">
                        <div className="text-slate-500">
                          <BookOpen className="mx-auto mb-2 h-12 w-12 text-slate-400" />
                          <p>Không tìm thấy bài học nào phù hợp</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredLessons.map((lesson, index) => (
                      <motion.tr
                        key={lesson?.id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.05, duration: 0.25 }}
                        className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {lesson?.title || 'Không có tiêu đề'}
                          </div>
                          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                            {lesson?.description || 'Không có mô tả'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                            {techStacksMap.get(lesson?.techStack ?? '') ?? lesson?.techStack ?? 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                          {lesson?.difficulty ? capitalize(lesson.difficulty) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                          {lesson?.estimatedTime ? `${lesson.estimatedTime} phút` : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {lesson?.tags && lesson.tags.length > 0 ? (
                              <>
                                {lesson.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {lesson.tags.length > 3 && (
                                  <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                    +{lesson.tags.length - 3}
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-xs text-slate-400">Không có tags</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/lessons/${lesson?.id}`)}
                              className="rounded-lg p-1.5 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-200"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                ensureTechStacks()
                                setFormError(null)
                                setEditingLesson(lesson)
                              }}
                              className="rounded-lg p-1.5 text-indigo-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-200"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setDeleteError(null)
                                setDeleteCandidate(lesson)
                              }}
                              className="rounded-lg p-1.5 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </main>
      </div>

      <LessonFormModal
        mode="create"
        open={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          setFormError(null)
        }}
        onSubmit={handleCreateLesson}
        techStacks={techStacks}
        difficulties={difficultyOptions}
        submitting={isSubmitting}
        error={formError}
        techStacksLoading={techStacksLoading}
      />

      <LessonFormModal
        mode="edit"
        open={Boolean(editingLesson)}
        onClose={() => {
          setEditingLesson(null)
          setFormError(null)
        }}
        onSubmit={handleUpdateLesson}
        initialLesson={editingLesson ?? undefined}
        techStacks={techStacks}
        difficulties={difficultyOptions}
        submitting={isSubmitting}
        error={formError}
        techStacksLoading={techStacksLoading}
      />

      <ConfirmDeleteModal
        lesson={deleteCandidate}
        onConfirm={handleDeleteLesson}
        onCancel={() => {
          setDeleteCandidate(null)
          setDeleteError(null)
        }}
        loading={isDeleting}
        error={deleteError}
      />
    </div>
  )
}