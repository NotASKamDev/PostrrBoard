import path from 'path'
import dotenv from 'dotenv'
import { z } from 'zod'
import logger from './logger'

dotenv.config()
logger.info("Importing env variables...")
const envValidator = z.object({
    MONGO_USER: z.string(),
    MONGO_PASS: z.string(),
    MONGO_DBNAME: z.string(),
    MONGO_PORT: z.string().optional(),
    MONGO_HOST: z.string().optional(),
    USE_MEMSERV: z.string().optional(),
    MONGO_URL: z.string().optional(),
})
interface envVariablesParsed {
    MONGO_USER: string,
    MONGO_PASS: string,
    MONGO_DBNAME: string,
    MONGO_PORT?: number,
    MONGO_HOST?: string,
    USE_MEMSERV?: boolean,
    MONGO_URL?: string,
}

declare global {
    namespace NodeJS {
        interface ProcessEnv extends z.infer<typeof envValidator> { }
    }
}

const envParsed = envValidator.parse(process.env)
let temp: envVariablesParsed = {} as envVariablesParsed
if (envValidator.safeParse(process.env))
{
    temp = {
        MONGO_HOST: envParsed.MONGO_HOST || "localhost",
        MONGO_PASS: envParsed.MONGO_PASS,
        MONGO_USER: envParsed.MONGO_USER,
        MONGO_PORT: (envParsed.MONGO_PORT != undefined ? parseInt(envParsed.MONGO_PORT) : 27017),
        MONGO_DBNAME: envParsed.MONGO_DBNAME,
        USE_MEMSERV: envParsed.USE_MEMSERV !== undefined && Boolean(envParsed.USE_MEMSERV),

    } satisfies envVariablesParsed
} else
{
    throw new Error("BAD ENV", {
        cause: JSON.stringify(envParsed, undefined, '  ')
    })
}

const env = { ...temp } as const
logger.info("✔ Obtained env!")
export default env