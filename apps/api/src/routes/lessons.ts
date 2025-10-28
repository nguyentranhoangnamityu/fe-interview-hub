import { Router } from 'express'
import { z } from 'zod'

import { knowledgeBaseService } from '../services/knowledgeBaseService'
import { asyncHandler } from '../utils/asyncHandler'

const contentBlockSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('paragraph'),
    text: z.string(),
  }),
  z.object({
    type: z.literal('list'),
    items: z.array(z.string()),
  }),
  z.object({
    type: z.literal('code'),
    language: z.string(),
    snippet: z.string(),
  }),
  z.object({
    type: z.literal('image'),
    url: z.string(),
    alt: z.string(),
  }),
])

const sectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.array(contentBlockSchema),
})

const lessonPayloadSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  difficulty: z.string(),
  estimatedTime: z.number().int().positive(),
  techStack: z.string(),
  tags: z.array(z.string()),
  sections: z.array(sectionSchema),
  resources: z
    .array(
      z.object({
        title: z.string(),
        url: z.string().url(),
      }),
    )
    .optional(),
  coverImage: z
    .object({
      url: z.string().url(),
      alt: z.string(),
    })
    .optional(),
  quizzes: z
    .array(
      z.object({
        id: z.string(),
        prompt: z.string(),
        options: z.array(
          z.object({
            id: z.string(),
            text: z.string(),
          }),
        ),
        correctOptionId: z.string(),
        explanation: z.string(),
        points: z.number().int().nonnegative(),
      }),
    )
    .optional(),
  mockPrompts: z
    .array(
      z.object({
        id: z.string(),
        role: z.enum(['junior', 'middle', 'senior']),
        question: z.string(),
        evaluationKeywords: z.array(z.string()),
        guidance: z.string(),
      }),
    )
    .optional(),
})

export const lessonsRouter = Router()

lessonsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const { techStack } = req.query
    const lessons = await knowledgeBaseService.listLessons(
      typeof techStack === 'string' ? techStack : undefined,
    )
    res.json({ data: lessons })
  }),
)

lessonsRouter.get(
  '/:lessonId',
  asyncHandler(async (req, res) => {
    const lesson = await knowledgeBaseService.getLesson(req.params.lessonId)
    if (!lesson) {
      res.status(404).json({ error: 'Lesson not found' })
      return
    }
    res.json({ data: lesson })
  }),
)

lessonsRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const parseResult = lessonPayloadSchema.safeParse(req.body)
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.flatten() })
      return
    }
    const lesson = await knowledgeBaseService.createLesson(parseResult.data)
    res.status(201).json({ data: lesson })
  }),
)

lessonsRouter.put(
  '/:lessonId',
  asyncHandler(async (req, res) => {
    const parseResult = lessonPayloadSchema.partial().safeParse(req.body)
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.flatten() })
      return
    }
    const lesson = await knowledgeBaseService.updateLesson(req.params.lessonId, parseResult.data)
    if (!lesson) {
      res.status(404).json({ error: 'Lesson not found' })
      return
    }
    res.json({ data: lesson })
  }),
)

const lessonIdParamSchema = z
  .string()
  .min(1, 'Lesson id is required')
  .regex(/^[A-Za-z0-9\-_]+$/, 'Invalid lesson id format')

lessonsRouter.delete(
  '/:lessonId',
  asyncHandler(async (req, res) => {
    const parseResult = lessonIdParamSchema.safeParse(req.params.lessonId)
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.flatten() })
      return
    }

    const deleted = await knowledgeBaseService.deleteLesson(parseResult.data)
    if (!deleted) {
      res.status(404).json({ error: 'Lesson not found' })
      return
    }
    res.status(204).send()
  }),
)
