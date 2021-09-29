import { Router } from 'express'
import AuthorsModel from './schema.js'
import createError from 'http-errors'
import multer from 'multer'
import { mediaStorage } from '../utilities/mediaStorage.js'
import { generateJWToken } from '../../auth/tools.js'
import createHttpError from 'http-errors'
import { JWTAuthMiddleWear } from '../../auth/token.js'


const authorRouter = Router()


authorRouter.post("/register", async (req, res, next) => {
    try {
        const newAuthor = new AuthorsModel(req.body)
        await newAuthor.save()
        res.status(201).send(newAuthor)
    } catch (error) {
        console.log(error);
        next(error);
    }
})

authorRouter.post("/login", async (req, res, next) => {
    try {
        const { username, password } = req.body
        const author = await AuthorsModel.checkCredentials(username, password)
        if (author) {
            const accessToken = await generateJWToken(author)
            res.send({ accessToken })
        } else {
            next(createHttpError(401, "Credentials are not valid"))
        }
    } catch (error) {
        console.log(error);
    }
})

authorRouter.get("/me", JWTAuthMiddleWear, async (req, res, next) => {
    try {
        res.send(req.author)
    } catch (error) {
        console.log(error);
        next(error);
    }
})

authorRouter.put("/me", JWTAuthMiddleWear, async (req, res, next) => {
    try {

        const updatedAuthor = await AuthorsModel.findOneAndUpdate(req.author.username, req.body, {
            new: true
        })
        await req.author.save()
        res.send(updatedAuthor)
    } catch (error) {
        console.log(error);
        next(error);
    }
})

authorRouter.delete("/me", JWTAuthMiddleWear, async (req, res, next) => {
    try {
        await req.user.deleteOne()
        res.send()
    } catch (error) {
        console.log(error);
        next(error);
    }
})

authorRouter.get("/:id", JWTAuthMiddleWear, async (req, res, next) => {
    try {
        const author = await AuthorsModel.findById(req.params.id)
        res.send(author)
    } catch (error) {
        console.log(error);
        next(error);
    }
})

authorRouter.post("/me/img", multer({ storage: mediaStorage }).single("avatar"), JWTAuthMiddleWear, async (req, res, next) => {

    try {
        const author = req.author
          if (author) {
            const modifiedauthor = await AuthorsModel.findOneAndUpdate(author.username, { avatar: req.file.path }, {
                new: true // returns the modified user
            })
            res.send(modifiedauthor)
        } else {
            next(createError(404, `author with username ${req.author.username} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

// this is left for the admin
authorRouter.get("/", async (req, res, next) => {
    try {
        const data = await AuthorsModel.find({})
        res.send(data)
    } catch (error) {
        console.log(error);
        next(error);
    }
})

authorRouter.put("/:id", async (req, res, next) => {

    try {

        const updatedData = await AuthorsModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        })

        if (updatedData) {
            res.send(updatedData)
        } else {
            next(createError(404, `author with id ${req.params.id} not found!`))
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
})

authorRouter.delete("/:id", async (req, res, next) => {

    try {
        const deletedData = await AuthorsModel.findByIdAndDelete(req.params.id)

        if (deletedData) {
            res.status(204).send(`The author with ID #${req.params.id} has been successfully deleted!`)
        } else {
            next(createError(404, `author with id ${req.params.id} not found!`))
        }

    } catch (error) {
        console.log(error);
        next(error);
    }
})




export default authorRouter