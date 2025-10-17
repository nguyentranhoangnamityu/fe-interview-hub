import { nanoid } from 'nanoid'
import type {
  CreateLessonPayload,
  Lesson,
  LessonProgress,
  LessonProgressStatus,
  LessonQuizResult,
  TechStack,
  UpdateLessonPayload,
} from '@fehub/types'

import { query } from '../db/client'

type User = {
  id: string
  name: string
  email: string
  picture?: string
  joinDate: string
  status: 'active' | 'suspended'
}

type CreateUserPayload = {
  id?: string
  name: string
  email: string
  picture?: string
}

type UpdateUserPayload = {
  name?: string
  email?: string
  picture?: string
  status?: 'active' | 'suspended'
}

type UserStats = {
  totalLessons: number
  completedLessons: number
  inProgressLessons: number
  completionRate: number
  totalTimeSpent: number
  averageTimePerLesson: number
}

type AdminDashboardStats = {
  totalUsers: number
  totalLessons: number
  totalProgress: number
  averageCompletionRate: number
  recentSignups: number
  activeUsers: number
}

type Activity = {
  id: string
  type: 'user_signup' | 'lesson_completed' | 'lesson_created' | 'user_suspended'
  message: string
  timestamp: string
  userId?: string
  lessonId?: string
}

type ProgressOverview = {
  totalUsers: number
  totalLessons: number
  completedLessons: number
  inProgressLessons: number
  notStartedLessons: number
  averageCompletionRate: number
}

type StatsByTechStack = {
  techStack: string
  totalLessons: number
  completedLessons: number
  completionRate: number
}[]

type StatsByTime = {
  period: string
  data: {
    date: string
    completed: number
    inProgress: number
    newUsers: number
  }[]
}

type LessonRow = {
  id: string
  title: string
  description: string
  difficulty: string
  estimated_time: number
  tech_stack_id: string
  tags: unknown
  sections: unknown
  resources: unknown
  cover_image: unknown
  quizzes: unknown
  mock_prompts: unknown
  origin: string
}

type TechStackRow = {
  id: string
  name: string
  description: string
  logo: string
  color: string
  lessons: unknown
}

type LessonProgressRow = {
  user_id: string
  lesson_id: string
  status: string
  completed_section_ids: unknown
  updated_at: Date
}

type LessonQuizResultRow = {
  user_id: string
  lesson_id: string
  answers: unknown
  score: number
  total_points: number
  completed_at: Date | null
}

const parseJson = <T>(value: unknown, fallback: T): T => {
  if (value === undefined || value === null) {
    return fallback
  }
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T
    } catch {
      return fallback
    }
  }
  return value as T
}

const toStringArray = (value: unknown): string[] => {
  const arr = parseJson<string[]>(value, [])
  return Array.isArray(arr) ? arr.map((item) => String(item)) : []
}

const mapLessonRow = (row: LessonRow): Lesson => {
  const resources = parseJson<Lesson['resources'] | null>(row.resources, null)
  const coverImage = parseJson<Lesson['coverImage'] | null>(row.cover_image, null)
  const quizzes = parseJson<Lesson['quizzes'] | null>(row.quizzes, null)
  const mockPrompts = parseJson<Lesson['mockPrompts'] | null>(row.mock_prompts, null)
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    difficulty: row.difficulty,
    estimatedTime: row.estimated_time,
    techStack: row.tech_stack_id,
    tags: toStringArray(row.tags),
    sections: parseJson<Lesson['sections']>(row.sections, []),
    resources: resources ?? undefined,
    coverImage: coverImage ?? undefined,
    quizzes: quizzes ?? undefined,
    mockPrompts: mockPrompts ?? undefined,
    origin: (row.origin as Lesson['origin']) ?? undefined,
  }
}

const mapTechStackRow = (row: TechStackRow): TechStack => ({
  id: row.id,
  name: row.name,
  description: row.description,
  logo: row.logo,
  color: row.color,
  lessons: toStringArray(row.lessons),
})

const mapProgressRow = (row: LessonProgressRow): LessonProgress => ({
  status: row.status as LessonProgressStatus,
  completedSectionIds: toStringArray(row.completed_section_ids),
  updatedAt: row.updated_at.toISOString(),
})

