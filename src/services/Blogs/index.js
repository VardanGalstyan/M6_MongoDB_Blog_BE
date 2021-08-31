import { Router } from 'express'

const blogRouter = Router()


blogRouter.get("/", async (req, res, next) => {
    try {

    } catch (error) {
        console.log(error);
        next(error);
    }
})

blogRouter.get("/:id", async (req, res, next) => {
    try {

    } catch (error) {
        console.log(error);
        next(error);
    }
})

blogRouter.post("/", async (req, res, next) => {
    try {

    } catch (error) {
        console.log(error);
        next(error);
    }
})

blogRouter.put("/:id", async (req, res, next) => {
    try {

    } catch (error) {
        console.log(error);
        next(error);
    }
})

blogRouter.delete("/:id", async (req, res, next) => {
    try {

    } catch (error) {
        console.log(error);
        next(error);
    }
})

export default blogRouter