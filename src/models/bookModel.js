const mongoose = require("mongoose")

const emailValidation = function(email){
    let regexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return regexForEmail.test(email)
}

const bookSchema = new mongoose.Schema({
    title: {
        type: string,
        required: [true, "Title is required"],
        enum: [Mr, Mrs, Miss]
    },
    name: {
        type: string,
        required: [true, "Name is required"],
    },
    phone: {
        type: string,
        required: true,
        unique: [true, "Phone should be unique"]
    },
    email: {
        type: string,
        required: true,
        validate:[emailValidation,"plz enter valid email"],
        unique: [true, "email should be unique"]
    },

    password: {
        type: string,
        required: [true, "password is required"],
    },
    address: {
        street: { string },
        city: { string },
        pincode: { string }
    }


}, { timestamps: true })

module.exports = mongoose.model('Book', bookSchema)