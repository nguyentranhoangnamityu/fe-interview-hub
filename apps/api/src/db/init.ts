import type { PoolClient } from 'pg'

import type { InterviewPrep, Lesson, TechStack } from '@fehub/types'

import seedData from '../../../web/src/data/knowledgeBase.json'
import interviewPrepSeed from '../data/interviewPreps.json'
import { pool } from './client'

const ensureTables = async (client: PoolClient) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      picture TEXT,
      join_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended'))
    )
  `)

  await client.query(`
    CREATE TABLE IF NOT EXISTS tech_stacks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      logo TEXT NOT NULL,
      color TEXT NOT NULL
    )
  `)

  await client.query(`
    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      estimated_time INTEGER NOT NULL,
      tech_stack_id TEXT NOT NULL REFERENCES tech_stacks(id) ON DELETE CASCADE,
      tags JSONB NOT NULL DEFAULT '[]'::jsonb,
      sections JSONB NOT NULL,
      resources JSONB,
      cover_image JSONB,
      quizzes JSONB,
      mock_prompts JSONB,
      origin TEXT NOT NULL DEFAULT 'seed'
    )
  `)

  await client.query(`
    CREATE TABLE IF NOT EXISTS lesson_progress (
      user_id TEXT NOT NULL,
      lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
      status TEXT NOT NULL,
      completed_section_ids JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL,
      PRIMARY KEY (user_id, lesson_id)
    )
  `)

  await client.query(`
    CREATE TABLE IF NOT EXISTS lesson_quiz_results (
      user_id TEXT NOT NULL,
      lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
      answers JSONB NOT NULL,
      score INTEGER NOT NULL,
      total_points INTEGER NOT NULL,
      completed_at TIMESTAMPTZ,
      PRIMARY KEY (user_id, lesson_id)
    )
  `)

  await client.query(`
    CREATE TABLE IF NOT EXISTS interview_preps (
      id TEXT PRIMARY KEY,
      company TEXT NOT NULL,
      position TEXT NOT NULL,
      location TEXT,
      logo_url TEXT NOT NULL,
      summary TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      tags JSONB NOT NULL DEFAULT '[]'::jsonb,
      rounds JSONB NOT NULL DEFAULT '[]'::jsonb,
      overall_tips JSONB NOT NULL DEFAULT '[]'::jsonb,
      last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

const upsertTechStacks = async (client: PoolClient, techStacks: Record<string, TechStack>) => {
  const entries = Object.values(techStacks)
  if (entries.length === 0) {
    return
  }
  await Promise.all(
    entries.map((stack) =>
      client.query(
        `
          INSERT INTO tech_stacks (id, name, description, logo, color)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            description = EXCLUDED.description,
            logo = EXCLUDED.logo,
            color = EXCLUDED.color
        `,
        [stack.id, stack.name, stack.description, stack.logo, stack.color],
      ),
    ),
  )
}

const upsertLessons = async (client: PoolClient, lessons: Lesson[]) => {
  if (lessons.length === 0) {
    return
  }
  await Promise.all(
    lessons.map((lesson) =>
      client.query(
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
            $13
          )
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            difficulty = EXCLUDED.difficulty,
            estimated_time = EXCLUDED.estimated_time,
            tech_stack_id = EXCLUDED.tech_stack_id,
            tags = EXCLUDED.tags,
            sections = EXCLUDED.sections,
            resources = EXCLUDED.resources,
            cover_image = EXCLUDED.cover_image,
            quizzes = EXCLUDED.quizzes,
            mock_prompts = EXCLUDED.mock_prompts,
            origin = EXCLUDED.origin
          WHERE lessons.origin = 'seed'
        `,
        [
          lesson.id,
          lesson.title,
          lesson.description,
          lesson.difficulty,
          lesson.estimatedTime,
          lesson.techStack,
          JSON.stringify(lesson.tags ?? []),
          JSON.stringify(lesson.sections ?? []),
          lesson.resources ? JSON.stringify(lesson.resources) : null,
          lesson.coverImage ? JSON.stringify(lesson.coverImage) : null,
          lesson.quizzes ? JSON.stringify(lesson.quizzes) : null,
          lesson.mockPrompts ? JSON.stringify(lesson.mockPrompts) : null,
          'seed',
        ],
      ),
    ),
  )
}

const seedInterviewPreps = async (client: PoolClient, preps: InterviewPrep[]) => {
  if (preps.length === 0) {
    return
  }
  await Promise.all(
    preps.map((prep) =>
      client.query(
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
          ON CONFLICT (id) DO NOTHING
        `,
        [
          prep.id,
          prep.company,
          prep.position,
          prep.location ?? null,
          prep.logoUrl,
          prep.summary,
          prep.difficulty ?? 'medium',
          JSON.stringify(prep.tags ?? []),
          JSON.stringify(prep.rounds ?? []),
          JSON.stringify(prep.overallTips ?? []),
          prep.lastUpdated ?? null,
        ],
      ),
    ),
  )
}

export const initializeDatabase = async () => {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    await ensureTables(client)
    await upsertTechStacks(client, (seedData.techStacks ?? {}) as Record<string, TechStack>)
    await upsertLessons(client, ((seedData.lessons ?? []) as Lesson[]).map((lesson) => ({
      ...lesson,
      origin: 'seed',
    })))
    await seedInterviewPreps(client, interviewPrepSeed as InterviewPrep[])

    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
