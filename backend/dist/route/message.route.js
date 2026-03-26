import { Router } from "express";
import { userMiddleware } from "../middleware/middleware.js";
import { getChatList, getMessages, sendMessage } from "../controller/message.controller.js";
export const messageRouter = Router();
messageRouter.post("/send-message", userMiddleware, sendMessage);
messageRouter.get("/get-message/:match_id", userMiddleware, getMessages);
messageRouter.get("/chat-list", userMiddleware, getChatList);
//# sourceMappingURL=message.route.js.map