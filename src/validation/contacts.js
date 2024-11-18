import Joi from "joi";

import { contactTypeList } from "../constants/contacts.js";

export const contactAddSchema = Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
        "string.min": "Name must be at least 3 characters long.",
        "string.max": "Name must not exceed 20 characters.",
        "any.required": "Name is required.",
    }),
    phoneNumber: Joi.string().min(3).max(20).required().messages({
        "any.required": "Phone number is required.",
    }),
    email: Joi.string().min(3).max(20).email().optional().messages({
        "string.email": "Email must be a valid email address.",
    }),
    isFavourite: Joi.boolean().optional().messages({
        "boolean.base": "isFavourite must be a boolean.",
    }),
    contactType: Joi.string().valid(...contactTypeList),
});

export const contactUpdateSchema = Joi.object({
    name: Joi.string().min(3).max(20),
    phoneNumber: Joi.string().min(3).max(20),
    email: Joi.string().min(3).max(20).email(),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid(...contactTypeList),
});