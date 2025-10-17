import { useMemo } from 'react'
import { Button } from '@fehub/ui'
import { Link, useParams } from 'react-router-dom'

import { useKnowledgeBase } from '../providers/KnowledgeBaseProvider'

const roleLabel: Record<string, string> = {
  junior: 'Junior',
  middle: 'Middle',
  senior: 'Senior',
}

export const MockInterviewPage = () => {
  const { lessonId = '' } = useParams<{ lessonId: string }>()
  const { getLesson } = useKnowledgeBase()

  const lesson = useMemo(() => (lessonId ? getLesson(lessonId) : undefined), [getLesson, lessonId])

  if (!lesson || !lesson.mockPrompts || lesson.mockPrompts.length === 0) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#eef2ff] text-slate-900 dark:bg-background dark:text-foreground">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-[-12rem] h-[26rem] w-[26rem] rounded-full bg-indigo-300/40 blur-3xl dark:bg-indigo-600/20" />
          <div className="absolute -right-24 bottom-[-10rem] h-[28rem] w-[28rem] rounded-full bg-sky-200/45 blur-3xl dark:bg-sky-500/25" />
        </div>
        <div className="relative flex h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Không tìm thấy câu hỏi mock interview</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Bài học này không có câu hỏi mock interview.</p>
            <Button asChild className="mt-4">
              <Link to={`/knowledge-base/${lessonId}`}>Quay lại bài học</Link>
            </Button>
          </div>
        </div>
      </div>
    )
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
                Mock Interview
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white lg:text-3xl">
                {lesson.title}
              </h1>
              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Luyện tập phỏng vấn với các câu hỏi thực tế
              </p>
            </div>

            {/* Mock Interview Info Card */}
            <div className="rounded-3xl border border-indigo-200/70 bg-white/85 p-6 shadow-xl shadow-indigo-200/30 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-indigo-500/10 p-2">
                  <span className="text-lg">💼</span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-500 dark:text-indigo-200">
                    Thông tin mock interview
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Phỏng vấn với AI
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span>Junior:</span>
                  <span>{lesson.mockPrompts.filter(p => p.role === 'junior').length} câu</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span>Middle:</span>
                  <span>{lesson.mockPrompts.filter(p => p.role === 'middle').length} câu</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span>Senior:</span>
                  <span>{lesson.mockPrompts.filter(p => p.role === 'senior').length} câu</span>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-indigo-50/80 p-4 dark:bg-indigo-900/20">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-200">
                  💡 Gợi ý luyện tập
                </p>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                  Đọc kỹ từng câu hỏi, suy nghĩ về cách trả lời, và tham khảo gợi ý đánh giá để chuẩn bị tốt nhất cho phỏng vấn thực tế.
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-8 lg:pl-6 xl:pl-10">
            <div className="space-y-6">
              {lesson.mockPrompts.map((prompt, index) => (
                <div
                  key={prompt.id}
                  className="rounded-3xl border border-indigo-200/70 bg-white/90 p-6 shadow-xl shadow-indigo-200/30 dark:border-slate-800 dark:bg-slate-900/70"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="mb-4">
                        <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                          {roleLabel[prompt.role] ?? prompt.role}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                        {prompt.question}
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">
                            Gợi ý đánh giá
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {prompt.evaluationKeywords.map((keyword) => (
                              <span
                                key={keyword}
                                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm dark:bg-slate-800 dark:text-slate-300"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-xl bg-slate-50/80 p-4 dark:bg-slate-800/60">
                          <p className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300 mb-2">
                            💡 Hướng dẫn trả lời
                          </p>
                          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                            {prompt.guidance}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
