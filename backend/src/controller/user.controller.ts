import type { Request, Response } from "express";
import bcrypt from 'bcrypt'
import pool from "../db.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const jwt_Secret = process.env.JWT_SECRET || ""

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, password, phone } = req.body
        if (!email || !password || !phone) {
            res.status(400).json({ msg: "All fields should be filled" })
            return
        }
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE email=$1', [email]
        )
        if (existingUser.rows.length) {
            res.status(400).json({ msg: "User already exists" })
            return
        }
        const password_hash = await bcrypt.hash(password, 10)
        const createUser = await pool.query(
            'INSERT INTO users(email,password_hash,phone) VALUES($1,$2,$3) RETURNING *',
            [email, password_hash, phone]
        )


        const token = jwt.sign(
            { id: createUser.rows[0].id, email: createUser.rows[0].email },
            jwt_Secret,
            { expiresIn: "30d" }
        )
        res.cookie("userToken", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: true,
            maxAge: 30 * 24 * 60 * 60 * 1000
        })
        res.status(201).json({
            msg: "User created successfully",
            user: createUser.rows[0]
        })
        return
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Internal server error" })
    }
}

export const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            res.status(400).json({ msg: "Email and password must be filled" })
            return
        }
        const user = await pool.query(
            'SELECT * FROM users WHERE email = $1', [email]
        )
        if (user.rows.length === 0) {
            res.status(401).json({ msg: "User does not exist" })
            return
        }
        const passwordValidation = await bcrypt.compare(
            password, user.rows[0].password_hash
        )
        if (!passwordValidation) {
            res.status(400).json({ msg: "Wrong password" })
            return
        }
        const token = jwt.sign(
            { id: user.rows[0].id, email: user.rows[0].email },
            jwt_Secret,
            { expiresIn: "30d" }
        )
        res.cookie("userToken", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: true,
            maxAge: 30 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({
            msg: "User logged in successfully"
        })
        return
    } catch (error) {
        res.status(500).json({ msg: "Internal server error" })
    }
}

export const logoutUser = async (req: Request, res: Response) => {
    try {
        res.clearCookie("userToken", {
            httpOnly: true,
            sameSite: "lax",
        })
        res.status(200).json({ msg: "Logout successfully" })
        return
    } catch (error) {
        res.status(500).json({ msg: "Internal server error" })
    }
}