import express from "express"
import dotenv from "dotenv"
import pool from "./db.js"
import { userRouter } from "./route/user.route.js"
import cookieParser from "cookie-parser"
import { profileRouter } from "./route/profile.route.js"
import { swipeRouter } from "./route/swipe.route.js"
import { messageRouter } from "./route/message.route.js"
import cors from "cors"
import { matchRouter } from "./route/match.route.js"
import https from "https"
dotenv.config()

const app = express()
const PORT = process.env.PORT

const connectToDatabase = async () => {
    try {
        const client = await pool.connect()
        console.log("connected to database sucessfully")
        client.release()
    } catch (error) {
        console.log("database connection failed")
    }
}

connectToDatabase()

app.use(cors({
    origin: ["http://localhost:5174", "https://flatmate.rakshand.site"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(express.json())
app.use(cookieParser())

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" })
})

app.use("/user", userRouter)
app.use("/profile", profileRouter)
app.use("/swipes", swipeRouter)
app.use("/message", messageRouter)
app.use("/matches", matchRouter)

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
    setInterval(() => {
        https.get("https://flatmate-finder-picx.onrender.com/health", (res) => {
            console.log(`Keep alive ping: ${res.statusCode}`)
        }).on("error", (err) => {
            console.log("Keep alive error:", err.message)
        })
    }, 14 * 60 * 1000)
})