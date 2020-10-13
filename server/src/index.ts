import * as express from "express";
import * as dotenv from "dotenv";
import routes from "./routes";
import * as bodyParser from 'body-parser';
import db from "./configs/database";
// initialize configuration
dotenv.config();

const app = express();
app.use(bodyParser.json())

const PORT = process.env.SERVER_PORT;
app.get("/", (req, res) => {
    res.send("Express + Typescript Server");

});

app.use('/api', routes);

app.listen(PORT, async () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
    db.connect().then(() => console.log(`⚡️[postgresql]:Database connected successfully`));
});