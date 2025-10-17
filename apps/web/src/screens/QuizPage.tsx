import { useEffect, useMemo, useState } from 'react'
import { Button } from '@fehub/ui'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { useAuth } from '../providers/AuthProvider'
import {
  type Lesson,
  useKnowledgeBase,
} from '../providers/KnowledgeBaseProvider'
import { TextWithCode } from '../components/TextWithCode'

export const QuizPage = () => {
  const { lessonId = '' } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    getLesson,
    submitQuiz,
    resetQuiz,
    getQuizSummary,
  } = useKnowledgeBase()

  const lesson = useMemo(() => (lessonId ? getLesson(lessonId) : undefined), [getLesson, lessonId])

  useEffect(() => {
    if (!lesson && lessonId) {
      navigate('/knowledge-base', { replace: true })
    }
  }, [lesson, lessonId, navigate])

  const [quizStatus, setQuizStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [quizMessage, setQuizMessage] = useState<string | null>(null)

  const quizSummary = useMemo(
    () => (lesson ? getQuizSummary(lesson.id) : { result: null, totalQuestions: 0, totalPoints: 0 }),
    [getQuizSummary, lesson],
  )

  const storedQuizResult = quizSummary.result

  const [answers, setAnswers] = useState<Record<string, string>>(
    storedQuizResult?.answers ?? {},
  )

  useEffect(() => {
    setAnswers(storedQuizResult?.answers ?? {})
  }, [storedQuizResult])

  if (!lesson || !lesson.quizzes || lesson.quizzes.length === 0) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#eef2ff] text-slate-900 dark:bg-background dark:text-foreground">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-[-12rem] h-[26rem] w-[26rem] rounded-full bg-indigo-300/40 blur-3xl dark:bg-indigo-600/20" />
          <div className="absolute -right-24 bottom-[-10rem] h-[28rem] w-[28rem] rounded-full bg-sky-200/45 blur-3xl dark:bg-sky-500/25" />
        </div>
        <div className="relative flex h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Không tìm thấy quiz</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Bài học này không có quiz.</p>
            <Button asChild className="mt-4">
              <Link to={`/knowledge-base/${lessonId}`}>Quay lại bài học</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const handleSelectAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }))
  }

  const handleSubmitQuiz = async () => {
    if (!lesson.quizzes || lesson.quizzes.length === 0) {
      return
    }
    if (!user) {
      setQuizStatus('error')
      setQuizMessage('Đăng nhập để chấm điểm quiz và lưu kết quả.')
      return
    }
    const result = await submitQuiz(lesson.id, answers)
    if (!result) {
      setQuizStatus('error')
      setQuizMessage('Không thể chấm điểm vào lúc này. Thử lại sau nhé.')
      return
    }
    setQuizStatus('success')
    setQuizMessage(`Bạn đạt ${result.score}/${result.totalPoints} điểm.`)
  }

  const handleResetQuiz = async () => {
    if (!lesson.quizzes || lesson.quizzes.length === 0) {
      return
    }
    if (!user) {
      setQuizStatus('error')
      setQuizMessage('Đăng nhập để xoá kết quả quiz.')
      return
    }
    await resetQuiz(lesson.id)
    setAnswers({})
    setQuizStatus('idle')
    setQuizMessage(null)
  }

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
                  <Link to={`/knowledge-base/${lessonId}`}>← Quay lại bài học</Link>
                </Button>
                <Button asChild variant="secondary" size="sm">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              </div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-indigo-500">
                Quiz ôn tập
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white lg:text-3xl">
                {lesson.title}
              </h1>
              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Kiểm tra kiến thức của bạn với các câu hỏi trắc nghiệm
              </p>
            </div>

            {/* Quiz Info Card */}
            <div className="rounded-3xl border border-indigo-200/70 bg-white/85 p-6 shadow-xl shadow-indigo-200/30 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-indigo-500/10 p-2">
                  <span className="text-lg">🧠</span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-500 dark:text-indigo-200">
                    Thông tin quiz
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                    {quizSummary.totalQuestions} câu hỏi — {quizSummary.totalPoints} điểm tối đa
                  </p>
                </div>
              </div>

              {/* Quiz Progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span>Tiến độ quiz</span>
                  <span>{Object.keys(answers).length}/{quizSummary.totalQuestions} câu đã trả lời</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300"
                    style={{ width: `${(Object.keys(answers).length / quizSummary.totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              {/* Quiz Results */}
              {quizMessage ? (
                <div className={`mt-4 rounded-xl p-4 ${
                  quizStatus === 'success' 
                    ? 'bg-emerald-50/80 border border-emerald-200/60 dark:bg-emerald-900/20 dark:border-emerald-700' 
                    : 'bg-rose-50/80 border border-rose-200/60 dark:bg-rose-900/20 dark:border-rose-700'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{quizStatus === 'success' ? '🎉' : '⚠️'}</span>
                    <p className={`text-sm font-medium ${
                      quizStatus === 'success' ? 'text-emerald-700 dark:text-emerald-200' : 'text-rose-700 dark:text-rose-200'
                    }`}>
                      {quizMessage}
                    </p>
                  </div>
                  {storedQuizResult?.completedAt && (
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Lần chấm gần nhất: {new Date(storedQuizResult.completedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-3">
                <Button 
                  onClick={() => void handleSubmitQuiz()} 
                  size="sm"
                  disabled={Object.keys(answers).length === 0}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {Object.keys(answers).length === 0 ? 'Chọn đáp án để chấm điểm' : 'Chấm điểm'}
                </Button>
                <Button onClick={() => void handleResetQuiz()} variant="outline" size="sm">
                  Xoá kết quả
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-8 lg:pl-6 xl:pl-10">
            <div className="space-y-6">
              {lesson.quizzes.map((quiz, index) => {
                const isAnswered = answers[quiz.id]
                const isCorrect = storedQuizResult?.answers?.[quiz.id] === quiz.correctOptionId
                const showResult = storedQuizResult && storedQuizResult.completedAt
                
                return (
                  <div
                    key={quiz.id}
                    className={`rounded-3xl border border-indigo-200/70 bg-white/90 p-6 shadow-xl shadow-indigo-200/30 transition-all ${
                      showResult 
                        ? isCorrect 
                          ? 'border-emerald-200/60 bg-emerald-50/80 dark:border-emerald-700 dark:bg-emerald-900/20' 
                          : 'border-rose-200/60 bg-rose-50/80 dark:border-rose-700 dark:bg-rose-900/20'
                        : 'dark:border-slate-800 dark:bg-slate-900/70'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                        showResult 
                          ? isCorrect 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-rose-500 text-white'
                          : 'bg-indigo-500 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="mb-4">
                          <TextWithCode className="text-lg font-semibold text-slate-900 dark:text-white">
                            {quiz.prompt}
                          </TextWithCode>
                        </div>
                        <div className="space-y-3">
                          {quiz.options.map((option) => {
                            const isSelected = answers[quiz.id] === option.id
                            const isCorrectOption = option.id === quiz.correctOptionId
                            
                            return (
                              <label
                                key={option.id}
                                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-slate-700 shadow-sm transition ${
                                  showResult
                                    ? isCorrectOption
                                      ? 'border-emerald-300 bg-emerald-100/80 text-emerald-800 dark:border-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-200'
                                      : isSelected
                                        ? 'border-rose-300 bg-rose-100/80 text-rose-800 dark:border-rose-600 dark:bg-rose-900/40 dark:text-rose-200'
                                        : 'border-slate-200 bg-slate-50/80 text-slate-600 dark:border-slate-600 dark:bg-slate-800/40 dark:text-slate-300'
                                    : isSelected
                                      ? 'border-indigo-300 bg-indigo-100/80 text-indigo-800 dark:border-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-200'
                                      : 'border-transparent bg-white/90 hover:border-indigo-300 hover:bg-white dark:bg-slate-900/80 dark:text-slate-200'
                                }`}
                              >
                                <input
                                  checked={isSelected}
                                  className={`h-4 w-4 focus:ring-2 ${
                                    showResult
                                      ? isCorrectOption
                                        ? 'border-emerald-300 text-emerald-600 focus:ring-emerald-500'
                                        : isSelected
                                          ? 'border-rose-300 text-rose-600 focus:ring-rose-500'
                                          : 'border-slate-300 text-slate-400'
                                      : 'border-indigo-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600'
                                  }`}
                                  disabled={!!showResult}
                                  name={quiz.id}
                                  onChange={() => handleSelectAnswer(quiz.id, option.id)}
                                  type="radio"
                                  value={option.id}
                                />
                                <div className="flex-1">
                                  <TextWithCode>
                                    {option.text}
                                  </TextWithCode>
                                </div>
                                {showResult && isCorrectOption && (
                                  <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                                )}
                                {showResult && isSelected && !isCorrectOption && (
                                  <span className="text-rose-600 dark:text-rose-400">✗</span>
                                )}
                              </label>
                            )
                          })}
                        </div>
                        
                        {/* Explanation */}
                        {showResult && (
                          <div className="mt-6 rounded-xl bg-slate-100/80 p-4 dark:bg-slate-800/60">
                            <p className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                              Giải thích
                            </p>
                            <div className="mt-2">
                              <TextWithCode className="text-slate-700 dark:text-slate-200">
                                {quiz.explanation}
                              </TextWithCode>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
