
import https from "https"

export const keepAlive = () => {
    setInterval(() => {
        https.get("https://flatmate-finder-picx.onrender.com/health")
    }, 14 * 60 * 1000) // ping every 14 minutes
}