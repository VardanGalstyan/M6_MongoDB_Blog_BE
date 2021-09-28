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

authorsSchema.pre('save', async function (next) {
    const newUser = this
    const plainPW = newUser.password

    if (newUser.isModified("password")) {
        newUser.password = await bcrypt.hash(plainPW, 10)
    }
    next()
})

authorsSchema.methods.toJSON = function () {
    const userDocument = this
    const userObject = userDocument.toObject()
    delete userObject.password
    delete userObject.__v
    return userObject
}

authorsSchema.static.checkCredentials = async function (email, plainPW) {
    const author = await this.findOne({ email })
    if (author) {
        const isMatch = await bcrypt.compare(plainPW, user.password)
        if (isMatch) {
            author
        } else return null
    } else {
        return null
    }
}


export default model("Author", authorsSchema)

