import express from 'express'
import listEndpoints from 'express-list-endpoints'
import cors from 'cors'
import mongoose from 'mongoose'
import passport from 'passport'
import blogRouter from './services/Blogs/index.js'
import { badRequestErrorHandler, notFoundErrorHandler, catchAllErrorHandler } from './services/errorHandlers.js'
import authorRouter from './services/Authors/index.js'
import googleStrategy from './auth/oauth.js'


const server = express()

passport.use('google', googleStrategy)
server.use(cors())
server.use(express.json())
server.use(passport.initialize())


server.use("/authors", authorRouter)
server.use("/blogs", blogRouter)

server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(catchAllErrorHandler)

const { PORT } = process.env



mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
    console.log("✅ Successfully connected to MONGO!");
    server.listen(PORT, () => {
        console.log(`✅ Server is up and running on PORT: ${PORT}`)
        console.table(listEndpoints(server))
    })
})

mongoose.connection.on("error", (err) => {
    console.log(`The connection is unsuccessful!, ${err}`);
})