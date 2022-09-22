const mongoose = require("mongoose")

const emailValidation = function(email){
    let regexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return regexForEmail.test(email)
}

const userSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        enum: ["Mr", "Mrs", "Miss"]
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    phone: {
        type: String,
        required: true,
        unique: [true, "Phone should be unique"]
    },
    email: {
        type: String,
        required: true,
        validate:[emailValidation,"plz enter valid email"],
        unique: [true, "email should be unique"]
    },

    password: {
        type: String,
        required: [true, "password is required"],
    },
    address: {
        street: String,
        city: String,
        pincode: String 
    }


}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)