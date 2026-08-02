import { db } from "../db";

export interface User {
    id: string;
    email: string;
    password_hash: string;
    name: string | null;
    role: "user" | "admin";
    api_key: string | null;
    created_at: Date;
    updated_at: Date;
}

export async function createUser(
    email: string,
    passwordHash: string,
    name?: string
): Promise<User> {
    const result = await db.query<User>(
        `INSERT INTO users (email, password_hash, name)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [email, passwordHash, name ?? null]
    );

    return result.rows[0];
}


// Find user by email
export async function getUserByEmail(email: string): Promise<User | null> {
    const result = await db.query<User>(
        `SELECT * FROM users WHERE email = $1 LIMIT 1`,
        [email]
    );

    return result.rows[0] ?? null;
}


// Find user by Id
export async function getUserById(id: string): Promise<User | null> {
    const result = await db.query<User>(
        `SELECT * FROM users WHERE id = $1 LIMIT 1`,
        [id]
    );

    return result.rows[0] ?? null;
}