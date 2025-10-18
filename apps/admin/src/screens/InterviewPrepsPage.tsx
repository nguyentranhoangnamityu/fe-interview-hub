import { useEffect, useMemo, useState } from 'react'
import type { InterviewPrep } from '@fehub/types'
import { Button } from '@fehub/ui'
import clsx from 'clsx'
import { apiClient } from '../lib/apiClient'

type FormState = {
  id?: string
  company: string
  position: string
  location?: string
  logoUrl: string
  summary: string
  difficulty: 'easy' | 'medium' | 'hard'
  tagsText: string
  roundsJson: string
  overallTipsText: string
}

const defaultForm = (): FormState => ({
  company: '',
  position: '',
  location: '',
  logoUrl: '',
  summary: '',
  difficulty: 'medium',
  tagsText: '',
  roundsJson: '[]',
  overallTipsText: '',
})

const difficultyOptions: Array<{ value: FormState['difficulty']; label: string }> = [
  { value: 'easy', label: 'Dễ' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'hard', label: 'Khó' },
]

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

export const InterviewPrepsPage = () => {
  const [items, setItems] = useState<InterviewPrep[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formState, setFormState] = useState<FormState>(() => defaultForm())
  const [actionError, setActionError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiClient.getInterviewPreps()
      const list = Array.isArray(response.data) ? response.data : []
      const sorted = [...list].sort((a, b) => a.company.localeCompare(b.company))
      setItems(sorted)
    } catch (err) {
      setError((err as Error).message || 'Không thể tải dữ liệu phỏng vấn.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchData()
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) {
      return items
    }
    const query = search.trim().toLowerCase()
    return items.filter((item) => {
      const tokens = [
        item.company,
        item.position,
        item.location ?? '',
        item.difficulty ?? '',
        ...(item.tags ?? []),
      ]
      return tokens.some((token) => token.toLowerCase().includes(query))
    })
  }, [items, search])

  const handleCreateClick = () => {
    setFormState(defaultForm())
    setActionError(null)
    setFormOpen(true)
  }

  const handleEditClick = (prep: InterviewPrep) => {
    setFormState({
      id: prep.id,
      company: prep.company,
      position: prep.position,
      location: prep.location ?? '',
      logoUrl: prep.logoUrl,
      summary: prep.summary,
      difficulty: (prep.difficulty as FormState['difficulty']) ?? 'medium',
      tagsText: (prep.tags ?? []).join(', '),
      roundsJson: JSON.stringify(prep.rounds ?? [], null, 2),
      overallTipsText: (prep.overallTips ?? []).join('\n'),
    })
    setActionError(null)
    setFormOpen(true)
  }

  const handleDelete = async (prep: InterviewPrep) => {
    const confirmed = window.confirm(`Xoá interview prep của ${prep.company}?`)
    if (!confirmed) {
      return
    }
    try {
      await apiClient.deleteInterviewPrep(prep.id)
      void fetchData()
    } catch (err) {
      alert((err as Error).message || 'Không thể xoá bản ghi.')
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setActionError(null)
    setFormSubmitting(true)
    try {
      const tags =
        formState.tagsText
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean) ?? []
      let rounds
      try {
        rounds = JSON.parse(formState.roundsJson || '[]')
        if (!Array.isArray(rounds)) {
          throw new Error('Rounds phải là mảng')
        }
      } catch (err) {
        throw new Error(`Rounds JSON không hợp lệ: ${(err as Error).message}`)
      }
      const overallTips =
        formState.overallTipsText
          .split('\n')
          .map((tip) => tip.trim())
          .filter(Boolean) ?? []

      const payload = {
        company: formState.company.trim(),
        position: formState.position.trim(),
        location: formState.location?.trim() || undefined,
        logoUrl: formState.logoUrl.trim(),
        summary: formState.summary.trim(),
        difficulty: formState.difficulty,
        tags,
        rounds,
        overallTips,
      }

      if (!payload.company || !payload.position) {
        throw new Error('Company và Position là bắt buộc.')
      }

      if (formState.id) {
        await apiClient.updateInterviewPrep(formState.id, payload)
      } else {
        await apiClient.createInterviewPrep(payload)
      }

      setFormOpen(false)
      setFormState(defaultForm())
      void fetchData()
    } catch (err) {
      setActionError((err as Error).message || 'Không thể lưu dữ liệu.')
    } finally {
      setFormSubmitting(false)
    }
  }

  return (
    <div className="min-h-full bg-slate-50/80 px-6 py-8 dark:bg-slate-900/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-3xl border border-indigo-200/60 bg-white/95 p-6 shadow-lg shadow-indigo-200/40 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">
              Interview Management
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              Quản lý Interview Prep
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              Tạo, chỉnh sửa và quản lý bộ câu hỏi phỏng vấn theo từng công ty. Dữ liệu này được sử
              dụng cho trang Interview Prep của ứng viên.
            </p>
          </div>
          <Button onClick={handleCreateClick}>Thêm interview prep</Button>
        </header>

        <section className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-md dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              type="text"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-600/30 sm:max-w-xs"
              placeholder="Tìm kiếm theo công ty, vị trí, tag..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Tổng số: {items.length} bộ prep • Hiển thị: {filtered.length}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-200 p-12 text-slate-500 dark:border-slate-700 dark:text-slate-300">
              Đang tải dữ liệu...
            </div>
          ) : error ? (
            <div className="space-y-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-6 text-rose-600 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
              <p className="font-semibold">{error}</p>
              <Button variant="outline" onClick={() => void fetchData()}>
                Thử lại
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200/70 dark:border-slate-700">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50/80 dark:bg-slate-800/60">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Công ty
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Vị trí
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Vòng
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Cập nhật
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Độ khó
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900/60">
                  {filtered.map((prep) => (
                    <tr key={prep.id} className="hover:bg-indigo-50/40 dark:hover:bg-slate-800/80">
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {prep.company}
                        </div>
                        {prep.location ? (
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {prep.location}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                        {prep.position}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                        {prep.rounds.length}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                        <time dateTime={prep.lastUpdated}>{formatDate(prep.lastUpdated)}</time>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={clsx(
                            'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest',
                            prep.difficulty
                              ? {
                                  easy: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-200',
                                  medium:
                                    'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-200',
                                  hard: 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-200',
                                }[prep.difficulty] ?? 'bg-slate-100 text-slate-600'
                              : 'bg-slate-100 text-slate-600',
                          )}
                        >
                          {prep.difficulty ?? 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditClick(prep)}>
                            Chỉnh sửa
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(prep)}>
                            Xoá
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between px-6 pt-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {formState.id ? 'Chỉnh sửa Interview Prep' : 'Tạo Interview Prep mới'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Nhập dữ liệu JSON cho rounds (mảng các object) và mỗi tip trên một dòng.
                </p>
              </div>
              <button
                type="button"
                className="rounded-lg bg-slate-100 px-3 py-1 text-sm text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                onClick={() => setFormOpen(false)}
                disabled={formSubmitting}
              >
                Đóng
              </button>
            </div>

            <form
              className="mt-4 grid max-h-[70vh] grid-cols-1 gap-4 overflow-y-auto px-6 pb-6 md:grid-cols-2"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Công ty *
                </label>
                <input
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-600/30"
                  value={formState.company}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, company: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Vị trí *
                </label>
                <input
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-600/30"
                  value={formState.position}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, position: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Địa điểm
                </label>
                <input
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-600/30"
                  value={formState.location}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, location: event.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Logo URL
                </label>
                <input
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-600/30"
                  value={formState.logoUrl}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, logoUrl: event.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Độ khó
                </label>
                <select
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-600/30"
                  value={formState.difficulty}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      difficulty: event.target.value as FormState['difficulty'],
                    }))
                  }
                >
                  {difficultyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Tags (cách nhau bằng dấu phẩy)
                </label>
                <input
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-600/30"
                  value={formState.tagsText}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, tagsText: event.target.value }))
                  }
                />
              </div>
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Tóm tắt
                </label>
                <textarea
                  className="min-h-[100px] rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-600/30"
                  value={formState.summary}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, summary: event.target.value }))
                  }
                />
              </div>
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Rounds (JSON format)
                </label>
                <textarea
                  className="min-h-[160px] rounded-xl border border-slate-200 bg-white px-4 py-2 font-mono text-xs text-slate-700 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-600/30"
                  value={formState.roundsJson}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, roundsJson: event.target.value }))
                  }
                />
              </div>
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Overall Tips (mỗi dòng là một tip)
                </label>
                <textarea
                  className="min-h-[120px] rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-600/30"
                  value={formState.overallTipsText}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, overallTipsText: event.target.value }))
                  }
                />
              </div>

              {actionError ? (
                <div className="md:col-span-2 rounded-lg border border-rose-200 bg-rose-50/90 px-4 py-2 text-sm text-rose-600 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
                  {actionError}
                </div>
              ) : null}

              <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  onClick={() => setFormOpen(false)}
                  disabled={formSubmitting}
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
                  disabled={formSubmitting}
                >
                  {formSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
