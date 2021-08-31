import mongoose from 'mongoose'

const {Schema} = mongoose

const blogSchema = new Schema({
    category : {type:String, required: true},
    title : {type:String, required: true},
    cover : {type:String, required: true},
    readTime : {
        value : {type:Number, required: true},
        unit : {type:String, required: true},
    },
    author : {
        name : {type:String, required: true},
        avatar : {type:String, required: true},
    },
    content : {type:String, required: true},
},
{
    timestamps:true 
})

export default model("Blog", blogSchema)



// {
//     "_id": "MONGO GENERATED ID",
//     "category": "ARTICLE CATEGORY",
//     "title": "ARTICLE TITLE",
//     "cover":"ARTICLE COVER (IMAGE LINK)",
//     "readTime": {
//       "value": 2,
//       "unit": "minute"
//     },
//     "author": {
//       "name": "AUTHOR NAME",
//       "avatar":"AUTHOR AVATAR LINK"
//     },
//     "content": "HTML",
//     "createdAt": "DATE",
//     "updatedAt": "DATE"           
// }