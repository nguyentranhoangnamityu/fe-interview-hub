import { Router } from 'express'
import { z } from 'zod'

import { knowledgeBaseService } from '../services/knowledgeBaseService'
import { asyncHandler } from '../utils/asyncHandler'

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  picture: z.string().url().optional(),
  joinDate: z.string(),
  status: z.enum(['active', 'suspended']),
})

const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  picture: z.string().url().optional(),
})

const syncUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  picture: z.string().url().optional(),
})

const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  picture: z.string().url().optional(),
  status: z.enum(['active', 'suspended']).optional(),
})

export const usersRouter = Router()

// Lấy danh sách tất cả người dùng
usersRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const { page = '1', limit = '10', status } = req.query
    const users = await knowledgeBaseService.listUsers({
      page: Number(page),
      limit: Number(limit),
      status: status as string,
    })
    res.json({ data: users })
  }),
)

// Đồng bộ người dùng từ ứng dụng khác (ví dụ sau khi đăng nhập)
usersRouter.post(
  '/sync',
  asyncHandler(async (req, res) => {
    const parseResult = syncUserSchema.safeParse(req.body)
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.flatten() })
      return
    }
    const user = await knowledgeBaseService.syncUser(parseResult.data)
    res.json({ data: user })
  }),
)

// Lấy thông tin chi tiết một người dùng
usersRouter.get(
  '/:userId',
  asyncHandler(async (req, res) => {
    const user = await knowledgeBaseService.getUser(req.params.userId)
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    res.json({ data: user })
  }),
)

// Tạo người dùng mới
usersRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const parseResult = createUserSchema.safeParse(req.body)
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.flatten() })
      return
    }
    const user = await knowledgeBaseService.createUser(parseResult.data)
    res.status(201).json({ data: user })
  }),
)

// Cập nhật thông tin người dùng
usersRouter.put(
  '/:userId',
  asyncHandler(async (req, res) => {
    const parseResult = updateUserSchema.safeParse(req.body)
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.flatten() })
      return
    }
    const user = await knowledgeBaseService.updateUser(req.params.userId, parseResult.data)
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    res.json({ data: user })
  }),
)

// Xóa người dùng
usersRouter.delete(
  '/:userId',
  asyncHandler(async (req, res) => {
    const deleted = await knowledgeBaseService.deleteUser(req.params.userId)
    if (!deleted) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    res.status(204).send()
  }),
)

// Lấy thống kê tiến độ của người dùng
usersRouter.get(
  '/:userId/stats',
  asyncHandler(async (req, res) => {
    const stats = await knowledgeBaseService.getUserStats(req.params.userId)
    res.json({ data: stats })
  }),
)
