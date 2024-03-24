import { pinoHttp } from "pino-http"
// import PinoPretty from "pino-pretty"
const { pino: pino } = await import("pino")
const logger = pino({
    transport: {
        target: "pino-pretty"
    }
})
export const httpLogger = pinoHttp({

    transport: {
        target: "pino-pretty"
    },

})
export default logger