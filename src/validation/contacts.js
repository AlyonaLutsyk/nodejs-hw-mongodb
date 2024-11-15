import Joi from "joi";

import { contactTypeList } from "../constants/contacts.js";

export const contactAddSchema = Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
        "any.required": "Name is required.",
    }),
    phoneNumber: Joi.string().min(3).max(20).required().messages({
        "any.required": "Phone number is required.",
    }),
    email: Joi.string().min(3).max(20).email().optional(),
    isFavourite: Joi.boolean().optional(),
    contactType: Joi.string().valid(...contactTypeList),
});

export const contactUpdateSchema = Joi.object({
    name: Joi.string().min(3).max(20),
    phoneNumber: Joi.string().min(3).max(20),
    email: Joi.string().min(3).max(20).email(),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid(...contactTypeList),
});