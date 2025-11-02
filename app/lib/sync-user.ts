import pool from "./db";

export async function syncUserToDatabase(user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
}): Promise<void> {
    const client = await pool.connect();
    try {
        // Check if user exists
        const result = await client.query("SELECT id FROM users WHERE id = $1", [user.id]);

        if (result.rows.length === 0) {
            // Create new user
            await client.query(
                `INSERT INTO users (id, email, name, image, "emailVerified")
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (email) DO UPDATE
         SET id = EXCLUDED.id, name = EXCLUDED.name, image = EXCLUDED.image, "emailVerified" = NOW()`,
                [user.id, user.email, user.name, user.image]
            );
        } else {
            // Update existing user
            await client.query(
                `UPDATE users 
         SET name = $1, image = $2, "emailVerified" = NOW()
         WHERE id = $3`,
                [user.name, user.image, user.id]
            );
        }
    } finally {
        client.release();
    }
}