const mapQuizResultRow = (row: LessonQuizResultRow): LessonQuizResult => ({
  answers: parseJson<LessonQuizResult['answers']>(row.answers, {}),
  score: row.score,
  totalPoints: row.total_points,
  completedAt: row.completed_at ? row.completed_at.toISOString() : null,
})

const serializeJson = (value: unknown) => JSON.stringify(value ?? null)
const serializeOptionalJson = (value: unknown) => (value === undefined ? null : JSON.stringify(value))

const buildLessonUpdate = (updates: UpdateLessonPayload) => {
  const sets: string[] = []
  const values: unknown[] = []
  let index = 1

  const assign = (column: string, value: unknown) => {
    sets.push(`${column} = $${index}`)
    values.push(value)
    index += 1
  }

  if (updates.title !== undefined) assign('title', updates.title)
  if (updates.description !== undefined) assign('description', updates.description)
  if (updates.difficulty !== undefined) assign('difficulty', updates.difficulty)
  if (updates.estimatedTime !== undefined) assign('estimated_time', updates.estimatedTime)
  if (updates.techStack !== undefined) assign('tech_stack_id', updates.techStack)
  if (updates.tags !== undefined) assign('tags', serializeJson(updates.tags ?? []))
  if (updates.sections !== undefined) assign('sections', serializeJson(updates.sections ?? []))
  if (updates.resources !== undefined) assign('resources', serializeOptionalJson(updates.resources))
  if (updates.coverImage !== undefined) assign('cover_image', serializeOptionalJson(updates.coverImage))
  if (updates.quizzes !== undefined) assign('quizzes', serializeOptionalJson(updates.quizzes))
  if (updates.mockPrompts !== undefined) assign('mock_prompts', serializeOptionalJson(updates.mockPrompts))

  return { sets, values }
}

