import 'dotenv/config'
import { Pool } from 'pg'
import type { PoolClient, QueryResult, QueryResultRow } from 'pg'

const DEFAULT_DATABASE_URL = 'postgresql://localhost:5432/fe_interview_hub'

const connectionString = process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL

export const pool = new Pool({
  connectionString,
})

export const query = <T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<QueryResult<T>> => pool.query<T>(text, params)

export const withTransaction = async <T>(callback: (client: PoolClient) => Promise<T>): Promise<T> => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

process.on('SIGINT', async () => {
  await pool.end()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await pool.end()
  process.exit(0)
})
