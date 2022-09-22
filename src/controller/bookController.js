const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel");
//const  mongoose = require('mongoose')
const jwt = require("jsonwebtoken")

const ObjectId = require('mongoose').Types.ObjectId

const moment = require("moment")

const dateValidation = function (date) {
    let temp = moment('date').format('YYYY MM DD');
    if (temp) {
        return temp
    }
    else {
        return false
    }
}


//===============================createBook======================//
const createBook = async function (req, res) {
    try {
        let book = req.body


        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = book;
        let error = {};
        if (!title) error.title = "Title is mandatory";
        if (!excerpt) error.excerpt = "Excerpt is mandatory";
        if (!userId) error.userId = "userId is mandatory";
        if (!ISBN) error.ISBN = "ISBN is mandatory";
        if (!category) error.category = "Category is mandatory";
        if (!subcategory) error.subcategory = "subcategory is mandatory";
        if (!releasedAt) error.releasedAt = "releasedAt is mandatory";
        if (Object.keys(error).length > 0) {
            return res.status(400).send({ status: false, message: error })
        }

        const isUniqueTitle = await bookModel.findOne({ title })

        if (isUniqueTitle) return res.status(400).send({ status: false, message: "title should be unique" })

        if (!ObjectId.isValid(userId)) return res.status(400).send({ status: false, message: "userId should be valid" })

        const isUniqueISBN = await bookModel.findOne({ ISBN })

        if (ISBN.length !== 13) return res.status(400).send({ status: false, message: "ISBN should be 13 Digit" })
        if (isUniqueISBN) return res.status(400).send({ status: false, message: "ISBN should be unique" })

        if (!dateValidation(releasedAt)) return res.status(400).send({ status: false, message: "Date should be in (YYYY MM DD) format" })

        if (Object.keys(book).length == 0) {
            return res.status(400).send({ status: false, msg: "No data to create a book" })
        }
        let user_id = book.userId
        if (!user_id) {
            return res.status(400).send({ status: false, msg: "User Id should be present in the book data" })
        }
        if (!ObjectId.isValid(user_id)) {
            return res.status(404).send({ status: false, msg: "UserId invalid" });
        }
        let validUser = await userModel.findById(user_id)
        if (!validUser) {
            return res.status(404).send({ status: false, msg: "User data not found" });
        }
        let token = req.headers["x-api-key"]
        let decodedToken = jwt.verify(token, "secretKeyForgroup23");
        let userLoggedIn = decodedToken.userId
        if (userLoggedIn != user_id) {
            return res.status(403).send({ status: false, msg: "User logged in cannot create book give another user's Id" })
        }
        let is_releasedAt = book.releasedAt
        if (is_releasedAt == true) {
            book.releasedAt = new Date()
            let bookCreated = await book.create(book)
            return res.status(201).send({ status: true, data: bookCreated })
        }
        let bookCreated = await bookModel.create(book)
        return res.status(201).send({ status: true, data: bookCreated })
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

//**************************** get book with filter ************************************************ */

// ------------------------------------------------GET BOOKS API----------------------------------------------
const getBooks = async function (req, res) {
    try {
        let data = req.query


        let user_Id = data.userId
        if (user_Id) {
            if (!mongoose.Types.ObjectId.isValid(user_Id))
                return res.status(400).send({ status: false, message: "not valid id" })
        }

        let finalData = { isDeleted: false, ...data }
        let filteredData = await bookModel.find(finalData).sort({ title: 1 }).select({ title: 1, excerpt: 1, userId: 1, category: 1, released: 1, reviews: 1,releasedAt:1 });
        if (filteredData.length == 0) return res.status(404).send({ status: false, msg: "do data found" })
        return res.status(200).send({ status: true,message:'BookList', data: filteredData })


       

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }



}

//******************************* get book by bookId in params ************************************ */

const getBookWithParam = async function (req, res) {
    let bookId  =  req.params.bookId;
    if(!bookId) return res.status(400).send({status: false, message: "Please, enter Book id"});
    // let isValid = mongoose.Types.ObjectId.isValid(book)
    // if(!isValid.isValid(book)) return res.status(400).send({status: false, message: "Invalid Book id"});
    if(!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({status: false, message: "Invalid Book id"});
    let getBook = await bookModel.findById(bookId).select({ISBN:0,__v:0}).lean();
    if(!getBook) return res.status(404).send({status: false, message: `No such book exists with this id ${bookId}`});
    let getReview = await reviewModel.find({bookId: bookId, isDeleted: false})

    let reviewCount = getReview.length
    getBook.reviews = reviewCount;

    getBook.reviewsData = getReview

    return res.status(200).send({status: true, message: "Books list", data: getBook})
}

//*********************************** update book by bookId ******************************** */

//====================deleteApi================================

const deleteBook = async function (req, res) {
    try {
        let bookId = req.param.bookId       //pass the bookId in params
        
        //======validate the bookId=====
        if (!ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, message: "message:Invalid BookId"})

        }
        //===========findout  bookId============
        let book = await bookModel.findOne({ _id: bookId, isDeleted: false })

        if (book) {
            const deleteBook = await bookModel.findOneAndUpdate({ _id: bookId }, { isDeleted: true, deletedAt: new Date() })
            return res.status(200).send({ status: true, message: "Book deleted successfully" })
        }
        else {
            return res.status(404).send({ status: false, message: "This Type Book Is Not Available" })
        }

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}


module.exports= {
                 createBook , 
                 getBooks, 
                 getBookWithParam,
                  deleteBook
                 };
 
