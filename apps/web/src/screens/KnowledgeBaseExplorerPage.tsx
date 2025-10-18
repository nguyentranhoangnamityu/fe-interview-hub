import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { TechStackLogo } from '../components/TechStackLogo'
import { useKnowledgeBase } from '../providers/KnowledgeBaseProvider'

type StackMeta = {
  id: string
  name: string
  description: string
  logo: string
  color: string
  lessonCount: number
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

export const KnowledgeBaseExplorerPage = () => {
  const { lessons, techStacks, getLessonsByTechStack } = useKnowledgeBase()

  const stacks = useMemo<StackMeta[]>(() => {
    return Object.values(techStacks)
      .map((stack) => ({
        id: stack.id,
        name: stack.name,
        description: stack.description,
        logo: stack.logo,
        color: stack.color,
        lessonCount: getLessonsByTechStack(stack.id).length,
      }))
      .sort((a, b) => b.lessonCount - a.lessonCount || a.name.localeCompare(b.name))
  }, [techStacks, getLessonsByTechStack, lessons])

  return (
    <div className="min-h-screen bg-slate-50/50 px-4 py-8 sm:px-6 lg:px-10 xl:px-12 dark:bg-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <section className="relative overflow-hidden rounded-3xl border border-indigo-100/60 bg-white/80 p-8 shadow-xl shadow-indigo-200/30 dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-none sm:p-10">
          <div className="absolute -left-16 top-1/2 hidden h-40 w-40 -translate-y-1/2 rounded-full bg-indigo-200/30 blur-2xl dark:bg-indigo-500/10 lg:block" />
          <div className="absolute -right-20 -top-10 hidden h-48 w-48 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-500/10 lg:block" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm font-medium uppercase tracking-widest text-indigo-500 dark:text-indigo-300">
                Knowledge Base Explorer
              </p>
              <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl dark:text-white">
                Khám phá kho kiến thức theo Tech Stack
              </h1>
              <p className="text-base text-slate-600 sm:text-lg dark:text-slate-300">
                Chọn công nghệ bạn quan tâm, theo dõi tiến độ học tập và truy cập nhanh tới các bài học
                trọng tâm được tuyển chọn cho từng stack.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Tech Stack
          </h2>
          <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
            Các công nghệ bạn có thể học
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {stacks.map((stack) => (
              <Link
                key={stack.id}
                to={`/knowledge-base/explorer/${stack.id}`}
                className={[
                  'group relative flex h-full flex-col gap-4 rounded-3xl border bg-white/80 p-6 text-left transition-all duration-300',
                  'hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-200/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                  'dark:bg-slate-900/80 dark:border-slate-800 dark:hover:shadow-none',
                ].join(' ')}
                style={{
                  background: `linear-gradient(135deg, ${withAlpha(stack.color, 0.08)}, ${withAlpha(
                    stack.color,
                    0.02,
                  )})`,
                  borderColor: withAlpha(stack.color, 0.3),
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 p-2 shadow-lg ring-1 ring-white/40 dark:bg-slate-900/80 dark:ring-slate-700/80">
                    <TechStackLogo
                      techStackId={stack.id}
                      name={stack.name}
                      fallback={stack.logo}
                      className="h-full w-full"
                    />
                  </span>
                  <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-900/70 dark:text-slate-200">
                    {stack.lessonCount} bài học
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{stack.name}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{stack.description}</p>
                </div>
                <div className="mt-auto flex items-center justify-between text-sm font-medium text-indigo-600 transition group-hover:text-indigo-700 dark:text-indigo-300 dark:group-hover:text-indigo-200">
                  <span>Xem bài học</span>
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
