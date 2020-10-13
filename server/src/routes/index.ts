import * as express from 'express';
import auth from './auth';


const app = express();

auth(app);

export default app;