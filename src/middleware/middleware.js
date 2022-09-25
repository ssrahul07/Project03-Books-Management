const JWT = require("jsonwebtoken");
const bookModel = require('../models/bookModel');
const userModel = require('../models/userModel');
const ObjectId = require('mongoose').Types.ObjectId

const Authentication = async function (req, res, next) {
    try {
        //=====================Check Presence of Key with Value in Header=====================//
        let token = req.headers['x-api-key']
        if (!token) { return res.status(400).send({ status: false, msg: "Token must be Present." }) }

        //=====================Verify token & asigning it's value in request body =====================//
        JWT.verify(token, "secretKeyForgroup23", function (error, decodedToken) {
            if (error) {
                return res.status(401).send({ status: false, msg: "Token is not valid" })
            } else {
                req.token = decodedToken
                next()
            }
        })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

<<<<<<< HEAD
const authorisation = async function (req, res, next) {
=======


//=====================This function used for Authorisation(Phase II)=====================//
const Authorisation = async function (req, res, next) {
>>>>>>> e760c5ad1bf9ff4695cae83054e2f1c8d76d299b
    try {
        let userId = req.body.userId
          
        //==================== Check Presence of data Keys=====================//
        // if (Object.keys(data).length !== 0) {


            if (!userId) return res.status(400).send({ status: false, message: " user id is mandatory" })

            if (!ObjectId.isValid(userId) ) return res.status(400).send({ status: false, message: "please enter valid userId" })
            //====================CHECKING USER EXISTS IN THE USER COLLECTION  =====================//
            // console.log(req.token.userId)
            const user = await userModel.findById( userId )
          
            if (!user) return res.status(404).send({ status: false, message: "No user Found" })
            
            //==================== Comparing userid of DB and Decoded Documents =====================//
            if (user._id.toString() !== req.token.userId) 
                return res.status(403).send({ status: false, message: `Unauthorized access!` });

            return next()
        } 
    // } 
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
    
}


<<<<<<< HEAD
=======
        //<<<<================================ Authorisation By Path Params =====================================>>>>//
    const Authorisation_2 = async function (req, res, next) {
        try{
            // console.log(req.params.bookId);
            let bookId = req.params.bookId;
            if(!ObjectId.isValid(bookId)) return res.status(404).send({ status: false, message: "Book id is not valid" })  

            const getBook = await bookModel.findOne({_id:req.params.bookId, isDeleted: false}); 

            if(!getBook)  return res.status(404).send({ status: false, message: "No Book Found" })  
    
            //==================== Comparing Authorid of DB and Decoded Documents =====================//
            if (getBook.userId.toString() !== req.token.userId)
                return res.status(400).send({ status: false, message: `Unauthorized access!` });

            next()
        } 
        catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
    }

}
>>>>>>> e760c5ad1bf9ff4695cae83054e2f1c8d76d299b




<<<<<<< HEAD

module.exports.authentication=authentication
module.exports.authorization=authorisation
=======
//=====================Module Export=====================//
module.exports = { Authentication, Authorisation, Authorisation_2 }
>>>>>>> e760c5ad1bf9ff4695cae83054e2f1c8d76d299b
