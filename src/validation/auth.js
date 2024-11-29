import Joi from "joi";

import { emailRegexp } from "../constants/users.js";

export const authRegisterSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(8).required(),
});

export const authLoginSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().required(),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});