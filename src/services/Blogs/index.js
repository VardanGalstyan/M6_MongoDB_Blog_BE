import { Router } from 'express'
import BlogModel from './schema.js'
import createError from 'http-errors'
import multer from 'multer'
import { mediaStorage } from '../utilities/mediaStorage.js'
import q2m from 'query-to-mongo'
import { calculateReadTime } from '../utilities/wordCount.js'
import { JWTAuthMiddleWear } from '../../auth/token.js'




const blogRouter = Router()


blogRouter.get("/", async (req, res, next) => {
    try {
        const query = q2m(req.query)
        const { total, blogs } = await BlogModel.findBlogsWithAuthors(query)
        res.send({ links: query.links("/blogs", total), total, blogs, pageTotal: Math.ceil(total / query.options.limit) })
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

blogRouter.post("/", JWTAuthMiddleWear, async (req, res, next) => {
    try {
        const newData = new BlogModel({ ...req.body, readTime: calculateReadTime(req.body.content), authors: req.author._id })
        await newData.save()
        res.status(201).send(newData._id)
    } catch (error) {
        console.log(error);
        next(error);
    }
})

blogRouter.post("/:id/cover", multer({ storage: mediaStorage }).single("cover"), JWTAuthMiddleWear, async (req, res, next) => {
    try {
        const id = req.params.id
        const Blog = await BlogModel.findById(id)
        if (Blog) {
            const modifiedBlog = await BlogModel.findByIdAndUpdate(id, { cover: req.file.path }, {
                new: true // returns the modified user
            })
            res.send(modifiedBlog)
        } else {
            next(createError(404, `Blog Post with id ${id} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

blogRouter.put("/:id", JWTAuthMiddleWear, async (req, res, next) => {

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


blogRouter.delete("/:id", JWTAuthMiddleWear, async (req, res, next) => {

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


// C O M M E N T S    S E C T I O N


blogRouter.get("/:id/comments", JWTAuthMiddleWear, async (req, res, next) => {
    try {
        const blog = await BlogModel.findById(req.params.id)
        if (blog) {
            res.send(blog.comments)
        } else {
            next(createError(404, `Blog with id ${req.params.id} not found!`))
        }
    } catch (error) {
        console.log(error);
        next(error)
    }
})

blogRouter.post("/:id/comments", JWTAuthMiddleWear, async (req, res, next) => {
    try {
        const commentToAdd = { ...req.body }
        const blog = await BlogModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: { comments: commentToAdd }
            },
            {
                new: true
            })
        if (blog) {
            res.send(blog)
        } else {
            next(createError(404, `Blog with id ${req.params.id} not found!`))
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
})

blogRouter.get("/:id/comments/:commentId", JWTAuthMiddleWear, async (req, res, next) => {
    try {
        const blog = await BlogModel.findById(req.params.id)
        if (blog) {
            const comment = blog.comments.find(comment => req.params.commentId === comment._id.toString())
            if (comment) {
                res.send(comment)
            } else {
                next(createError(404, `Comment with id ${req.params.commentId} not found!`))
            }
        } else {
            next(createError(404, `Blog with id: ${req.params.id} not found!`))
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
})

blogRouter.put("/:id/comments/:commentId", JWTAuthMiddleWear, async (req, res, next) => {
    try {
        const blog = await BlogModel.findOneAndUpdate(
            { _id: req.params.id, "comments._id": req.params.commentId },
            {
                $set: {
                    "comments.$": { ...req.body, _id: req.params.commentId }
                },
            },
            { new: true }
        )
        if (blog) {
            res.send(blog)
        } else {
            next(createError(404, `Blog with id: ${req.params.id} not found!`))
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
})

blogRouter.delete("/:id/comments/:commentId", JWTAuthMiddleWear, async (req, res, next) => {
    try {
        const blog = await BlogModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    comments: { _id: req.params.commentId }
                },
            }, {
            new: true
        })
        if (blog) {
            res.send(blog)
        } else {
            next(createError(404, `Blog with id: ${req.params.id} not found!`))
        }
    } catch (error) {

    }
})


export default blogRouter