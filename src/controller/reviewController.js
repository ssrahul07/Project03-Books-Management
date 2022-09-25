// ## Review APIs
// ### POST /books/:bookId/review
// - Add a review for the book in reviews collection.
// - Check if the bookId exists and is not deleted before adding the review. Send an error response with appropirate status code like [this](#error-response-structure) if the book does not exist
// - Get review details like review, rating, reviewer's name in request body.
// - Update the related book document by increasing its review count
// - Return the updated book document with reviews data on successful operation. The response body should be in the form of JSON object like [this](#successful-response-structure)

// ### PUT /books/:bookId/review/:reviewId
// - Update the review - review, rating, reviewer's name.
// - Check if the bookId exists and is not deleted before updating the review. Check if the review exist before updating the review. Send an error response with appropirate status code like [this](#error-response-structure) if the book does not exist
// - Get review details like review, rating, reviewer's name in request body.
// - Return the updated book document with reviews data on successful operation. The response body should be in the form of JSON object like [this](#book-details-response)

// ### DELETE /books/:bookId/review/:reviewId
// - Check if the review exist with the reviewId. Check if the book exist with the bookId. Send an error response with appropirate status code like [this](#error-response-structure) if the book or book review does not exist
// - Delete the related reivew.
// - Update the books document - decrease review count by one

// {
//     "_id": ObjectId("88abc190ef0288abc190ef88"),
//     bookId: ObjectId("88abc190ef0288abc190ef55"),
//     reviewedBy: "Jane Doe",
//     reviewedAt: "2021-09-17T04:25:07.803Z",
//     rating: 4,
//     review: "An exciting nerving thriller. A gripping tale. A must read book."
//   }

const { default: mongoose } = require("mongoose")
const bookModel = require("../models/bookModel")
const { findByIdAndUpdate, update } = require("../models/reviewModel")
const reviewModel = require("../models/reviewModel")
const isValid = mongoose.Types.ObjectId.isValid

//************************************** Create Review *********************************************************** */

const isValidRating = function (rating) {
    return (/^\d*[1-5]\d*$/.test(rating))
}

const createReview = async function (req, res) {

    try {

        let bookId = req.params.bookId

        if (!bookId) return res.status(400).send({ status: false, message: "bookID should be present" })

        if (!isValid(bookId)) return res.status(400).send({ status: false, message: "bookID is inValid" })

        let bookByBookId = await bookModel.findById(bookId).lean()


        if (!bookByBookId || bookByBookId.isDeleted == true) return res.status(404).send({ status: false, message: "Book not found" })

        let data = req.body

        if (Object.keys(data) == 0) return res.status(400).send({ status: false, message: "req body empty" })

        if (!isValidRating(data.rating)) return res.status(400).send({ status: false, message: " rating should be in range between 1 to 5 and should be in Whole Number" })

        if (!data.rating || !data.review || !data.reviewedAt)
            return res.status(400).send({ status: false, message: " rating, review , reviewedAt are mandatory field" })

        if (!data.reviewedBy) {
            data.reviewedBy = "Guest"
        }


        let UpdateReviewCount = bookByBookId.reviews + 1


        let updatedBook = await bookModel.findByIdAndUpdate(bookId, { $set: { reviews: UpdateReviewCount } }, { new: true }).lean()

        let finalReviewData = { ...data, bookId: bookId, reviewedAt: Date.now() }

        let reviewCreated = await reviewModel.create(finalReviewData)

        // let finalData = { updatedBook, reviewCreated }
        updatedBook.reviewsData = [reviewCreated]

        res.status(201).send({ status: true, message: "success", data: updatedBook })

    } catch (error) {
        return res.status(500).send({ status: false, err: error.message })

    }

}

//*********************************************** Update Review *************************************************** */

const updateReview = async function (req, res) {

    try {

        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        if (!bookId || !reviewId) return res.status(400).send({ status: false, message: "params should contain bookId and reviewId" })

        if (!isValid(bookId) || !isValid(reviewId)) return res.status(400).send({ status: false, message: "please enter valid bookId and reviewId" })

        let book = await bookModel.findById(bookId).lean()

        let review = await reviewModel.findById(reviewId)



        if (!book || !review) return res.status(404).send({ status: false, message: "data not found with this bookId and reviewId" })

        if (book.isDeleted == true || review.isDeleted == true)
            return res.status(404).send({ status: false, message: "data not found" })

        if (bookId !== review.bookId.toString()) return res.status(400).send({ status: false, message: "please enter correct bookId and reviewId" })

        let data = req.body


        if (Object.keys(data) == 0) return res.status(400).send({ status: false, message: "enter deatails for updatation " })

        if (data.rating) {
            if (!isValidRating(data.rating)) return res.status(400).send({ status: false, message: " rating should be in range between 1 to 5 and should be in Whole Number" })
        }



        let updatedReview = await reviewModel.findByIdAndUpdate(reviewId, {
            $set:
            {
                reviewedBy: data.reviewedBy,
                rating: data.rating,
                review: data.review
            }
        }, { new: true })

        // let finalData = { bookdetails: book, reviewDetails: updatedReview }

        book.reviewsData = [updatedReview]



        res.status(200).send({ status: true, message: "review successfully update", data: book })

    } catch (error) {
        return res.status(500).send({ status: false, err: error.message })

    }
}

//*********************************************** delete review ********************************************************** */

const deleteReview = async function (req, res) {

    try {

        let params = req.params
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        if (!bookId || !reviewId) return res.status(400).send({ status: false, message: "params should contain bookId and reviewId" })

        if (!isValid(bookId) || !isValid(reviewId)) return res.status(400).send({ status: false, message: "please enter valid bookId and reviewId" })

        let book = await bookModel.findById(bookId)

        let review = await reviewModel.findById(reviewId)

        if (bookId !== review.bookId.toString()) return res.status(400).send({ status: false, message: "please enter correct bookId and reviewId" })

        if (!book || !review) return res.status(404).send({ status: false, message: "data not found with this bookId and reviewId" })

        if (book.isDeleted == true || review.isDeleted == true)
            return res.status(404).send({ status: false, message: "data not found" })


        let upadteReviewsInBook = await bookModel.findByIdAndUpdate(bookId,{$set:{reviews:book.reviews-1}}, {new:true})

        let deleteReview = await reviewModel.findByIdAndUpdate(reviewId, {$set:{isDeleted:true}}, {new:true})

        res.status(200).send({ status: true, message: "review successfully deleted", data: deleteReview })


    } catch (error) {
        return res.status(500).send({ status: false, err: error.message })

    }
}


module.exports.createReview = createReview
module.exports.updateReview = updateReview
module.exports.deleteReview = deleteReview
