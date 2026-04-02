import { Router } from "express";
import { loginController, logoutUser, registerUser } from "../controller/user.controller.js";
import { userMiddleware } from "../middleware/middleware.js";
export const userRouter = Router();
userRouter.post("/register", registerUser);
userRouter.post("/login", loginController);
userRouter.post("/logout", logoutUser);
userRouter.get("/me", userMiddleware, (req, res) => {
    res.json({
        user: req.user
    });
});
//# sourceMappingURL=user.route.js.map