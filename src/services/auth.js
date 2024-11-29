import createHttpError from "http-errors";
import UserCollection from "../models/User.js";
import bcrypt from "bcrypt";
import SessionCollection from "../models/Session.js";
import { randomBytes } from "crypto";
import { accessTokenLifeTime, refreshTokenLifeTime } from "../constants/users.js";
import jwt from 'jsonwebtoken';

import { sendEmail } from '../utils/sendMail.js';
import { env } from '../utils/env.js';

import * as path from "node:path";
import { TEMPLATE_DIR } from "../constants/email.js";
import * as fs from "node:fs/promises";
import Handlebars from "handlebars";



const createSession = () => {
    const accessToken = randomBytes(30).toString("base64");
    const refreshToken = randomBytes(30).toString("base64");

    return {
        accessToken,
        refreshToken,
        accessTokenValidUntil: Date.now() + accessTokenLifeTime,
        refreshTokenValidUntil: Date.now() + refreshTokenLifeTime
    };
};

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

    const newSession = createSession();

    return SessionCollection.create({
        userId: user._id,
        ...newSession
    });
};


export const requestResetToken = async (email) => {
    const user = await UserCollection.findOne({ email });
    if (!user) {
        throw createHttpError(404, 'User not found!');
    }

    const resetToken = jwt.sign({ sub: user._id, email }, env('JWT_SECRET'), {
        expiresIn: '5m',
    });

    const emailTemplatePath = path.join(TEMPLATE_DIR, "reset-password-email.html");

    const templateSource = await fs.readFile(emailTemplatePath, "utf-8");

    const template = Handlebars.compile(templateSource);

    const html = template({
        name: user.name,
        link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
    });

    await sendEmail({
        from: env('SMTP_FROM'),
        to: email,
        subject: 'Reset your password',
        html,
    });
};

export const resetPassword = async (payload) => {
    let decodedToken;

    try {
        decodedToken = jwt.verify(payload.token, env("JWT_SECRET"));
    } catch (error) {
        if (error instanceof Error) {
            throw createHttpError(401, "Token is expired or invalid.");
        }
        throw error;
    }

    const user = await UserCollection.findOne({
        email: decodedToken.email,
        _id: decodedToken.sub,
    });

    if (!user) {
        throw createHttpError(404, "User not found!");
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    await UserCollection.updateOne(
        { _id: user._id },
        { password: hashedPassword }
    );

    await SessionCollection.deleteMany({ userId: user._id });
};


export const refreshUserSession = async ({ sessionId, refreshToken }) => {
    const session = await SessionCollection.findOne({ _id: sessionId, refreshToken });
    if (!session) {
        throw createHttpError(401, "Session not found");
    }
    if (Date.now() > session.refreshTokenValidUntil) {
        throw createHttpError(401, "Session token expired");
    }

    await SessionCollection.deleteOne({ _id: sessionId });

    const newSession = createSession();

    return SessionCollection.create({
        userId: session.userId,
        ...newSession,
    });
};

export const logout = sessionId => SessionCollection.deleteOne({_id: sessionId});

export const findSession = filter => SessionCollection.findOne(filter); 

export const findUser = filter => UserCollection.findOne(filter);