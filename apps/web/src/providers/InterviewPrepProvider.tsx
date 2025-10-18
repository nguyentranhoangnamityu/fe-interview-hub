import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { InterviewPrep } from '@fehub/types'

import { apiClient } from '../lib/apiClient'

type InterviewPrepContextValue = {
  companies: InterviewPrep[]
  companiesById: Record<string, InterviewPrep>
  loading: boolean
  error: string | null
  getInterviewPrep: (id: string) => InterviewPrep | undefined
  refresh: () => Promise<void>
}

const InterviewPrepContext = createContext<InterviewPrepContextValue | undefined>(undefined)

export const InterviewPrepProvider = ({ children }: { children: ReactNode }) => {
  const [companies, setCompanies] = useState<InterviewPrep[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadCompanies = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiClient.listInterviewPreps()
      setCompanies(result)
    } catch (err) {
      console.error('Failed to load interview preps', err)
      setError('Không thể tải dữ liệu phỏng vấn. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadCompanies()
  }, [loadCompanies])

  const companiesById = useMemo(() => {
    return companies.reduce<Record<string, InterviewPrep>>((record, company) => {
      record[company.id] = company
      return record
    }, {})
  }, [companies])

  const getInterviewPrep = useCallback(
    (id: string) => {
      return companiesById[id]
    },
    [companiesById],
  )

  const value = useMemo(
    () => ({
      companies,
      companiesById,
      loading,
      error,
      getInterviewPrep,
      refresh: loadCompanies,
    }),
    [companies, companiesById, loading, error, getInterviewPrep, loadCompanies],
  )

  return <InterviewPrepContext.Provider value={value}>{children}</InterviewPrepContext.Provider>
}

export const useInterviewPrep = () => {
  const context = useContext(InterviewPrepContext)
  if (!context) {
    throw new Error('useInterviewPrep must be used within InterviewPrepProvider')
  }
  return context
}

