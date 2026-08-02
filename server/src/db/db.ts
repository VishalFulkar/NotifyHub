import { Pool, QueryResultRow } from "pg";

const pool = new Pool({
    connectionString : process.env.DATABASE_URL
})

export const db = {
    query: <T extends QueryResultRow>(text: string, params?: unknown[]) => pool.query<T>(text, params),
    getClient: () => pool.connect(),
}

export default pool;
