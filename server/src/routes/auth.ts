import { checkAuthToken } from "../middlewares/checkAuthToken";
import HttpRequestError from "../models/HttpRequestError";
import { User } from "../models/User";
import AuthService from "../services/auth";
import isObjectValid from "../services/Validators";

export default (app) => {

    app.post("/v1/auth/user/login", async (req, res) => {
        const email = req.body.user.email;
        const password = req.body.user.password;

        try {
            if (!email || !password) {
                return res.status(400).json({
                    message: "Bad Request"
                }).end();
            }
            const authService = new AuthService();
            const { user, token } = await authService.Login(email, password);

            return res.status(200).json({
                message: "Ok",
                user: user,
                token: token
            }).end();
        } catch (e) {
            if (e instanceof HttpRequestError) {
                return res.status(e.status).json({
                    message: e.message
                }).end();
            } else {
                return res.status(500).json({
                    message: 'Internal Server Error'
                }).end();
            }
        }
    });

    app.post("/v1/auth/user/register", async (req, res) => {

        const newUser: User = {
            first_name: req.body.user.first_name,
            last_name: req.body.user.last_name,
            email: req.body.user.email,
            password: req.body.user.password
        };

        if (!isObjectValid(newUser)) {
            return res.status(400).json({
                message: "Bad Request"
            }).end();
        }

        try {
            const authService = new AuthService();
            const { user, token } = await authService.Register(newUser);

            return res.status(200).json({
                message: "Ok",
                user: user,
                token: token
            }).end();

        } catch (e) {
            if (e instanceof HttpRequestError) {
                return res.status(e.status).json({
                    message: e.message
                }).end();
            } else {
                console.log(e);
                return res.status(500).json({
                    message: 'Internal Server Error'
                }).end();
            }
        }
    });
}