import { useEffect, useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@fehub/ui'
import { cn } from '@fehub/ui'

import { useInterviewPrep } from '../providers/InterviewPrepProvider'
import { getCompanyLogo } from '../constants/companyLogos'

const difficultyBadge: Record<string, string> = {
  easy: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-200',
  medium: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-200',
  hard: 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-200',
}

const formatDate = (value: string) => {
  try {
    return new Date(value).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return value
  }
}

export const ComponentInterviewReviewDetailPage = () => {
  const navigate = useNavigate()
  const { prepId } = useParams<{ prepId: string }>()
  const { loading, error, refresh, getInterviewPrep } = useInterviewPrep()

  const company = useMemo(
    () => (prepId ? getInterviewPrep(prepId) : undefined),
    [getInterviewPrep, prepId],
  )

  useEffect(() => {
    if (loading || !prepId) {
      return
    }
    if (!company && !error) {
      // Không tìm thấy, quay lại trang danh sách
      navigate('/component-interview-review', { replace: true })
    }
  }, [company, error, loading, navigate, prepId])

  if (!prepId) {
    return null
  }

  if (loading && !company) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="rounded-3xl border border-slate-200 bg-white/95 px-8 py-10 text-center shadow-md dark:border-slate-800 dark:bg-slate-900/75">
          <svg
            className="mx-auto h-12 w-12 animate-spin text-indigo-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-9-9" />
          </svg>
          <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-300">
            Đang tải thông tin phỏng vấn...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50 px-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="space-y-4 rounded-3xl border border-rose-200 bg-rose-50/90 px-8 py-10 text-center text-rose-600 shadow-sm dark:border-rose-500/40 dark:bg-rose-500/15 dark:text-rose-200">
          <p className="font-semibold">{error}</p>
          <Button onClick={() => void refresh()} variant="outline">
            Thử lại
          </Button>
          <Button asChild>
            <Link to="/component-interview-review">Quay lại danh sách</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!company) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50 px-4 py-10 sm:px-6 lg:px-12 xl:px-16 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-6 rounded-3xl border border-indigo-200/60 bg-white/95 p-8 shadow-xl shadow-indigo-200/40 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg ring-2 ring-indigo-100 dark:bg-slate-950 dark:ring-slate-700">
                <img
                  src={getCompanyLogo(company.id, company.logoUrl)}
                  alt={`${company.company} logo`}
                  className="h-12 w-12 object-contain"
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">
                  {company.company}
                </p>
                <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                  {company.position}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                  {company.location ? (
                    <span className="inline-flex items-center gap-1">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M12 21s-6-4.35-6-10a6 6 0 0 1 12 0c0 5.65-6 10-6 10Z"
                        />
                        <circle cx="12" cy="11" r="2" />
                      </svg>
                      {company.location}
                    </span>
                  ) : null}
                  <span>
                    Cập nhật:{' '}
                    <time dateTime={company.lastUpdated}>{formatDate(company.lastUpdated)}</time>
                  </span>
                  <span>
                    Tổng số vòng: <strong>{company.rounds.length}</strong>
                  </span>
                  {company.difficulty ? (
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-3 py-1 font-semibold uppercase tracking-widest',
                        difficultyBadge[company.difficulty] ?? difficultyBadge.medium,
                      )}
                    >
                      {company.difficulty}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 md:flex-col md:items-end">
              <Button asChild variant="outline">
                <Link to="/component-interview-review">← Quay lại danh sách</Link>
              </Button>
            </div>
          </div>

          {company.tags && company.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {company.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-indigo-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        <section className="rounded-3xl border border-slate-200/70 bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6 text-sm text-slate-700 shadow-lg dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">
            Tóm tắt quy trình
          </p>
          <p className="mt-3 leading-relaxed">{company.summary}</p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Các vòng phỏng vấn ({company.rounds.length})
          </h2>
          <div className="flex flex-col gap-6">
            {company.rounds.map((round, index) => (
              <article
                key={round.id}
                className="rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/75"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">
                        Vòng {index + 1}
                      </span>
                      {round.duration ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          <svg
                            className="h-3.5 w-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <circle cx="12" cy="12" r="9" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
                          </svg>
                          {round.duration}
                        </span>
                      ) : null}
                      {round.format ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-200">
                          <svg
                            className="h-3.5 w-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-2 10v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2m-4-4h16"
                            />
                          </svg>
                          {round.format}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                      {round.title}
                    </h3>
                  </div>
                </div>

                {round.description ? (
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {round.description}
                  </p>
                ) : null}

                {round.focusAreas && round.focusAreas.length > 0 ? (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                      Key focus
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {round.focusAreas.map((area) => (
                        <span
                          key={area}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {round.sampleQuestions && round.sampleQuestions.length > 0 ? (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                      Câu hỏi thường gặp
                    </p>
                    <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      {round.sampleQuestions.map((question) => (
                        <li
                          key={question}
                          className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/80"
                        >
                          <span className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500" />
                          <span>{question}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {round.tips && round.tips.length > 0 ? (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                      Tips & chuẩn bị
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
                      {round.tips.map((tip) => (
                        <li key={tip}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {round.resources && round.resources.length > 0 ? (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                      Tài liệu tham khảo
                    </p>
                    <div className="mt-2 flex flex-col gap-2">
                      {round.resources.map((resource) => (
                        <a
                          key={resource.url}
                          href={resource.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-200 dark:hover:bg-indigo-500/20"
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m7 17 10-10m0 0h-7m7 0v7" />
                          </svg>
                          {resource.title}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        {company.overallTips && company.overallTips.length > 0 ? (
          <section className="rounded-3xl border border-indigo-200/60 bg-indigo-50/90 p-6 text-sm text-indigo-700 shadow-md dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200">
            <p className="text-xs font-semibold uppercase tracking-[0.3em]">Tổng kết</p>
            <ul className="mt-3 space-y-2">
              {company.overallTips.map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <svg
                    className="mt-0.5 h-4 w-4 text-indigo-500 dark:text-indigo-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  )
}
