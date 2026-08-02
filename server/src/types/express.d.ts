// Extends Express Request to include the authenticated user
// No imports here — this must be an ambient script, not a module
declare namespace Express {
    interface Request {
        user?: {
            id: string;
            email: string;
            password_hash: string;
            name: string | null;
            role: "user" | "admin";
            api_key: string | null;
            created_at: Date;
            updated_at: Date;
        };
    }
}
