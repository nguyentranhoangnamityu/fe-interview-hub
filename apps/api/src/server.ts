import { createApp } from './app'
import { initializeDatabase } from './db/init'

const port = Number.parseInt(process.env.PORT ?? '4000', 10)

const start = async () => {
  await initializeDatabase()
  const app = createApp()

  app.listen(port, () => {
    console.log(`[api] listening on http://localhost:${port}`)
  })
}

start().catch((error) => {
  console.error('[api] failed to start', error)
  process.exit(1)
})
