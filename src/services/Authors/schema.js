import mongoose from 'mongoose'
import bcrypt from 'bcrypt'


const { Schema, model } = mongoose

const authorsSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, required: true },
},
    {
        timestamps: true
    })


// Encrypting the password
authorsSchema.pre('save', async function (next) {
    const newAuthor = this
    const plainPW = newAuthor.password

    if (newAuthor.isModified("password")) {
        newAuthor.password = await bcrypt.hash(plainPW, 10)
    }
    next()
})

// removing unnecessary values
authorsSchema.methods.toJSON = function () {
    const userDocument = this
    const userObject = userDocument.toObject()
    delete userObject.password
    delete userObject.__v
    return userObject
}

authorsSchema.statics.checkCredentials = async function (username, plainPW) {
    const author = await this.findOne({ username })
    if (author) {
        const isMatch = await bcrypt.compare(plainPW, author.password)
        if (isMatch) return author
        else return null
    } else {
        return null
    }
}


export default model("Author", authorsSchema)

