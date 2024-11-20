import { Schema, model } from "mongoose";

import { handleSaveError } from "./hooks.js";

import { contactTypeList } from "../constants/contacts.js";

const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  isFavourite: {
    type: Boolean,
    default: false,
  },
  contactType: {
    type: String,
    enum: contactTypeList,
    required: true,
    default: 'personal',
  }
}, {versionKey: false, timestamps: true });

contactSchema.post("save", handleSaveError);

export const sortByList = ["name", "phoneNumber", "email", "isFavourite", "contactType"];

const Contact = model("Contact", contactSchema);
export default Contact;
