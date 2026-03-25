import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../db.js";
dotenv.config();
export const userMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.userToken;
        if (!token) {
            res.status(401).json({
                msg: "Token not found"
            });
            return;
        }
        const jwt_Secret = process.env.JWT_SECRET || "";
        const decoded = jwt.verify(token, jwt_Secret);
        const user = await pool.query('SELECT * FROM users WHERE id=$1', [decoded.id]);
        if (user.rows.length === 0) {
            res.status(401).json({
                msg: "User not found"
            });
            return;
        }
        req.user = user.rows[0];
        next();
    }
    catch (error) {
        res.status(500).json({
            msg: "Internal server error"
        });
    }
};
//# sourceMappingURL=middleware.js.map