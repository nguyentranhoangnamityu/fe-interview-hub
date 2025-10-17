import { Router } from 'express'
import { z } from 'zod'

import { knowledgeBaseService } from '../services/knowledgeBaseService'
import { asyncHandler } from '../utils/asyncHandler'

const lessonProgressSchema = z.object({
  status: z.enum(['not_started', 'in_progress', 'completed']),
  completedSectionIds: z.array(z.string()),
  updatedAt: z.string(),
})

export const progressRouter = Router({ mergeParams: true })

progressRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const userId = req.params.userId
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' })
      return
    }
    const progress = await knowledgeBaseService.listProgress(userId)
    res.json({ data: progress })
  }),
)

progressRouter.put(
  '/:lessonId',
  asyncHandler(async (req, res) => {
    const userId = req.params.userId
    const lessonId = req.params.lessonId
    if (!userId || !lessonId) {
      res.status(400).json({ error: 'Missing userId or lessonId' })
      return
    }
    const parseResult = lessonProgressSchema.safeParse(req.body)
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.flatten() })
      return
    }
    const saved = await knowledgeBaseService.saveProgress(userId, lessonId, parseResult.data)
    res.json({ data: saved })
  }),
)

progressRouter.delete(
  '/:lessonId',
  asyncHandler(async (req, res) => {
    const userId = req.params.userId
    const lessonId = req.params.lessonId
    if (!userId || !lessonId) {
      res.status(400).json({ error: 'Missing userId or lessonId' })
      return
    }
    await knowledgeBaseService.deleteProgress(userId, lessonId)
    res.status(204).send()
  }),
)
