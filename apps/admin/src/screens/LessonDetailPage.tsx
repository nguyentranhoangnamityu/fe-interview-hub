import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Plus,
  Save,
  Trash2,
  Edit3,
  Check,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import type { Lesson, LessonQuiz, LessonQuizOption } from '@fehub/types'

import { useAdmin } from '../providers/AdminProvider'

type QuizFormState = {
  id: string
  prompt: string
  explanation: string
  points: string
  options: LessonQuizOption[]
  correctOptionId: string
}

const generateId = (prefix: string) =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const createEmptyOption = (): LessonQuizOption => ({
  id: generateId('option'),
  text: '',
})

const defaultQuizForm = (): QuizFormState => {
  const optionA = createEmptyOption()
  const optionB = createEmptyOption()
  return {
    id: generateId('quiz'),
    prompt: '',
    explanation: '',
    points: '1',
    options: [optionA, optionB],
    correctOptionId: optionA.id,
  }
}

const mapLessonToForm = (quiz: LessonQuiz): QuizFormState => ({
  id: quiz.id,
  prompt: quiz.prompt,
  explanation: quiz.explanation,
  points: String(quiz.points ?? 0),
  options: quiz.options.map((option) => ({ ...option })),
  correctOptionId: quiz.correctOptionId,
})

const formatDifficulty = (lesson: Lesson) => lesson.difficulty || 'Không xác định'

const difficultyBadgeColor = (difficulty: string) => {
  if (!difficulty) return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200'
  const mapping: Record<string, string> = {
    Beginner: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
    Intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
    Advanced: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200',
    'Cơ bản': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
    'Trung bình': 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
    'Nâng cao': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200',
  }
  return mapping[difficulty] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200'
}

