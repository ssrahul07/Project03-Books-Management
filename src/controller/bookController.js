const bookModel = require("../models/bookModel")

const createBook = async function(req,res){


//     ### POST /books
// - Create a book document from request body. Get userId in request body only.
// - Make sure the userId is a valid userId by checking the user exist in the users collection.
// - Return HTTP status 201 on a succesful book creation. Also return the book document. The response should be a JSON object like [this](#successful-response-structure) 
// - Create atleast 10 books for each user
// - Return HTTP status 400 for an invalid request with a response body like [this](#error-response-structure)

if(req.body && Object.keys(req.body) > 0){

    let {title, } = req.body

}else{
    res.status(400).send({status:false, message:"data can't be empty"})
}

}

module.exports.createBook = createBook