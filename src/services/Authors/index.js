import { Router } from 'express'
import AuthorsModel from './schema.js'
import createError from 'http-errors'
import multer from 'multer'
import { mediaStorage } from '../utilities/mediaStorage.js'
import { basicAuthMiddleware } from '../../auth/basic.js'


const authorRouter = Router()


authorRouter.get("/", basicAuthMiddleware, async (req, res, next) => {
    try {
        const data = await AuthorsModel.find({})
        res.send(data)
    } catch (error) {
        console.log(error);
        next(error);
    }
})

authorRouter.get("/:id", async (req, res, next) => {
    try {
        const singleData = await AuthorsModel.findById(req.params.id)
        if (singleData) {
            res.send(singleData)
        } else {
            next(createError(404, `author with id ${req.params.id} not found!`))
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
})

authorRouter.post("/", async (req, res, next) => {
    try {
        const newData = new AuthorsModel(req.body)
        await newData.save()
        res.status(201).send(newData)
    } catch (error) {
        console.log(error);
        next(error);
    }
})

authorRouter.post("/:id/img", multer({ storage: mediaStorage }).single("cover"), async (req, res, next) => {
    try {
        const id = req.params.id
        const author = await AuthorsModel.findById(id)
        if (author) {
            const modifiedauthor = await AuthorsModel.findByIdAndUpdate(id, { cover: req.file.path }, {
                new: true // returns the modified user
            })
            res.send(modifiedauthor)
        } else {
            next(createError(404, `author Post with id ${id} not found!`))
        }
    } catch (error) {
        next(error)
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