export const knowledgeBaseRepository = {
  async getTechStacks(): Promise<TechStack[]> {
    const { rows } = await query<TechStackRow>(`
      SELECT
        ts.id,
        ts.name,
        ts.description,
        ts.logo,
        ts.color,
        COALESCE(jsonb_agg(l.id) FILTER (WHERE l.id IS NOT NULL), '[]'::jsonb) AS lessons
      FROM tech_stacks ts
      LEFT JOIN lessons l ON l.tech_stack_id = ts.id
      GROUP BY ts.id
      ORDER BY ts.name
    `)
    return rows.map(mapTechStackRow)
  },

  async getTechStacksRecord(): Promise<Record<string, TechStack>> {
    const stacks = await this.getTechStacks()
    return stacks.reduce<Record<string, TechStack>>((acc, stack) => {
      acc[stack.id] = stack
      return acc
    }, {})
  },

  async listLessons(): Promise<Lesson[]> {
    const { rows } = await query<LessonRow>('SELECT * FROM lessons ORDER BY title ASC')
    return rows.map(mapLessonRow)
  },

  async listLessonsByTechStack(techStackId: string): Promise<Lesson[]> {
    const { rows } = await query<LessonRow>(
      'SELECT * FROM lessons WHERE tech_stack_id = $1 ORDER BY title ASC',
      [techStackId],
    )
    return rows.map(mapLessonRow)
  },

  async getLesson(lessonId: string): Promise<Lesson | undefined> {
    const { rows } = await query<LessonRow>('SELECT * FROM lessons WHERE id = $1 LIMIT 1', [lessonId])
    const row = rows[0]
    return row ? mapLessonRow(row) : undefined
  },

  async createLesson(payload: CreateLessonPayload): Promise<Lesson> {
    const id = payload.id && payload.id.trim() ? payload.id : nanoid(12)
    const { rows } = await query<LessonRow>(
      `
        INSERT INTO lessons (
          id,
          title,
          description,
          difficulty,
          estimated_time,
          tech_stack_id,
          tags,
          sections,
          resources,
          cover_image,
          quizzes,
          mock_prompts,
          origin
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11,
          $12,
          'custom'
        )
        RETURNING *
      `,
      [
        id,
        payload.title,
        payload.description,
        payload.difficulty,
        payload.estimatedTime,
        payload.techStack,
        serializeJson(payload.tags ?? []),
        serializeJson(payload.sections),
        serializeOptionalJson(payload.resources),
        serializeOptionalJson(payload.coverImage),
        serializeOptionalJson(payload.quizzes),
        serializeOptionalJson(payload.mockPrompts),
      ],
    )
    const row = rows[0]
    if (!row) {
      throw new Error('Failed to create lesson')
    }
    return mapLessonRow(row)
  },

  async updateLesson(id: string, updates: UpdateLessonPayload): Promise<Lesson | undefined> {
    const { sets, values } = buildLessonUpdate(updates)
    if (sets.length === 0) {
      return this.getLesson(id)
    }
    const { rows } = await query<LessonRow>(
      `UPDATE lessons SET ${sets.join(', ')} WHERE id = $${sets.length + 1} RETURNING *`,
      [...values, id],
    )
    const row = rows[0]
    return row ? mapLessonRow(row) : undefined
  },

  async deleteLesson(id: string): Promise<boolean> {
    const result = await query('DELETE FROM lessons WHERE id = $1', [id])
    return (result.rowCount ?? 0) > 0
  },

  async listProgressForUser(userId: string): Promise<Record<string, LessonProgress>> {
    const { rows } = await query<LessonProgressRow>(
      'SELECT * FROM lesson_progress WHERE user_id = $1',
      [userId],
    )
    const progressMap: Record<string, LessonProgress> = {}
    rows.forEach((row: LessonProgressRow) => {
      progressMap[row.lesson_id] = mapProgressRow(row)
    })
    return progressMap
  },

  async saveProgress(
    userId: string,
    lessonId: string,
    progress: LessonProgress,
  ): Promise<LessonProgress> {
    const { rows } = await query<LessonProgressRow>(
      `
        INSERT INTO lesson_progress (user_id, lesson_id, status, completed_section_ids, updated_at)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (user_id, lesson_id) DO UPDATE SET
          status = EXCLUDED.status,
          completed_section_ids = EXCLUDED.completed_section_ids,
          updated_at = EXCLUDED.updated_at
        RETURNING *
      `,
      [
        userId,
        lessonId,
        progress.status,
        serializeJson(progress.completedSectionIds ?? []),
        new Date(progress.updatedAt),
      ],
    )
    const row = rows[0]
    if (!row) {
      throw new Error('Failed to save progress')
    }
    return mapProgressRow(row)
  },

  async deleteProgress(userId: string, lessonId: string): Promise<void> {
    await query('DELETE FROM lesson_progress WHERE user_id = $1 AND lesson_id = $2', [userId, lessonId])
  },

  async listQuizResultsForUser(userId: string): Promise<Record<string, LessonQuizResult>> {
    const { rows } = await query<LessonQuizResultRow>(
      'SELECT * FROM lesson_quiz_results WHERE user_id = $1',
      [userId],
    )
    const results: Record<string, LessonQuizResult> = {}
    rows.forEach((row: LessonQuizResultRow) => {
      results[row.lesson_id] = mapQuizResultRow(row)
    })
    return results
  },

  async saveQuizResult(
    userId: string,
    lessonId: string,
    result: LessonQuizResult,
  ): Promise<LessonQuizResult> {
    const { rows } = await query<LessonQuizResultRow>(
      `
        INSERT INTO lesson_quiz_results (user_id, lesson_id, answers, score, total_points, completed_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (user_id, lesson_id) DO UPDATE SET
          answers = EXCLUDED.answers,
          score = EXCLUDED.score,
          total_points = EXCLUDED.total_points,
          completed_at = EXCLUDED.completed_at
        RETURNING *
      `,
      [
        userId,
        lessonId,
        serializeJson(result.answers ?? {}),
        result.score,
        result.totalPoints,
        result.completedAt ? new Date(result.completedAt) : null,
      ],
    )
    const row = rows[0]
    if (!row) {
      throw new Error('Failed to save quiz result')
    }
    return mapQuizResultRow(row)
  },

  async deleteQuizResult(userId: string, lessonId: string): Promise<void> {
    await query('DELETE FROM lesson_quiz_results WHERE user_id = $1 AND lesson_id = $2', [
      userId,
      lessonId,
    ])
  },

  // User management methods
  async listUsers(options: { page: number; limit: number; status?: string }): Promise<{ users: User[]; total: number; page: number; limit: number }> {
    const offset = (options.page - 1) * options.limit
    let whereClause = ''
    let params: any[] = [options.limit, offset]
    
    if (options.status) {
      whereClause = 'WHERE status = $3'
      params = [options.limit, offset, options.status]
    }

    const { rows } = await query<User>(
      `SELECT id, name, email, picture, join_date as "joinDate", status FROM users ${whereClause} ORDER BY join_date DESC LIMIT $1 OFFSET $2`,
      params
    )

    const { rows: countRows } = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM users ${whereClause}`,
      options.status ? [options.status] : []
    )

    return {
      users: rows,
      total: parseInt(countRows[0]?.count || '0'),
      page: options.page,
      limit: options.limit,
    }
  },

  async getUser(userId: string): Promise<User | undefined> {
    const { rows } = await query<User>(
      'SELECT id, name, email, picture, join_date as "joinDate", status FROM users WHERE id = $1',
      [userId]
    )
    return rows[0]
  },

  async createUser(payload: CreateUserPayload): Promise<User> {
    const id = payload.id && payload.id.trim() ? payload.id.trim() : nanoid()
    const { rows } = await query<User>(
      `INSERT INTO users (id, name, email, picture, join_date, status) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, name, email, picture, join_date as "joinDate", status`,
      [id, payload.name, payload.email, payload.picture ?? null, new Date().toISOString(), 'active']
    )
    return rows[0]
  },

  async syncUser(payload: { id: string; name: string; email: string; picture?: string }): Promise<User> {
    const { rows } = await query<User>(
      `INSERT INTO users (id, name, email, picture, join_date, status)
       VALUES ($1, $2, $3, $4, $5, 'active')
       ON CONFLICT (id) DO UPDATE
       SET name = EXCLUDED.name,
           email = EXCLUDED.email,
           picture = EXCLUDED.picture,
           status = 'active'
       RETURNING id, name, email, picture, join_date as "joinDate", status`,
      [payload.id, payload.name, payload.email, payload.picture ?? null, new Date().toISOString()]
    )
    return rows[0]
  },

  async updateUser(userId: string, updates: UpdateUserPayload): Promise<User | undefined> {
    const setClause = []
    const params = []
    let paramIndex = 1

    if (updates.name !== undefined) {
      setClause.push(`name = $${paramIndex++}`)
      params.push(updates.name)
    }
    if (updates.email !== undefined) {
      setClause.push(`email = $${paramIndex++}`)
      params.push(updates.email)
    }
    if (updates.picture !== undefined) {
      setClause.push(`picture = $${paramIndex++}`)
      params.push(updates.picture)
    }
    if (updates.status !== undefined) {
      setClause.push(`status = $${paramIndex++}`)
      params.push(updates.status)
    }

    if (setClause.length === 0) {
      return this.getUser(userId)
    }

    params.push(userId)
    const { rows } = await query<User>(
      `UPDATE users SET ${setClause.join(', ')} WHERE id = $${paramIndex} 
       RETURNING id, name, email, picture, join_date as "joinDate", status`,
      params
    )
    return rows[0]
  },

  async deleteUser(userId: string): Promise<boolean> {
    const { rowCount } = await query('DELETE FROM users WHERE id = $1', [userId])
    return rowCount > 0
  },

  async getUserStats(userId: string): Promise<UserStats> {
    const { rows } = await query<{
      total_lessons: string
      completed_lessons: string
      in_progress_lessons: string
      total_time: string
    }>(
      `SELECT 
        COUNT(DISTINCT l.id) as total_lessons,
        COUNT(CASE WHEN lp.status = 'completed' THEN 1 END) as completed_lessons,
        COUNT(CASE WHEN lp.status = 'in_progress' THEN 1 END) as in_progress_lessons,
        COALESCE(SUM(l.estimated_time), 0) as total_time
       FROM lessons l
       LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = $1`,
      [userId]
    )

    const stats = rows[0]
    const totalLessons = parseInt(stats?.total_lessons || '0')
    const completedLessons = parseInt(stats?.completed_lessons || '0')
    const inProgressLessons = parseInt(stats?.in_progress_lessons || '0')
    const totalTimeSpent = parseInt(stats?.total_time || '0')

    return {
      totalLessons,
      completedLessons,
      inProgressLessons,
      completionRate: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0,
      totalTimeSpent,
      averageTimePerLesson: completedLessons > 0 ? totalTimeSpent / completedLessons : 0,
    }
  },

  // Admin dashboard methods
  async getAdminDashboardStats(): Promise<AdminDashboardStats> {
    const { rows } = await query<{
      total_users: string
      total_lessons: string
      total_progress: string
      recent_signups: string
      active_users: string
    }>(
      `SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM lessons) as total_lessons,
        (SELECT COUNT(*) FROM lesson_progress WHERE status = 'completed') as total_progress,
        (SELECT COUNT(*) FROM users WHERE join_date >= NOW() - INTERVAL '7 days') as recent_signups,
        (SELECT COUNT(*) FROM users WHERE status = 'active') as active_users`
    )

    const stats = rows[0]
    const totalUsers = parseInt(stats?.total_users || '0')
    const totalLessons = parseInt(stats?.total_lessons || '0')
    const totalProgress = parseInt(stats?.total_progress || '0')

    return {
      totalUsers,
      totalLessons,
      totalProgress,
      averageCompletionRate: totalLessons > 0 ? (totalProgress / (totalUsers * totalLessons)) * 100 : 0,
      recentSignups: parseInt(stats?.recent_signups || '0'),
      activeUsers: parseInt(stats?.active_users || '0'),
    }
  },

  async getRecentActivities(limit: number): Promise<Activity[]> {
    // Mock data for now - in real implementation, this would come from an activities table
    return [
      {
        id: nanoid(),
        type: 'lesson_completed',
        message: 'Bài học "React Hooks" đã được hoàn thành',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        userId: 'user1',
        lessonId: 'lesson1',
      },
      {
        id: nanoid(),
        type: 'user_signup',
        message: 'Người dùng mới đã đăng ký',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        userId: 'user2',
      },
      {
        id: nanoid(),
        type: 'lesson_created',
        message: 'Bài học "TypeScript Advanced" đã được tạo',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        lessonId: 'lesson3',
      },
    ].slice(0, limit)
  },

  async getProgressOverview(): Promise<ProgressOverview> {
    const { rows } = await query<{
      total_users: string
      total_lessons: string
      completed_lessons: string
      in_progress_lessons: string
    }>(
      `SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM lessons) as total_lessons,
        (SELECT COUNT(*) FROM lesson_progress WHERE status = 'completed') as completed_lessons,
        (SELECT COUNT(*) FROM lesson_progress WHERE status = 'in_progress') as in_progress_lessons`
    )

    const stats = rows[0]
    const totalUsers = parseInt(stats?.total_users || '0')
    const totalLessons = parseInt(stats?.total_lessons || '0')
    const completedLessons = parseInt(stats?.completed_lessons || '0')
    const inProgressLessons = parseInt(stats?.in_progress_lessons || '0')
    const notStartedLessons = totalLessons - completedLessons - inProgressLessons

    return {
      totalUsers,
      totalLessons,
      completedLessons,
      inProgressLessons,
      notStartedLessons,
      averageCompletionRate: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0,
    }
  },

  async getStatsByTechStack(): Promise<StatsByTechStack> {
    const { rows } = await query<{
      tech_stack: string
      total_lessons: string
      completed_lessons: string
    }>(
      `SELECT 
        ts.name as tech_stack,
        COUNT(l.id) as total_lessons,
        COUNT(CASE WHEN lp.status = 'completed' THEN 1 END) as completed_lessons
       FROM tech_stacks ts
       LEFT JOIN lessons l ON ts.id = l.tech_stack_id
       LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id
       GROUP BY ts.id, ts.name
       ORDER BY total_lessons DESC`
    )

    return rows.map(row => ({
      techStack: row.tech_stack,
      totalLessons: parseInt(row.total_lessons),
      completedLessons: parseInt(row.completed_lessons),
      completionRate: parseInt(row.total_lessons) > 0 ? (parseInt(row.completed_lessons) / parseInt(row.total_lessons)) * 100 : 0,
    }))
  },

  async getStatsByTime(period: string): Promise<StatsByTime> {
    // Mock data for now - in real implementation, this would query actual time-based data
    const data = []
    const days = period === 'week' ? 7 : period === 'month' ? 30 : 7
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      data.push({
        date: date.toISOString().split('T')[0],
        completed: Math.floor(Math.random() * 10) + 5,
        inProgress: Math.floor(Math.random() * 5) + 2,
        newUsers: Math.floor(Math.random() * 3) + 1,
      })
    }

    return {
      period,
      data,
    }
  },
}
