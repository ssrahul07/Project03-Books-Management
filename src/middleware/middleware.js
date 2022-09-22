const jwt = require("jsonwebtoken");
const bookModel = require('../models/bookModel');
const ObjectId = require('mongoose').Types.ObjectId

const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        
        if (!token)
            return res.status(400).send({ status: false, msg: "Token must be present" });

        let decodedToken = jwt.decode(token);
        if (!decodedToken)
            return res.status(401).send({ status: false, msg: "Token is invalid" })

        jwt.verify(token, "secretKeyForgroup23");

        next()
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

/*const authorisation = async function (req, res, next) {
    try {
        let book_id = req.params.bookId;
        if (!book_id)
            return res.status(400).send({ status: false, msg: "Please enter book Id" })

        if (!ObjectId.isValid(book_id))
            return res.status(404).send({ status: false, msg: "Book Id invalid" });

        let book = await bookModel.findById(req.params.bookId)
        if (!book)
            return res.status(400).send({ status: false, msg: "Book with the given Id not present" })
        let userId = book.userId
        if (!userId)
            return res.status(400).send({ status: false, msg: "user Id not present" })

        let token = req.headers["x-api-key"]
        let decodedToken = jwt.verify(token, "secretKeyForgroup23" )
        let userLoggedIn = decodedToken.userId
        if (userId != userLoggedIn)
            return res.status(403).send({ status: false, msg: 'User logged is not allowed to modify the requested users data' })
        next()
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

*/





module.exports.authentication=authentication
//module.exports.authorization=authorisation
