const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
// const moment = require("moment")

// const dateValidation = function(date){
//     moment('date').format('YYYY MM DD');
// }


const bookSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, "Title is required"],
        unique: [true, "Title should be unique"]     
    },
    excerpt: {
         type: String,
        required: [true, "Title is required"]
    }, 
    userId: {
        type:ObjectId, 
        required: [true, "UserId is required"], 
        refs: "user"
    },
    ISBN: {
        type: String,
        required: [true, "ISBN is required"],
        unique: [true, "ISBN should be unique"] 
    },
    category: {
        type: String,
        required: [true, "Title is required"],
    },
    subcategory: {
        type: String,
        required: [true, "Title is required"]
    },
    reviews: {
        type:Number, 
        default: 0,
    },
    deletedAt: {
        type:Date, 
        default:null
    }, 
    isDeleted: {
        type:Boolean, 
        default: false
    },
    releasedAt: {
        type:Date, 
        required: [true, "releaseAt is required"]
    }}, { timestamps: true })

module.exports = mongoose.model('Book', bookSchema)