import { Router } from 'express'

import { knowledgeBaseService } from '../services/knowledgeBaseService'
import { asyncHandler } from '../utils/asyncHandler'

export const techStacksRouter = Router()

techStacksRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const stacks = await knowledgeBaseService.getTechStacks()
    res.json({ data: stacks })
  }),
)

techStacksRouter.get(
  '/record',
  asyncHandler(async (_req, res) => {
    const stacks = await knowledgeBaseService.getTechStackRecord()
    res.json({ data: stacks })
  }),
)
