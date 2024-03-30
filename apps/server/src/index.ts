import env from "./utils/env";
import express from "express";
import logger, { httpLogger } from "./utils/logger"
import connectToDB from "./utils/connectToMongo";
import { Mongoose } from "mongoose";

const res = await connectToDB()
if (!(res instanceof Mongoose))
{
    logger.fatal("☠ Could not connect to database. Shutting down...")
    process.exit(1)
}
logger.info("✔ Connected to DB successfully!")
const app = express()
app.use(httpLogger);

app.get("/", (_req, res) => {
    console.log(_req.ips)
    res.status(200).send({
        hello: "world!"
    })
})

app.listen(3000, () => logger.info("✅ Server up!!! 🚀")).addListener("close", () => logger.info("Shutting down server..."))