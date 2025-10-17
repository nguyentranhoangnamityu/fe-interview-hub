import { Router } from 'express'

import { knowledgeBaseService } from '../services/knowledgeBaseService'
import { asyncHandler } from '../utils/asyncHandler'

export const adminRouter = Router()

// Lấy thống kê tổng quan cho dashboard admin
adminRouter.get(
  '/dashboard/stats',
  asyncHandler(async (req, res) => {
    const stats = await knowledgeBaseService.getAdminDashboardStats()
    res.json({ data: stats })
  }),
)

// Lấy danh sách hoạt động gần đây
adminRouter.get(
  '/activities',
  asyncHandler(async (req, res) => {
    const { limit = '10' } = req.query
    const activities = await knowledgeBaseService.getRecentActivities(Number(limit))
    res.json({ data: activities })
  }),
)

// Lấy thống kê tiến độ học tập tổng quan
adminRouter.get(
  '/progress/overview',
  asyncHandler(async (req, res) => {
    const overview = await knowledgeBaseService.getProgressOverview()
    res.json({ data: overview })
  }),
)

// Lấy thống kê theo tech stack
adminRouter.get(
  '/stats/by-tech-stack',
  asyncHandler(async (req, res) => {
    const stats = await knowledgeBaseService.getStatsByTechStack()
    res.json({ data: stats })
  }),
)

// Lấy thống kê theo thời gian
adminRouter.get(
  '/stats/by-time',
  asyncHandler(async (req, res) => {
    const { period = 'week' } = req.query
    const stats = await knowledgeBaseService.getStatsByTime(period as string)
    res.json({ data: stats })
  }),
)
