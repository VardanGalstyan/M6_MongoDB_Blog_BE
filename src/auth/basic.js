import createHttpError from "http-errors"
import atob from 'atob'
import AuthorsModel from '../services/Authors/schema.js'


export const basicAuthMiddleware = async (req, res, next) => {

    if (!req.headers.authorization) {
        next(createHttpError(401, "Please provide credentials in Authorization Header"))
    } else {
        const decodedCredentials = atob(req.headers.authorization.split(" ")[1])
        const [username, password] = decodedCredentials.split(":")
        const author = await AuthorsModel.checkCredentials(username, password)

        if (author) {
            req.author = author
            next()
        } else {
            next(createHttpError(401, "Credentials are not correct!"))
        }
    }
}