export const LessonDetailPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  const { lessons, updateLesson, lessonsLoading } = useAdmin()

  const lesson: Lesson | undefined = useMemo(
    () => lessons.find((item) => item.id === lessonId),
    [lessons, lessonId],
  )

  const [quizzes, setQuizzes] = useState<LessonQuiz[]>([])
  const [formState, setFormState] = useState<QuizFormState>(() => defaultQuizForm())
  const [activeQuizId, setActiveQuizId] = useState<string>('new')
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    if (!lesson) {
      return
    }
    setQuizzes(Array.isArray(lesson.quizzes) ? lesson.quizzes : [])
  }, [lesson])

  useEffect(() => {
    if (!feedback) {
      return
    }
    const timeout = window.setTimeout(() => setFeedback(null), 2500)
    return () => window.clearTimeout(timeout)
  }, [feedback])

  const handleBack = () => navigate('/admin/lessons')

  const handleSelectQuiz = (quiz: LessonQuiz) => {
    setActiveQuizId(quiz.id)
    setFormState(mapLessonToForm(quiz))
  }

  const handleCreateNewQuiz = () => {
    setActiveQuizId('new')
    setFormState(defaultQuizForm())
  }

  const updateFormField = (field: keyof QuizFormState, value: string | LessonQuizOption[]) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleOptionChange = (optionId: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      options: prev.options.map((option) =>
        option.id === optionId ? { ...option, text: value } : option,
      ),
    }))
  }

  const handleAddOption = () => {
    setFormState((prev) => {
      const nextOption = createEmptyOption()
      return {
        ...prev,
        options: [...prev.options, nextOption],
      }
    })
  }

  const handleRemoveOption = (optionId: string) => {
    setFormState((prev) => {
      const nextOptions = prev.options.filter((option) => option.id !== optionId)
      const nextCorrect =
        prev.correctOptionId === optionId && nextOptions.length > 0
          ? nextOptions[0].id
          : prev.correctOptionId
      return {
        ...prev,
        options: nextOptions,
        correctOptionId: nextCorrect,
      }
    })
  }

  const validateForm = () => {
    if (!formState.prompt.trim()) {
      return 'Vui lòng nhập câu hỏi.'
    }
    if (formState.options.length < 2) {
      return 'Cần tối thiểu 2 lựa chọn.'
    }
    if (formState.options.some((option) => !option.text.trim())) {
      return 'Không được để trống nội dung lựa chọn.'
    }
    const pointsNumber = Number(formState.points)
    if (!Number.isFinite(pointsNumber) || pointsNumber < 0) {
      return 'Điểm số phải là số không âm.'
    }
    if (!formState.correctOptionId || !formState.options.some((option) => option.id === formState.correctOptionId)) {
      return 'Vui lòng chọn đáp án đúng.'
    }
    return null
  }

  const buildLessonQuizFromForm = (): LessonQuiz => ({
    id: activeQuizId === 'new' ? generateId('quiz') : formState.id,
    prompt: formState.prompt.trim(),
    explanation: formState.explanation.trim(),
    points: Number(formState.points) || 0,
    options: formState.options.map((option) => ({
      id: option.id,
      text: option.text.trim(),
    })),
    correctOptionId: formState.correctOptionId,
  })

  const persistQuizzes = async (nextQuizzes: LessonQuiz[], successMessage: string) => {
    if (!lessonId) {
      setFeedback({ type: 'error', message: 'Không tìm thấy mã bài học.' })
      return
    }
    setIsSaving(true)
    try {
      await updateLesson(lessonId, { quizzes: nextQuizzes })
      setQuizzes(nextQuizzes)
      setFeedback({ type: 'success', message: successMessage })
    } catch (error) {
      console.error('Failed to persist quizzes', error)
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Không thể cập nhật quiz. Thử lại sau.',
      })
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveQuiz = async () => {
    const validationError = validateForm()
    if (validationError) {
      setFeedback({ type: 'error', message: validationError })
      return
    }

    const nextQuiz = buildLessonQuizFromForm()
    const nextQuizzes =
      activeQuizId === 'new'
        ? [...quizzes, nextQuiz]
        : quizzes.map((quiz) => (quiz.id === nextQuiz.id ? nextQuiz : quiz))

    await persistQuizzes(nextQuizzes, activeQuizId === 'new' ? 'Đã thêm quiz mới.' : 'Đã cập nhật quiz.')
    setActiveQuizId(nextQuiz.id)
    setFormState(mapLessonToForm(nextQuiz))
  }

  const handleDeleteQuiz = async (quizId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa quiz này?')) {
      return
    }
    const nextQuizzes = quizzes.filter((quiz) => quiz.id !== quizId)
    await persistQuizzes(nextQuizzes, 'Đã xóa quiz.')
    handleCreateNewQuiz()
  }

  const quizzesCount = quizzes.length
  const totalPoints = quizzes.reduce((sum, quiz) => sum + (quiz.points ?? 0), 0)

  if (!lessonId) {
    return null
  }

  if (lessonsLoading && !lesson) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full border-b-2 border-red-500 h-10 w-10" />
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 dark:text-slate-200">
        <div className="max-w-md text-center space-y-4">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="text-xl font-semibold">Không tìm thấy bài học</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Bài học bạn chọn có thể đã bị xóa hoặc không tồn tại. Vui lòng quay lại danh sách bài học.
          </p>
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách bài học
          </button>
        </div>
      </div>
    )
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
        <main className="flex w-full flex-1 flex-col gap-6 px-3 py-6 sm:px-4 sm:py-8 md:px-6 md:py-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center rounded-xl border border-red-200/70 bg-white/70 px-4 py-2 text-sm font-medium text-red-700 shadow-sm transition hover:bg-white dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </button>
            <div className="rounded-xl border border-red-200/70 bg-white/80 px-4 py-2 text-xs text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
              {quizzesCount} quiz • {totalPoints} điểm
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="rounded-2xl border border-red-200/70 bg-white/90 p-5 shadow-xl shadow-red-200/20 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 sm:rounded-3xl sm:p-6"
          >
            <div className="space-y-4">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h1 className="text-xl font-semibold text-red-700 dark:text-red-400">
                    {lesson.title}
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
                    {lesson.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${difficultyBadgeColor(lesson.difficulty)}`}>
                    {formatDifficulty(lesson)}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-400/15 dark:text-blue-300">
                    {lesson.techStack}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-slate-500/10 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700/30 dark:text-slate-200">
                    {lesson.estimatedTime} phút
                  </span>
                </div>
              </div>

              {lesson.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {lesson.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700/50 dark:text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="grid gap-6 lg:grid-cols-[1.1fr_1fr]"
          >
            <section className="rounded-2xl border border-red-200/70 bg-white/95 p-5 shadow-xl shadow-red-200/20 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 sm:rounded-3xl sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">Danh sách quiz</h2>
                <button
                  type="button"
                  onClick={handleCreateNewQuiz}
                  className="inline-flex items-center rounded-lg border border-red-200/70 bg-white px-3 py-1.5 text-xs font-medium text-red-600 shadow-sm transition hover:bg-red-50 dark:border-slate-700 dark:bg-slate-800 dark:text-red-300 dark:hover:bg-slate-700"
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Thêm quiz
                </button>
              </div>

              {quizzesCount === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-red-200 bg-red-50/40 p-6 text-center text-sm text-red-500 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
                  Chưa có quiz nào cho bài học này. Hãy tạo quiz đầu tiên để kiểm tra kiến thức của người học.
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {quizzes.map((quiz, index) => (
                    <div
                      key={quiz.id}
                      className={`rounded-2xl border p-4 transition hover:border-red-300 dark:border-slate-700 dark:hover:border-red-500/60 ${
                        activeQuizId === quiz.id ? 'border-red-300 bg-red-50/60 dark:border-red-500/60 dark:bg-red-500/10' : 'border-red-100 bg-white dark:border-slate-700 dark:bg-slate-900/70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-red-500">Quiz {index + 1}</p>
                          <h3 className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {quiz.prompt}
                          </h3>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleSelectQuiz(quiz)}
                            className="inline-flex items-center rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700"
                          >
                            <Edit3 className="mr-1 h-3 w-3" />
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDeleteQuiz(quiz.id)}
                            className="inline-flex items-center rounded-md bg-red-500/15 px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-500/25 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20"
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            Xóa
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                        <div className="grid gap-1 text-xs text-slate-500 dark:text-slate-400">
                          <span>Điểm: <strong className="text-slate-700 dark:text-slate-200">{quiz.points}</strong></span>
                          {quiz.explanation && (
                            <span>Giải thích: <strong className="text-slate-700 dark:text-slate-200">{quiz.explanation}</strong></span>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          {quiz.options.map((option) => {
                            const isCorrect = option.id === quiz.correctOptionId
                            return (
                              <div
                                key={option.id}
                                className={`flex items-start justify-between rounded-lg border px-3 py-2 text-xs ${
                                  isCorrect
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200'
                                    : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                                }`}
                              >
                                <span>{option.text}</span>
                                {isCorrect && <Check className="ml-3 mt-0.5 h-3.5 w-3.5" />}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-red-200/70 bg-white/95 p-5 shadow-xl shadow-red-200/20 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 sm:rounded-3xl sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">
                  {activeQuizId === 'new' ? 'Tạo quiz mới' : 'Chỉnh sửa quiz'}
                </h2>
                <span className="text-xs text-slate-400">
                  {activeQuizId === 'new' ? 'ID tạm thời: (sẽ tạo khi lưu)' : formState.id}
                </span>
              </div>

              {feedback && (
                <div
                  className={`mt-4 rounded-xl border px-3 py-2 text-xs ${
                    feedback.type === 'success'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200'
                      : 'border-red-200 bg-red-50 text-red-600 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200'
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Câu hỏi
                  </label>
                  <textarea
                    value={formState.prompt}
                    onChange={(event) => updateFormField('prompt', event.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-red-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    placeholder="Nhập câu hỏi cho người học..."
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                      Điểm số
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formState.points}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => updateFormField('points', event.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-red-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                      Giải thích (tùy chọn)
                    </label>
                    <input
                      value={formState.explanation}
                      onChange={(event) => updateFormField('explanation', event.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-red-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      placeholder="Giải thích lý do đáp án đúng"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Các lựa chọn
                    </label>
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="inline-flex items-center rounded-lg border border-red-200/70 bg-white px-2.5 py-1 text-xs font-medium text-red-600 shadow-sm transition hover:bg-red-50 dark:border-slate-700 dark:bg-slate-800 dark:text-red-300 dark:hover:bg-slate-700"
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Thêm lựa chọn
                    </button>
                  </div>

                  <div className="mt-3 space-y-3">
                    {formState.options.map((option, index) => {
                      const isCorrect = option.id === formState.correctOptionId
                      return (
                        <div
                          key={option.id}
                          className={`rounded-xl border px-3 py-2 transition ${
                            isCorrect
                              ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10'
                              : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-start gap-3 text-sm">
                            <div className="mt-1">
                              <input
                                type="radio"
                                name="correctOption"
                                checked={isCorrect}
                                onChange={() => updateFormField('correctOptionId', option.id)}
                                className="h-4 w-4 text-red-500 focus:ring-red-500"
                              />
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                                <span>Lựa chọn {index + 1}</span>
                                {isCorrect ? (
                                  <span className="inline-flex items-center text-emerald-600 dark:text-emerald-300">
                                    <Check className="mr-1 h-3 w-3" />
                                    Đáp án đúng
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => updateFormField('correctOptionId', option.id)}
                                    className="inline-flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                                  >
                                    <Check className="mr-1 h-3 w-3" />
                                    Đánh dấu đúng
                                  </button>
                                )}
                              </div>
                              <input
                                value={option.text}
                                onChange={(event) => handleOptionChange(option.id, event.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-red-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                placeholder={`Nội dung lựa chọn ${index + 1}`}
                              />
                            </div>
                            {formState.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveOption(option.id)}
                                className="mt-1 inline-flex items-center text-xs text-red-500 transition hover:text-red-600"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  Đã lựa chọn <strong>{formState.options.length}</strong> đáp án •{' '}
                  <strong>{formState.correctOptionId ? 'Có đáp án đúng' : 'Chưa có đáp án đúng'}</strong>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCreateNewQuiz}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Làm mới
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleSaveQuiz()}
                    disabled={isSaving}
                    className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? 'Đang lưu...' : activeQuizId === 'new' ? 'Thêm quiz' : 'Lưu thay đổi'}
                  </button>
                </div>
              </div>
            </section>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

