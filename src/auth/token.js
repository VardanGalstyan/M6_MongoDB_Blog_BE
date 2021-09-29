import createHttpError from 'http-errors'
import { verifyJWT } from './tools.js'
import AuthorModel from '../services/Authors/schema.js'


export const JWTAuthMiddleWear = async (req, res, next) => {
    if (!req.headers.authorization) {
        next(createHttpError(401, "Please provide credentials in Authorization header!"))
    } else {
        try {
            const token = req.headers.authorization.split(" ")[1]
            const decodedToken = await verifyJWT(token)
            const author = await AuthorModel.findById(decodedToken._id)
            if (author) {
                req.author = author
                next()
            } else {
                next(createHttpError(404, `No Author with id # ${decodedToken._Id} has been found!`))
            }
        } catch (error) {
            next(createHttpError(401, "Invalid Token!"))
        }
    }
}