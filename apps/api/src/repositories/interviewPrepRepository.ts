import { nanoid } from 'nanoid'
import type {
  CreateInterviewPrepPayload,
  InterviewPrep,
  InterviewRound,
  UpdateInterviewPrepPayload,
} from '@fehub/types'

import { query } from '../db/client'

type InterviewPrepRow = {
  id: string
  company: string
  position: string
  location: string | null
  logo_url: string
  summary: string
  difficulty: string
  tags: unknown
  rounds: unknown
  overall_tips: unknown
  last_updated: Date
}

const mapRow = (row: InterviewPrepRow): InterviewPrep => ({
  id: row.id,
  company: row.company,
  position: row.position,
  location: row.location ?? undefined,
  logoUrl: row.logo_url,
  summary: row.summary,
  difficulty: row.difficulty as InterviewPrep['difficulty'],
  tags: Array.isArray(row.tags) ? (row.tags as string[]) : JSON.parse(JSON.stringify(row.tags ?? [])),
  rounds: Array.isArray(row.rounds)
    ? (row.rounds as InterviewRound[])
    : JSON.parse(JSON.stringify(row.rounds ?? [])),
  overallTips: Array.isArray(row.overall_tips)
    ? (row.overall_tips as string[])
    : JSON.parse(JSON.stringify(row.overall_tips ?? [])),
  lastUpdated: row.last_updated.toISOString(),
})

export const interviewPrepRepository = {
  async list(): Promise<InterviewPrep[]> {
    const result = await query<InterviewPrepRow>(
      `SELECT * FROM interview_preps ORDER BY company ASC, position ASC`,
    )
    return result.rows.map(mapRow)
  },

  async getById(id: string): Promise<InterviewPrep | undefined> {
    const result = await query<InterviewPrepRow>(`SELECT * FROM interview_preps WHERE id = $1`, [
      id,
    ])
    const row = result.rows[0]
    return row ? mapRow(row) : undefined
  },

  async create(payload: CreateInterviewPrepPayload): Promise<InterviewPrep> {
    const id = payload.id ?? nanoid()
    const rounds = payload.rounds ?? []
    const tags = payload.tags ?? []
    const overallTips = payload.overallTips ?? []

    await query(
      `
        INSERT INTO interview_preps (
          id,
          company,
          position,
          location,
          logo_url,
          summary,
          difficulty,
          tags,
          rounds,
          overall_tips,
          last_updated
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10::jsonb, COALESCE($11, NOW()))
      `,
      [
        id,
        payload.company,
        payload.position,
        payload.location ?? null,
        payload.logoUrl,
        payload.summary,
        payload.difficulty ?? 'medium',
        JSON.stringify(tags),
        JSON.stringify(rounds),
        JSON.stringify(overallTips),
        payload.lastUpdated ?? null,
      ],
    )

    const created = await this.getById(id)
    if (!created) {
      throw new Error('Failed to create interview prep')
    }
    return created
  },

  async update(id: string, updates: UpdateInterviewPrepPayload): Promise<InterviewPrep | null> {
    const existing = await this.getById(id)
    if (!existing) {
      return null
    }

    const next: InterviewPrep = {
      ...existing,
      ...updates,
      id: existing.id,
      tags: updates.tags ?? existing.tags,
      rounds: updates.rounds ?? existing.rounds,
      overallTips: updates.overallTips ?? existing.overallTips,
      lastUpdated: updates.lastUpdated ?? new Date().toISOString(),
    }

    await query(
      `
        UPDATE interview_preps
        SET
          company = $2,
          position = $3,
          location = $4,
          logo_url = $5,
          summary = $6,
          difficulty = $7,
          tags = $8::jsonb,
          rounds = $9::jsonb,
          overall_tips = $10::jsonb,
          last_updated = $11
        WHERE id = $1
      `,
      [
        next.id,
        next.company,
        next.position,
        next.location ?? null,
        next.logoUrl,
        next.summary,
        next.difficulty ?? 'medium',
        JSON.stringify(next.tags ?? []),
        JSON.stringify(next.rounds ?? []),
        JSON.stringify(next.overallTips ?? []),
        next.lastUpdated,
      ],
    )

    return next
  },

  async remove(id: string): Promise<boolean> {
    const result = await query(`DELETE FROM interview_preps WHERE id = $1`, [id])
    return result.rowCount > 0
  },
}
