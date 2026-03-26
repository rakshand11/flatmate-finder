import { Router } from "express";
import { userMiddleware } from "../middleware/middleware.js";
import { swipeUser } from "../controller/swipe.controller.js";
export const swipeRouter = Router();
swipeRouter.post("/create", userMiddleware, swipeUser);
//# sourceMappingURL=swipe.route.js.map