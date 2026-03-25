import pool from "../db.js";
export const sendMessage = async (req, res) => {
    try {
        const sender_id = req.user?.id;
        if (!sender_id) {
            res.status(401).json({
                msg: "Unauthorized"
            });
            return;
        }
        const { match_id, content } = req.body;
        if (!match_id || !content) {
            res.status(400).json({
                msg: "match id and content required"
            });
            return;
        }
        if (content.trim() === "") {
            res.status(400).json({
                msg: "Messages cant be empty"
            });
            return;
        }
        const match = await pool.query('SELECT id FROM matches WHERE id=$1 AND (user1_id=$2 OR user2_id=$2) AND is_active=true', [match_id, sender_id]);
        if (match.rows.length === 0) {
            res.status(403).json({
                msg: "Mtach not found"
            });
            return;
        }
        const message = await pool.query(`INSERT INTO messages (match_id, sender_id, content) 
             VALUES ($1, $2, $3) 
             RETURNING *`, [match_id, sender_id, content]);
        res.status(201).json({
            msg: "Message sent successfully",
            message: message.rows[0]
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            msg: "Internal server error"
        });
    }
};
export const getMessages = async (req, res) => {
    try {
        // step 1 - who is requesting?
        const user_id = req.user?.id;
        if (!user_id) {
            res.status(401).json({ msg: "Unauthorized" });
            return;
        }
        // step 2 - which conversation?
        // match_id comes from URL params like /messages/match123
        const { match_id } = req.params;
        // step 3 - verify user is part of this match
        // same security check as sendMessage
        // you shouldn't be able to read other people's conversations!
        const match = await pool.query(`SELECT id FROM matches 
         WHERE id = $1 
         AND (user1_id = $2 OR user2_id = $2)
         AND is_active = true`, [match_id, user_id]);
        if (match.rows.length === 0) {
            res.status(403).json({ msg: "Match not found or you are not part of this match" });
            return;
        }
        // step 4 - get all messages for this match
        // we also JOIN with profiles to get sender's name
        // so frontend can show "Priya: Hello!" instead of just "Hello!"
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
         ORDER BY m.sent_at ASC`, 
        // ↑ ASC = oldest first, newest last
        // like a real chat - first message at top
        [match_id]);
        // step 5 - mark all messages as read
        // when you open a conversation, all unread messages become read
        // like WhatsApp blue ticks!
        await pool.query(`UPDATE messages 
         SET is_read = true 
         WHERE match_id = $1 
         AND sender_id != $2
         AND is_read = false`, 
        // ↑ sender_id != user_id means
        // only mark OTHER person's messages as read
        // not your own messages
        [match_id, user_id]);
        res.status(200).json({
            msg: "Messages fetched successfully",
            messages: messages.rows
        });
        return;
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ msg: "Internal server error" });
    }
};
//# sourceMappingURL=message.controller.js.map