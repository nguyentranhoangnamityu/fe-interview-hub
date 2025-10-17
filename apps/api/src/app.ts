import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import { healthRouter } from './routes/health'
import { techStacksRouter } from './routes/techStacks'
import { lessonsRouter } from './routes/lessons'
import { progressRouter } from './routes/progress'
import { userQuizzesRouter, quizSubmissionRouter } from './routes/quizzes'
import { usersRouter } from './routes/users'
import { adminRouter } from './routes/admin'

export const createApp = () => {
  const app = express()

  app.use(
    cors({
      origin: '*',
    }),
  )
  app.use(express.json({ limit: '1mb' }))
  app.use(morgan('dev'))

  app.use('/api/health', healthRouter)
  app.use('/api/tech-stacks', techStacksRouter)
  app.use('/api/lessons', lessonsRouter)
  app.use('/api/users/:userId/progress', progressRouter)
  app.use('/api/users/:userId/quizzes', userQuizzesRouter)
  app.use('/api/lessons/:lessonId/quizzes/submissions', quizSubmissionRouter)
  app.use('/api/users', usersRouter)
  app.use('/api/admin', adminRouter)

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  })

  return app
}
