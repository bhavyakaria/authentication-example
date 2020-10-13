import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';

export const checkAuthToken = (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers['auth'];
    let jwtPayload;
    try {
        jwtPayload = <any>jwt.verify(token, 'MySuP3R_z3kr3t.');
        res.locals.jwtPayload = jwtPayload;
    } catch (e) {
        //If token is not valid, respond with 401 (unauthorized)
        res.status(401).send();
        return;
    }
    next();
}