import { Router } from "express";
import { userMiddleware } from "../middleware/middleware.js";
import { createProfile, getProfile, getProfileById, updateProfile } from "../controller/profile.controller.js";
export const profileRouter = Router();
profileRouter.post("/create", userMiddleware, createProfile);
profileRouter.get("/get", userMiddleware, getProfile);
profileRouter.put("/update", userMiddleware, updateProfile);
profileRouter.get("/get/:userId", userMiddleware, getProfileById);
//# sourceMappingURL=profile.route.js.map