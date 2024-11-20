import createHttpError from "http-errors";
import UserCollection from "../models/User.js";
import bcrypt from "bcrypt";
import SessionCollection from "../models/Session.js";
import { randomBytes } from "crypto";
import { accessTokenLifeTime, refreshTokenLifeTime } from "../constants/users.js";

export const register = async payload => {
    const { email, password } = payload;
    const user = await UserCollection.findOne({ email });
    if (user) {
        throw createHttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    return UserCollection.create({ ...payload, password: hashPassword });
};

export const login = async ({ email, password }) => {
    const user = await UserCollection.findOne({ email });
    if (!user) {
        throw createHttpError(401, "Emil or password is invalid");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw createHttpError(401, "Emil or password is invalid");
    }

    await SessionCollection.deleteOne({ userId: user._id });


    const accessToken = randomBytes(30).toString("base64");
    const refreshToken = randomBytes(30).toString("base64");

    return SessionCollection.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accesTokenValidUntil: Date.now() + accessTokenLifeTime,
        refreshTokenValidUntil: Date.now() + refreshTokenLifeTime
    });
};