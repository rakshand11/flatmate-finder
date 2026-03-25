import type { Request, Response } from "express";
import pool from "../db.js";

export const createProfile = async (req: Request, res: Response) => {
    try {
        const user_id = req.user?.id
        if (!user_id) {
            res.status(401).json({
                msg: "unauthorized"
            })
            return
        }
        const { name, age, gender, bio, city, locality, budget_min, budget_max, occupation, lifestyle_tags } = req.body
        if (!name || !city || !locality) {
            res.status(400).json({
                msg: "name , city , locality must be there"
            })
            return
        }

        const existingProfile = await pool.query('SELECT id FROM profiles WHERE user_id=$1', [user_id])
        if (existingProfile.rows.length > 0) {
            res.status(400).json({
                msg: "profile already exist"
            })
            return
        }
        if (age && age < 18) {
            res.status(400).json({
                msg: "Age must be at least 18",
            });
            return
        }

        if (budget_min > budget_max) {
            res.status(400).json({
                msg: "budget_min cannot be greater than budget_max",
            });
            return
        }

        if (lifestyle_tags && !Array.isArray(lifestyle_tags)) {
            res.status(400).json({
                msg: "lifestyle_tags must be an array",
            });
            return
        }
        const profile = await pool.query('INSERT INTO profiles(user_id,name , age , gender,bio,city,locality,budget_min,budget_max,occupation,lifestyle_tags)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)RETURNING *', [user_id, name, age, gender, bio, city, locality, budget_min, budget_max, occupation, lifestyle_tags])
        res.status(201).json({
            msg: "Profile created successfully",
            profile: profile.rows[0]
        })
        return
    } catch (error) {
        console.log("error", error)
        res.status(500).json({ msg: "Internal server error" })
    }
}

export const getProfile = async (req: Request, res: Response) => {
    try {
        const user_id = req.user?.id
        const profile = await pool.query('SELECT * FROM profiles WHERE user_id =$1', [user_id])
        if (profile.rows.length === 0) {
            res.status(401).json({
                msg: "Profile not found"
            })
            return
        }
        res.status(200).json({
            msg: "Profile found",
            profile: profile.rows[0]
        })
        return
    } catch (error) {
        console.log("error", error)
        res.status(500).json({
            msg: "Internal server error"
        })
    }
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const user_id = req.user?.id
        const { name, bio, occupation } = req.body
        const profile = await pool.query('UPDATE profiles SET name=COALESCE($1,name),bio=COALESCE($2,bio),occupation=COALESCE($3,occupation)WHERE user_id=$4 RETURNING*', [name, bio, occupation, user_id])
        if (profile.rows.length === 0) {
            res.status(401).json({
                msg: "Profile not found"
            })
            return
        }
        res.status(200).json({
            msg: "profile updated",
            profile: profile.rows[0]
        })
        return
    } catch (error) {
        res.status(500).json({
            msg: "internal server error"
        })
    }
}

export const getProfileById = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        const profile = await pool.query('SELECT * FROM profiles WHERE user_id=$1', [userId])
        if (profile.rows.length === 0) {
            res.status(401).json({
                msg: "Profile not found"
            })
            return
        }
        res.status(200).json({
            msg: "Profile found successfully",
            profile: profile.rows[0]
        })
        return
    } catch (error) {
        console.log("error", error)
        res.status(500).json({
            msg: "Internal server error"
        })
    }
}