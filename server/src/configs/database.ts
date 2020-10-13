import * as dotenv from "dotenv";
import * as pgPromise from 'pg-promise';
const pgp = pgPromise();
// initialize configuration
dotenv.config();
const databaseObject = {
    host: process.env.PG_HOST as string,
    port: process.env.PG_PORT as unknown as number,
    database: process.env.PG_DB as string,
    user: process.env.PG_USER as string,
    password: '',
    max: 30 // use up to 30 connections
};

const db = pgp(databaseObject);

export default db;