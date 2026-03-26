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


        if (swiper_id === swiped_id) {
            return res.status(400).json({
                msg: "you can not swipe on yourself"
            });
        }


        const alreadySwiped = await pool.query(
            'SELECT id FROM swipes WHERE swiper_id=$1 AND swiped_id=$2',
            [swiper_id, swiped_id]
        );

        if (alreadySwiped.rows.length > 0) {
            return res.status(400).json({
                msg: "Already swiped on this user"
            });
        }


        await pool.query(
            'INSERT INTO swipes(swiper_id, swiped_id, direction) VALUES ($1, $2, $3)',
            [swiper_id, swiped_id, direction]
        );


        if (direction === "left") {
            return res.status(200).json({ msg: "Swiped left" });
        }


        const mutualSwipe = await pool.query(
            'SELECT id FROM swipes WHERE swiper_id=$1 AND swiped_id=$2 AND direction=$3',
            [swiped_id, swiper_id, "right"]
        );

        if (mutualSwipe.rows.length === 0) {
            return res.status(200).json({
                msg: "Swiped right, waiting for match"
            });
        }


        const user1_id = swiper_id < swiped_id ? swiper_id : swiped_id;
        const user2_id = swiper_id < swiped_id ? swiped_id : swiper_id;

        const existingMatch = await pool.query(
            'SELECT id FROM matches WHERE user1_id=$1 AND user2_id=$2',
            [user1_id, user2_id]
        );

        if (existingMatch.rows.length > 0) {
            return res.status(200).json({ msg: "Already matched" });
        }

        const match = await pool.query(
            'INSERT INTO matches (user1_id, user2_id) VALUES ($1, $2) RETURNING *',
            [user1_id, user2_id]
        );

        return res.status(201).json({
            msg: "Match created successfully",
            match: match.rows[0]
        });

    } catch (error) {
        return res.status(500).json({
            msg: "Internal server error"
        });
    }
};
