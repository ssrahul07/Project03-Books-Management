const express = require('express')
const router = express.Router()

const userController = require("../controller/userController")
const bookController = require("../controller/bookController")
const middleware = require ("../middleware/middleware")
const reviewController = require("../controller/reviewController")


router.post("/register", userController.registerUser);

router.post("/login", userController.login);

router.post("/books", middleware.Authentication, middleware.Authorisation, bookController.createBook);

router.get("/books", middleware.Authentication, bookController.getBooks);

router.get("/books/:bookId", middleware.Authentication, middleware.Authorisation_2, bookController.getBookByPathParam);

router.put("/books/:bookId", middleware.Authentication, middleware.Authorisation_2 ,bookController.updateBooks);

router.delete("/books/:bookId", middleware.Authentication, middleware.Authorisation_2, bookController.deleteBook);






//***********************************  review ******************************************* */

router.post("/books/:bookId/review", reviewController.createReview)

router.put("/books/:bookId/review/:reviewId", reviewController.updateReview)

router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview)

module.exports = router
