import multer from "multer";
import createHttpError from "http-errors";

import { TEMP_UPLOAD_DIR } from "../constants/contacts.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, TEMP_UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1E9)}`;
        const filename = `${uniqueSuffix}_${file.originalname}`;
        cb(null, filename);
    }
});

const limits = {
    fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, cb) => {
    const extension = file.originalname.split(".").pop();
    if (extension === "exe") {
        return cb(createHttpError(400, ".exe extension not allow"));
    }
    cb(null, true);
};

export const upload = multer({
    storage,
    limits,
    fileFilter,
});