import createHttpError from "http-errors";
import { findSession, findUser } from "../services/auth.js";


export const authenticate = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return next(createHttpError(401, "Please provide Authorization header"));
    }
    const [bearer, token] = authHeader.split(" ");

    if (bearer !== "Bearer") {
        return next(createHttpError(401, "Auth header should be of type Bearer"));
    }

    const session = await findSession({ accessToken: token });
    if (!session) {
        return next(createHttpError(401, "Session not found"));
    }
    if (Date.now() > session.accesTokenValidUntil) {
        return next(createHttpError(401, "Access token expired"));
    }

    const user = await findUser({ _id: session.userId });
    if (!user) {
        return next(createHttpError(401, "User not found"));
    }

    req.user = user;
    
    next();
};
