import pool from "../db.js";
export const getMatches = async (req, res) => {
    try {
        const user_id = req.user?.id;
        if (!user_id) {
            res.status(401).json({ msg: "Unauthorized" });
            return;
        }
        const matches = await pool.query(`SELECT 
          m.id as match_id,
          m.matched_at,
          -- get the OTHER person's profile, not ours
          p.name,
          p.age,
          p.city,
          p.photo_url,
          p.occupation
         FROM matches m
         JOIN profiles p ON (
           -- if we are user1, get user2's profile
           -- if we are user2, get user1's profile
           CASE 
             WHEN m.user1_id = $1 THEN p.user_id = m.user2_id
             ELSE p.user_id = m.user1_id
           END
         )
         WHERE (m.user1_id = $1 OR m.user2_id = $1)
         AND m.is_active = true
         ORDER BY m.matched_at DESC`, [user_id]);
        res.status(200).json({
            msg: "Matches found",
            matches: matches.rows
        });
        return;
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ msg: "Internal server error" });
    }
};
//# sourceMappingURL=match.controller.js.map