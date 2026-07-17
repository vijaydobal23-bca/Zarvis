import {Router} from "express";
import {register ,login, getMe} from "../controller/auth.controller.js";
import {registerValidator ,loginValidator} from "../validators/auth.validator.js";
import { verifyEmail } from "../controller/auth.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const authRouter = Router();
authRouter.post("/register",registerValidator,register);
authRouter.post("/login" , loginValidator , login);
authRouter.get("/get-me",authUser,getMe);

authRouter.get("/verify-email",verifyEmail);

export default authRouter;    