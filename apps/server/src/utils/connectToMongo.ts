import mongoose, { Mongoose } from 'mongoose'
import env from './env'
import { MongoMemoryServer } from 'mongodb-memory-server'
import logger from './logger'


export default async function connectToDB () {

    let user = env.MONGO_USER
    let pass = env.MONGO_PASS
    let host = env.MONGO_HOST
    let port = `:${env.MONGO_PORT}`
    let dbName = env.MONGO_DBNAME
    let connString = `mongodb://${host}${port ?? ''}`
    // console.log({
    //     user,
    //     pass,
    //     host,
    //     port,
    //     dbName,
    //     usememserv: env.USE_MEMSERV
    // })
    let connData: Mongoose | Error | string
    let memserv: MongoMemoryServer
    if (env.USE_MEMSERV)
    {
        logger.info("Starting `mongodb-memory-server`...")
        memserv = await MongoMemoryServer.create({
            auth: {
                customRootName: user,
                customRootPwd: pass,
                enable: true
            },
            instance: {
                dbName: env.MONGO_DBNAME,
                port: env.MONGO_PORT,
            },
        })
        logger.info(`"mongodb-memory-server" state is : ${memserv.state}`)
        connString = memserv.getUri()
        logger.debug(`Database URI is ${connString}`)
    }
    try
    {
        logger.info('Connecting...')
        connData = (await mongoose.connect(connString, {
            user,
            pass,
            dbName,
        }))
        
    } catch (e)
    {
        connData = e instanceof Error ? e.message : `${e}`
        console.error(e)
    }
    if (connData instanceof Mongoose)
        logger.debug(`Database connection state is ${connData.connection.readyState}`)
    else
        logger.error(`😵 Mongoose failed to connect. Error: ${connData}`)
    return connData
}


