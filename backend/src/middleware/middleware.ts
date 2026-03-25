import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import pool from "../db.js";
dotenv.config()


interface JWTpayload {
    id: string,
    email: string
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string
                email: string
                phone: string
                is_verified: boolean
                created_at: string
            }
            userId?: string
        }
    }
}

export const userMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const token = req.cookies.userToken
        if (!token) {
            res.status(401).json({
                msg: "Token not found"
            })
            return
        }
        const jwt_Secret = process.env.JWT_SECRET || ""
        const decoded = jwt.verify(token, jwt_Secret) as JWTpayload
        const user = await pool.query('SELECT * FROM users WHERE id=$1', [decoded.id])
        if (user.rows.length === 0) {
            res.status(401).json({
                msg: "User not found"
            })
            return
        }
        req.user = user.rows[0]
        next()
    } catch (error) {
        res.status(500).json({
            msg: "Internal server error"
        })
    }

}