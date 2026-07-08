import type { Server as HTTPServer } from "http"
import { Server, Socket } from "socket.io"
import jwt from "jsonwebtoken"
import { parse } from "cookie"
import dotenv from "dotenv"
import pool from "../db.js"
import { verifyMatchAccess } from "../utils/match.util.js"
import { corsOrigins } from "../config/cors.js"

dotenv.config()

interface JWTpayload {
    id: string
    email: string
}

// Same shape as req.user in userMiddleware
interface SocketUser {
    id: string
    email: string
    phone: string
    is_verified: boolean
    created_at: string
}

declare module "socket.io" {
    interface Socket {
        user?: SocketUser
    }
}

let io: Server

export const initSocket = (httpServer: HTTPServer) => {
    io = new Server(httpServer, {
        cors: {
            // Same origins as your Express CORS config — must be explicit (not "*")
            // since we rely on the httpOnly cookie, which needs credentials: true.
            origin: corsOrigins,
            credentials: true,
        },
    })

    // ── Auth middleware: mirrors userMiddleware, but for the socket handshake ──
    io.use(async (socket, next) => {
        try {
            const rawCookie = socket.handshake.headers.cookie
            if (!rawCookie) {
                return next(new Error("Unauthorized: no cookie"))
            }

            const cookies = parse(rawCookie)
            const token = cookies.userToken
            if (!token) {
                return next(new Error("Unauthorized: token not found"))
            }

            const jwt_Secret = process.env.JWT_SECRET || ""
            const decoded = jwt.verify(token, jwt_Secret) as JWTpayload

            const user = await pool.query("SELECT * FROM users WHERE id=$1", [decoded.id])
            if (user.rows.length === 0) {
                return next(new Error("Unauthorized: user not found"))
            }

            socket.user = user.rows[0]
            next()
        } catch (error) {
            next(new Error("Unauthorized: invalid token"))
        }
    })

    io.on("connection", (socket: Socket) => {
        const user = socket.user!
        console.log(`[socket] connected: ${socket.id} (user ${user.id})`)

        // Client asks to join a match's room before it can send/receive live updates for it.
        // We re-verify match membership here — never trust the client-supplied match_id alone.
        socket.on("match:join", async (match_id: string) => {
            const match = await verifyMatchAccess(match_id, user.id)
            if (!match) {
                socket.emit("error:message", "Match not found or access denied")
                return
            }
            socket.join(`match:${match_id}`)
        })

        socket.on("match:leave", (match_id: string) => {
            socket.leave(`match:${match_id}`)
        })

        // Typing indicator — broadcast to everyone else in the room, not back to sender.
        socket.on("chat:typing", async ({ match_id, isTyping }: { match_id: string; isTyping: boolean }) => {
            socket.to(`match:${match_id}`).emit("chat:typing", {
                user_id: user.id,
                isTyping,
            })
        })

        socket.on("disconnect", () => {
            console.log(`[socket] disconnected: ${socket.id}`)
        })
    })

    return io
}

// Called from the message controller after a message is inserted via REST,
// so everyone in the match room (including the sender's other tabs/devices) gets it live.
export const emitNewMessage = (match_id: string, message: unknown) => {
    if (!io) return
    io.to(`match:${match_id}`).emit("chat:message", message)
}

// Called after messages are marked as read, so the sender's UI can flip ✓ -> ✓✓ live.
export const emitMessagesRead = (match_id: string, reader_id: string) => {
    if (!io) return
    io.to(`match:${match_id}`).emit("chat:read", { match_id, reader_id })
}