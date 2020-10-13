import { Value } from 'ts-postgres';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';

import { User } from '../models/User';
import HttpRequestError from '../models/HttpRequestError';
import db from "../configs/database";
import { randomBytes } from 'crypto';

export default class AuthService {
    constructor() { }

    public async Login(email: string, password: string): Promise<any> {

        const query = `SELECT id, email, username, password FROM social_login WHERE email=($1)`;
        const values: Value = [email];

        const rows = await db.any(query, values);
        const user: User = rows[0];

        const hashedPassword = user.password;
        const correctPassword = await argon2.verify(hashedPassword, password);

        if (!correctPassword) {
            const error = {
                message: 'Incorrect password',
                status_code: 200
            }
            throw new HttpRequestError(error.status_code, error.message);
        }
        return {
            user: {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name
            },
            token: this.generateJWT(user),
        }
    }

    public async Register(user: User): Promise<any> {

        // check if customer already exists by email
        const customerExists = await this.checkIfCustomerExists(user.email);

        if (customerExists) {
            const error = {
                message: 'Customer Already Exists!',
                status_code: 200
            }
            throw new HttpRequestError(error.status_code, error.message);
        }

        const query = `INSERT INTO social_login(email, username, password, password_salt) VALUES ($1, $2, $3, $4) RETURNING id, email`;
        const salt = randomBytes(32);
        const hashedPassword = await argon2.hash(user.password, { salt });
        const values: Value = [user.email, user.first_name + ' ' + user.last_name, hashedPassword, salt];

        const res = await db.query(query, values);
        const registeredUser: User = res[0];

        if (!registeredUser.id) {
            const error = {
                message: 'Error while creating user',
                status_code: 200
            }
            throw new HttpRequestError(error.status_code, error.message);
        }

        return {
            user: {
                id: registeredUser.id,
                email: registeredUser.email,
                first_name: registeredUser.first_name,
                last_name: registeredUser.last_name,
            },
            token: this.generateJWT(registeredUser),
        }
    }

    private async checkIfCustomerExists(email: string): Promise<any> {
        let customerExists = false;
        const query = `SELECT id, email FROM social_login WHERE email = $1;`;
        const values: Value = [email];

        const res = await db.query(query, values);
        const user: User = res[0];
        if (user && user.id) {
            customerExists = true;
        }
        return customerExists;
    }

    private generateJWT(user: User) {

        return jwt.sign({
            data: {
                _id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            }
        }, 'MySuP3R_z3kr3t.', { expiresIn: '6h' }); // @TODO move this to an env var
    }
}