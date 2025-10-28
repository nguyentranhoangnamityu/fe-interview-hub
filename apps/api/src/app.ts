import express from 'express'
import morgan from 'morgan'

import { healthRouter } from './routes/health'
import { techStacksRouter } from './routes/techStacks'
import { lessonsRouter } from './routes/lessons'
import { progressRouter } from './routes/progress'
import { userQuizzesRouter, quizSubmissionRouter } from './routes/quizzes'
import { usersRouter } from './routes/users'
import { adminRouter } from './routes/admin'
import { interviewPrepsRouter } from './routes/interviewPreps'

export const createApp = () => {
  const app = express()

  // CORS middleware chi tiết - xử lý preflight và custom headers
  app.use((req, res, next) => {
    // Cho phép tất cả origin
    const origin = req.headers.origin
    res.header('Access-Control-Allow-Origin', origin || '*')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Referer, sec-ch-ua, sec-ch-ua-mobile, sec-ch-ua-platform')
    res.header('Access-Control-Expose-Headers', 'Content-Type')
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200)
    }
    
    next()
  })
  app.use(express.json({ limit: '1mb' }))
  app.use(morgan('dev'))

  app.use('/api/health', healthRouter)
  app.use('/api/tech-stacks', techStacksRouter)
  app.use('/api/lessons', lessonsRouter)
  app.use('/api/interview-preps', interviewPrepsRouter)
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
