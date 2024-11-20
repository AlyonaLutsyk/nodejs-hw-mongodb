// import createHttpError from "http-errors";
import * as authServices from "../services/auth.js";


export const registerController = async (req, res) => {
    const newUser = await authServices.register(req.body);

    res.status(201).json({
        status: 201,
        message: "Successfully registered a user!",
        data: {
            name: newUser.name,
            email: newUser.email,
        }
    });
};


export const loginController = async (req, res) => {
    const session = await authServices.login(req.body);

    res.status(200).json({
        status: 200,
        message: "Successfully logged in an user!",
        data: {
            accessToken: session.accessToken,
        }
    });
};