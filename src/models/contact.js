import mongoose from "mongoose";

import { contactTypeList } from "../constants/contacts.js";

const contactSchema = new mongoose.Schema({
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
}, { timestamps: true });

contactSchema.post("save", (error, data, next) => {
  error.status = 400;
  next();
});
export const sortByList = ["name", "phoneNumber", "email", "isFavourite", "contactType"];
const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
