import express from "express";
import logger, { httpLogger } from "./logger"
const app = express()
app.use(httpLogger);

app.get("/", (_req, res) => {
    console.log(_req.ips)
    res.status(200).send({
        hello: "world"
    })
})

app.listen(3000, () => logger.info("Server up!!! 🚀")) 