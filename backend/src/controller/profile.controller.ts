import type { Request, Response } from "express";
import pool from "../db.js";
import { computeCompatibility, type ProfileForCompatibility } from "../utils/compatibility.js";

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
        if (!user_id) {
            res.status(401).json({
                msg: "Unauthorized"
            })
            return
        }
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
        const user_id = req.user?.id;
        if (!user_id) {
            res.status(401).json({ msg: "Unauthorized" });
            return;
        }

        const { name, age, city, locality, bio, occupation, budget_min, budget_max, lifestyle_tags } = req.body;

        if (age !== undefined && age !== null && Number(age) < 18) {
            res.status(400).json({ msg: "Age must be at least 18" });
            return;
        }
        if (budget_min !== undefined && budget_max !== undefined && Number(budget_min) > Number(budget_max)) {
            res.status(400).json({ msg: "budget_min cannot be greater than budget_max" });
            return;
        }
        if (lifestyle_tags !== undefined && !Array.isArray(lifestyle_tags)) {
            res.status(400).json({ msg: "lifestyle_tags must be an array" });
            return;
        }

        const profile = await pool.query(
            `UPDATE profiles SET
                name        = COALESCE($1, name),
                age         = COALESCE($2, age),
                city        = COALESCE($3, city),
                locality    = COALESCE($4, locality),
                bio         = COALESCE($5, bio),
                occupation  = COALESCE($6, occupation),
                budget_min  = COALESCE($7, budget_min),
                budget_max  = COALESCE($8, budget_max),
                lifestyle_tags = COALESCE($9, lifestyle_tags)
             WHERE user_id = $10
             RETURNING *`,
            [
                name        ?? null,
                age         ?? null,
                city        ?? null,
                locality    ?? null,
                bio         ?? null,
                occupation  ?? null,
                budget_min  ?? null,
                budget_max  ?? null,
                lifestyle_tags ? JSON.stringify(lifestyle_tags) : null,
                user_id,
            ]
        );

        if (profile.rows.length === 0) {
            res.status(404).json({ msg: "Profile not found" });
            return;
        }

        res.status(200).json({
            msg: "Profile updated successfully",
            profile: profile.rows[0],
        });
    } catch (error) {
        console.error("updateProfile error:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
};

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

export const getBrowseProfiles = async (req: Request, res: Response) => {
    try {
        const user_id = req.user?.id;

        if (!user_id) {
            return res.status(401).json({ msg: "Unauthorized" });
        }

        const myProfileResult = await pool.query(
            "SELECT * FROM profiles WHERE user_id = $1",
            [user_id]
        );

        if (myProfileResult.rows.length === 0) {
            return res.status(404).json({ msg: "Create your profile before browsing" });
        }

        const myProfile = myProfileResult.rows[0] as ProfileForCompatibility;

        const profiles = await pool.query(
            `SELECT * FROM profiles
             WHERE user_id != $1
             AND user_id NOT IN (
                 SELECT swiped_id FROM swipes WHERE swiper_id = $1
             )`,
            [user_id]
        );

        const rankedProfiles = profiles.rows
            .map((profile) => {
                const compatibility = computeCompatibility(myProfile, profile as ProfileForCompatibility);
                return {
                    ...profile,
                    compatibility_score: compatibility.score,
                    mutual_lifestyle_tags: compatibility.mutual_lifestyle_tags,
                    conflicting_tags: compatibility.conflicting_tags,
                };
            })
            .sort((a, b) => b.compatibility_score - a.compatibility_score)
            .slice(0, 20);

        return res.status(200).json({
            msg: "Profiles fetched",
            profiles: rankedProfiles,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal server error"
        });
    }
};