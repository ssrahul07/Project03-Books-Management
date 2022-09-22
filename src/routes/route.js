const express = require('express')
const route = express.Router()

const userController = require("../controller/userController")
const bookController = require("../controller/bookController")
// route.all("/**", function (req, res) {         
//     res.status(400).send({
//         status: false,
//         msg: "The api you request is not available"
//     })
// })


route.post("/register",userController.registerUser);
route.get("/books/:bookId",bookController.getBookWithParam)


route.post("/login",userController.login);

module.exports = route