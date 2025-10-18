import { Router } from 'express'

import { interviewPrepService } from '../services/interviewPrepService'
import { asyncHandler } from '../utils/asyncHandler'

export const interviewPrepsRouter = Router()

interviewPrepsRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const preps = await interviewPrepService.list()
    res.json({ data: preps })
  }),
)

interviewPrepsRouter.get(
  '/:prepId',
  asyncHandler(async (req, res) => {
    const prep = await interviewPrepService.getById(req.params.prepId)
    if (!prep) {
      res.status(404).json({ error: 'Interview prep not found' })
      return
    }
    res.json({ data: prep })
  }),
)

interviewPrepsRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const created = await interviewPrepService.create(req.body)
    res.status(201).json({ data: created })
  }),
)

interviewPrepsRouter.put(
  '/:prepId',
  asyncHandler(async (req, res) => {
    const updated = await interviewPrepService.update(req.params.prepId, req.body)
    if (!updated) {
      res.status(404).json({ error: 'Interview prep not found' })
      return
    }
    res.json({ data: updated })
  }),
)

interviewPrepsRouter.delete(
  '/:prepId',
  asyncHandler(async (req, res) => {
    const removed = await interviewPrepService.remove(req.params.prepId)
    if (!removed) {
      res.status(404).json({ error: 'Interview prep not found' })
      return
    }
    res.status(204).send()
  }),
)
