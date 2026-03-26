import { Router } from "express";
import { userMiddleware } from "../middleware/middleware.js";
import { getMatches } from "../controller/match.controller.js";
export const matchRouter = Router();
matchRouter.get("/get", userMiddleware, getMatches);
//# sourceMappingURL=match.route.js.map