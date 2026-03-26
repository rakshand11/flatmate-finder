import { Router } from "express";
import { userMiddleware } from "../middleware/middleware.js";
import { getMessages, sendMessage } from "../controller/message.controller.js";
export const messageRouter = Router();
messageRouter.post("/send-message", userMiddleware, sendMessage);
messageRouter.get("/get-message/:match_id", userMiddleware, getMessages);
//# sourceMappingURL=message.route.js.map