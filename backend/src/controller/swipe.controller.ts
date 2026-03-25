import type { Request, Response } from "express";
import pool from "../db.js";


export const swipeUser = async (req: Request, res: Response) => {
    try {
        const swiper_id = req.user?.id;
        const { swiped_id, direction } = req.body;

        if (!swiper_id) {
            return res.status(401).json({ msg: "Unauthorized" });
        }

        if (!swiped_id || !direction) {
            return res.status(400).json({
                msg: "swiped id and direction must be there"
            });
        }

        if (direction !== "right" && direction !== "left") {
            return res.status(400).json({
                msg: "direction can be only right or left"
            });
        }

        // prevent self swipe
        if (swiper_id === swiped_id) {
            return res.status(400).json({
                msg: "you can not swipe on yourself"
            });
        }

        // check already swiped
        const alreadySwiped = await pool.query(
            'SELECT id FROM swipes WHERE swiper_id=$1 AND swiped_id=$2',
            [swiper_id, swiped_id]
        );

        if (alreadySwiped.rows.length > 0) {
            return res.status(400).json({
                msg: "Already swiped on this user"
            });
        }

        // insert swipe (FIXED: missing params)
        await pool.query(
            'INSERT INTO swipes(swiper_id, swiped_id, direction) VALUES ($1, $2, $3)',
            [swiper_id, swiped_id, direction]
        );

        // if left swipe → stop here
        if (direction === "left") {
            return res.status(200).json({ msg: "Swiped left" });
        }

        // check mutual swipe (FIXED quotes)
        const mutualSwipe = await pool.query(
            'SELECT id FROM swipes WHERE swiper_id=$1 AND swiped_id=$2 AND direction=$3',
            [swiped_id, swiper_id, "right"]
        );

        if (mutualSwipe.rows.length === 0) {
            return res.status(200).json({
                msg: "Swiped right, waiting for match"
            });
        }

        // determine consistent order
        const user1_id = swiper_id < swiped_id ? swiper_id : swiped_id;
        const user2_id = swiper_id < swiped_id ? swiped_id : swiper_id;

        // check existing match (FIXED: correct table assumed)
        const existingMatch = await pool.query(
            'SELECT id FROM matches WHERE user1_id=$1 AND user2_id=$2',
            [user1_id, user2_id]
        );

        if (existingMatch.rows.length > 0) {
            return res.status(200).json({ msg: "Already matched" });
        }

        // create match
        const match = await pool.query(
            'INSERT INTO matches (user1_id, user2_id) VALUES ($1, $2) RETURNING *',
            [user1_id, user2_id]
        );

        return res.status(201).json({
            msg: "Match created successfully",
            match: match.rows[0]
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Internal server error"
        });
    }
};

export const getMatches = async (req: Request, res: Response) => {
    try {
        const user_id = req.user?.id

        if (!user_id) {
            res.status(401).json({ msg: "Unauthorized" })
            return
        }

        const matches = await pool.query(
            `SELECT 
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
         WHERE m.user1_id = $1 OR m.user2_id = $1
         AND m.is_active = true
         ORDER BY m.matched_at DESC`,
            [user_id]
        )

        res.status(200).json({
            msg: "Matches found",
            matches: matches.rows
        })
        return

    } catch (error) {
        console.log("error", error)
        res.status(500).json({ msg: "Internal server error" })
    }
}