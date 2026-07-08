import pool from "../db.js"


export const verifyMatchAccess = async (match_id: string | string[], user_id: string) => {
    const id = Array.isArray(match_id) ? match_id[0] : match_id
    const match = await pool.query(
        `SELECT id, user1_id, user2_id FROM matches 
         WHERE id = $1 
         AND (user1_id = $2 OR user2_id = $2) 
         AND is_active = true`,
        [id, user_id]
    )
    return match.rows.length > 0 ? match.rows[0] : null
}