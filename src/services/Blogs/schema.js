import mongoose from 'mongoose'


const { Schema, model } = mongoose

const blogSchema = new Schema({
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: false },
    readTime: {
        value: { type: Number, required: true },
        unit: { type: String, required: true },
    },
    authors: [{ type: Schema.Types.ObjectId, ref: "Author", required: true }],
    content: { type: String, required: true },
    comments: [{
        content: { type: String, required: true },
        rating: { type: String, required: true }
    }]
},
    {
        timestamps: true
    })

blogSchema.static("findBlogsWithAuthors", async function (query) {
    const total = await this.countDocuments(query.criteria)
    const blogs = await this.find(query.criteria, query.options.fields)
        .limit(query.options.limit)
        .skip(query.options.skip)
        .sort(query.options.sort) // no matter how I write them, mongo is going to apply  ALWAYS sort skip limit in this order
        .populate("authors")

    return { total, blogs }
})

export default model("Blog", blogSchema)

