import { Link } from 'react-router-dom'
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

export const ComponentInterviewReviewListPage = () => {
  const { companies, loading, error, refresh } = useInterviewPrep()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50 px-4 py-10 sm:px-6 lg:px-12 xl:px-16 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div className="rounded-3xl border border-amber-200/70 bg-amber-50/80 p-6 text-amber-700 shadow-lg shadow-amber-200/40 backdrop-blur dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 text-amber-500 shadow-inner ring-1 ring-amber-200 dark:bg-slate-900/80 dark:text-amber-300 dark:ring-amber-500/40">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em]">Cảnh báo</p>
              <p className="mt-2 text-sm leading-relaxed">
                Nội dung trên trang được thu thập từ internet và các cộng đồng chia sẻ kinh nghiệm.
                FE Interview Hub không chịu trách nhiệm về tính chính xác hoặc đầy đủ của thông tin.
              </p>
            </div>
          </div>
        </div>

        <header className="rounded-3xl border border-indigo-200/60 bg-white/95 p-8 shadow-xl shadow-indigo-200/40 backdrop-blur dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-none">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-600 shadow-inner dark:bg-indigo-500/10 dark:text-indigo-300">
                <svg
                  className="h-7 w-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-2 10v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2m-4-4h16"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.4em] text-indigo-500">
                  Interview Prep Hub
                </p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  Component Interview Review
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  Khám phá các bộ kinh nghiệm phỏng vấn theo từng công ty: thông tin tổng quan, từng
                  vòng phỏng vấn, câu hỏi thực tế và chiến lược chuẩn bị. Nhấp vào một công ty để
                  xem chi tiết lộ trình và tips cho vị trí bạn quan tâm.
                </p>
              </div>
            </div>
            <div className="flex gap-3 lg:flex-col lg:items-end">
              <div className="rounded-2xl border border-indigo-200/70 bg-indigo-50/80 px-5 py-4 text-center text-indigo-700 shadow-sm dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200">
                <p className="text-xs font-semibold uppercase tracking-[0.3em]">Bộ phỏng vấn</p>
                <p className="mt-1 text-2xl font-bold">{companies.length}</p>
              </div>
              <Button variant="outline" onClick={() => void refresh()}>
                Làm mới dữ liệu
              </Button>
            </div>
          </div>
        </header>

        <section className="space-y-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Danh sách công ty
          </h2>
          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 text-center text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900/75 dark:text-slate-300">
              <svg
                className="mx-auto h-10 w-10 animate-spin text-indigo-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-9-9" />
              </svg>
              <p className="mt-3 font-semibold">Đang tải dữ liệu phỏng vấn...</p>
            </div>
          ) : error ? (
            <div className="space-y-4 rounded-3xl border border-rose-200 bg-rose-50/90 p-8 text-center text-rose-600 shadow-sm dark:border-rose-500/40 dark:bg-rose-500/15 dark:text-rose-200">
              <p className="font-semibold">{error}</p>
              <Button onClick={() => void refresh()} variant="outline">
                Thử lại
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {companies.map((company) => (
                <Link
                  key={company.id}
                  to={`/component-interview-review/${company.id}`}
                  className="group flex h-full flex-col gap-4 overflow-hidden rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/75"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-inner ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
                      <img
                        src={getCompanyLogo(company.id, company.logoUrl)}
                        alt={`${company.company} logo`}
                        className="h-12 w-12 object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">
                        {company.company}
                      </p>
                      <p className="mt-1 text-lg font-semibold text-slate-900 transition group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-200">
                        {company.position}
                      </p>
                      {company.location ? (
                        <p className="text-xs text-slate-500 dark:text-slate-400">{company.location}</p>
                      ) : null}
                    </div>
                  </div>
                  <p className="line-clamp-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {company.summary}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      Cập nhật:{' '}
                      <time dateTime={company.lastUpdated}>{formatDate(company.lastUpdated)}</time>
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
                  {company.tags && company.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {company.tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-indigo-100/80 px-3 py-1 text-xs font-medium uppercase tracking-wide text-indigo-700 transition group-hover:bg-indigo-500/10 dark:bg-indigo-500/15 dark:text-indigo-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <div className="flex items-center justify-between text-xs font-semibold text-indigo-500 dark:text-indigo-200">
                    <span className="inline-flex items-center gap-2">
                      Xem chi tiết
                      <svg
                        className="h-3 w-3 transition group-hover:translate-x-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
                      </svg>
                    </span>
                    <span>{company.rounds.length} vòng</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
