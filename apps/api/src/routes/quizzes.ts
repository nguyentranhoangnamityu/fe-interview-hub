import { Router } from 'express'
import { z } from 'zod'

import { knowledgeBaseService } from '../services/knowledgeBaseService'
import { asyncHandler } from '../utils/asyncHandler'

const quizSubmissionSchema = z.object({
  userId: z.string(),
  answers: z.record(z.string()),
})

export const userQuizzesRouter = Router({ mergeParams: true })
export const quizSubmissionRouter = Router({ mergeParams: true })

userQuizzesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const userId = req.params.userId
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' })
      return
    }
    const results = await knowledgeBaseService.listQuizResults(userId)
    res.json({ data: results })
  }),
)

userQuizzesRouter.get(
  '/:lessonId',
  asyncHandler(async (req, res) => {
    const userId = req.params.userId
    const lessonId = req.params.lessonId
    if (!userId || !lessonId) {
      res.status(400).json({ error: 'Missing userId or lessonId' })
      return
    }
    const results = await knowledgeBaseService.listQuizResults(userId)
    const result = results[lessonId]
    if (!result) {
      res.status(404).json({ error: 'Quiz result not found' })
      return
    }
    res.json({ data: result })
  }),
)

userQuizzesRouter.delete(
  '/:lessonId',
  asyncHandler(async (req, res) => {
    const userId = req.params.userId
    const lessonId = req.params.lessonId
    if (!userId || !lessonId) {
      res.status(400).json({ error: 'Missing userId or lessonId' })
      return
    }
    await knowledgeBaseService.deleteQuizResult(userId, lessonId)
    res.status(204).send()
  }),
)

quizSubmissionRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const lessonId = req.params.lessonId
    if (!lessonId) {
      res.status(400).json({ error: 'Missing lessonId' })
      return
    }
    const parseResult = quizSubmissionSchema.safeParse(req.body)
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.flatten() })
      return
    }
    const result = await knowledgeBaseService.gradeQuiz(lessonId, parseResult.data)
    if (!result) {
      res.status(404).json({ error: 'Lesson quiz not found' })
      return
    }
    res.json({ data: result })
  }),
)
