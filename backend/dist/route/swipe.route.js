import { Router } from "express";
import { userMiddleware } from "../middleware/middleware.js";
import { getMatches, swipeUser } from "../controller/swipe.controller.js";
export const swipeRouter = Router();
swipeRouter.post("/create", userMiddleware, swipeUser);
swipeRouter.get("/get-match", userMiddleware, getMatches);
//# sourceMappingURL=swipe.route.js.map