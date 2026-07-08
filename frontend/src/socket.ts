import { io, Socket } from "socket.io-client";

// Point this at your backend origin (same one your axios API instance targets,
// minus any path prefix). Set VITE_SOCKET_URL in .env for local dev if your
// backend doesn't run on this default port.
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://flatmate-finder-picx.onrender.com";

// withCredentials is required so the httpOnly userToken cookie rides along
// with the socket handshake, same as it does for your axios REST calls.
export const socket: Socket = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: true,
});

socket.on("connect_error", (err) => {
    // Most commonly this means the cookie wasn't sent/valid — check CLIENT_ORIGIN
    // on the backend matches this app's origin exactly, and that the user is logged in.
    console.error("[socket] connection error:", err.message);
});