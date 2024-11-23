import express from 'express';
import cors from 'cors';
import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import { logger } from './middlewares/logger.js';

import authRouter from './routers/auth.js';

export const setupServer = () => {
    const app = express();

    app.use(cors());

    app.use(express.json());

    app.use(cookieParser());

    app.use(logger);

    app.use("/auth", authRouter);

    app.use("/contacts", contactsRouter);

    app.use(notFoundHandler);

    app.use(errorHandler);

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
