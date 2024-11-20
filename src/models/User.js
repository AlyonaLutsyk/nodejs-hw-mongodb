import { Schema, model } from "mongoose";
import { emailRegexp } from "../constants/users.js";

import { handleSaveError } from "./hooks.js";


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        match: emailRegexp,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
}, {versionKey: false, timestamps: true });

userSchema.post("save", handleSaveError);

const UserCollection = model("user", userSchema);

export default UserCollection;