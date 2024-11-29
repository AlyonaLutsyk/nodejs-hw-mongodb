import { Router } from "express";
import * as authControllers from "../controllers/auth.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../utils/validateBody.js";
import { authRegisterSchema, authLoginSchema } from "../validation/auth.js";
import { requestResetEmailSchema, resetPasswordSchema } from '../validation/auth.js';
import { requestResetEmailController, resetPasswordController } from '../controllers/auth.js';

const authRouter = Router();

authRouter.post("/register", validateBody(authRegisterSchema), ctrlWrapper(authControllers.registerController));

authRouter.post("/login", validateBody(authLoginSchema), ctrlWrapper(authControllers.loginController));

authRouter.post("/send-reset-email", validateBody(requestResetEmailSchema), ctrlWrapper(requestResetEmailController));

authRouter.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));

authRouter.post("/refresh", ctrlWrapper(authControllers.refreshSessionController));

authRouter.post("/logout", ctrlWrapper(authControllers.logoutController));

export default authRouter;