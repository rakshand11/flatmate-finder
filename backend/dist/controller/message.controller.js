import pool from "../db.js";
// ✅ SEND MESSAGE
export const sendMessage = async (req, res) => {
    try {
        const sender_id = req.user?.id;
        if (!sender_id) {
            return res.status(401).json({
                msg: "Unauthorized"
            });
        }
        const { match_id, content } = req.body;
        if (!match_id || !content) {
            return res.status(400).json({
                msg: "match_id and content are required"
            });
        }
        if (typeof content !== "string" || content.trim() === "") {
            return res.status(400).json({
                msg: "Message cannot be empty"
            });
        }
        // ✅ check if user belongs to this match
        const match = await pool.query(`SELECT id FROM matches 
             WHERE id = $1 
             AND (user1_id = $2 OR user2_id = $2) 
             AND is_active = true`, [match_id, sender_id]);
        if (match.rows.length === 0) {
            return res.status(403).json({
                msg: "Match not found or access denied"
            });
        }
        // ✅ insert message
        const message = await pool.query(`INSERT INTO messages (match_id, sender_id, content) 
             VALUES ($1, $2, $3) 
             RETURNING *`, [match_id, sender_id, content.trim()]);
        return res.status(201).json({
            msg: "Message sent successfully",
            message: message.rows[0]
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Internal server error"
        });
    }
};
// ✅ GET MESSAGES (WITH PAGINATION + READ RECEIPTS)
export const getMessages = async (req, res) => {
    try {
        const user_id = req.user?.id;
        if (!user_id) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        const { match_id } = req.params;
        if (!match_id) {
            return res.status(400).json({
                msg: "match_id is required"
            });
        }
        // ✅ pagination (default: latest 50 messages)
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;
        // ✅ verify user is part of match
        const match = await pool.query(`SELECT id FROM matches 
             WHERE id = $1 
             AND (user1_id = $2 OR user2_id = $2)
             AND is_active = true`, [match_id, user_id]);
        if (match.rows.length === 0) {
            return res.status(403).json({
                msg: "Match not found or you are not part of this match"
            });
        }
        // ✅ fetch messages
        const messages = await pool.query(`SELECT 
                m.id,
                m.content,
                m.sent_at,
                m.is_read,
                m.sender_id,
                p.name as sender_name,
                p.photo_url as sender_photo
             FROM messages m
             JOIN profiles p ON p.user_id = m.sender_id
             WHERE m.match_id = $1
             ORDER BY m.sent_at ASC
             LIMIT $2 OFFSET $3`, [match_id, limit, offset]);
        // ✅ mark messages as read (only others' messages)
        await pool.query(`UPDATE messages 
             SET is_read = true 
             WHERE match_id = $1 
             AND sender_id != $2
             AND is_read = false`, [match_id, user_id]);
        return res.status(200).json({
            msg: "Messages fetched successfully",
            messages: messages.rows
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Internal server error"
        });
    }
};
export const getChatList = async (req, res) => {
    const user_id = req.user?.id;
    if (!user_id) {
        return res.status(401).json({ msg: "Unauthorized" });
    }
    try {
        const chats = await pool.query(`
        SELECT DISTINCT
          m.id AS match_id,
          m.user1_id,
          m.user2_id,
          p.name AS other_user_name,
          MAX(ms.sent_at) AS last_message_time
        FROM matches m
        JOIN profiles p
          ON (m.user1_id = $1 AND m.user2_id = p.user_id)
          OR (m.user2_id = $1 AND m.user1_id = p.user_id)
        JOIN messages ms ON ms.match_id = m.id
        WHERE m.is_active = TRUE
          AND (m.user1_id = $1 OR m.user2_id = $1)
        GROUP BY m.id, m.user1_id, m.user2_id, p.name
        ORDER BY last_message_time DESC
        `, [user_id]);
        return res.status(200).json({ chats: chats.rows });
    }
    catch (error) {
        console.log("getChatList error detail:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
//# sourceMappingURL=message.controller.js.map