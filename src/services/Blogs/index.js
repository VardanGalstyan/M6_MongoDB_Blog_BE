import { Router } from 'express'
import BlogModel from './schema.js'
import createError from 'http-errors'

const blogRouter = Router()


blogRouter.get("/", async (req, res, next) => {
    try {
        const data = await BlogModel.find({})
        res.send(data)
    } catch (error) {
        console.log(error);
        next(error);
    }
})

blogRouter.get("/:id", async (req, res, next) => {
    try {
        const singleData = await BlogModel.findById(req.params.id)
        if (singleData) {
            res.send(singleData)
        } else {
            next(createError(404, `Blog with id ${req.params.id} not found!`))
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
})

blogRouter.post("/", async (req, res, next) => {
    try {
        const newData = new BlogModel(req.body)
        await newData.save()
        res.status(201).send()
    } catch (error) {
        console.log(error);
        next(error);
    }
})

blogRouter.put("/:id", async (req, res, next) => {

    try {

        const updatedData = await BlogModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        })

        if (updatedData) {
            res.send(updatedData)
        } else {
            next(createError(404, `Blog with id ${req.params.id} not found!`))
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
})

blogRouter.delete("/:id", async (req, res, next) => {

    try {
        const deletedData = await BlogModel.findByIdAndDelete(req.params.id)

        if (deletedData) {
            res.status(204).send(`The blog with ID #${req.params.id} has been successfully deleted!`)
        } else {
            next(createError(404, `Blog with id ${req.params.id} not found!`))
        }

    } catch (error) {
        console.log(error);
        next(error);
    }
})

export default blogRouter