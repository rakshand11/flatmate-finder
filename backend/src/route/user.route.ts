import { Router } from "express";
import { loginController, logoutUser, registerUser } from "../controller/user.controller.js";

export const userRouter: Router = Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginController)
userRouter.post("/logout", logoutUser)