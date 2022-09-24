const express = require('express')
const route = express.Router()

const userController = require("../controller/userController")
const bookController = require("../controller/bookController")
const middleware = require ("../middleware/middleware")
const reviewController = require("../controller/reviewController")


route.post("/register", userController.registerUser);

route.post("/login", userController.login);

route.post("/books", middleware.Authentication, middleware.Authorisation, bookController.createBook);

route.get("/books", middleware.Authentication, bookController.getBooks);

route.get("/books/:bookId", middleware.Authentication, middleware.Authorisation_2, bookController.getBookByPathParam);

route.delete("/books/:bookId", middleware.Authentication, middleware.Authorisation_2, bookController.deleteBook);

route.put("/books/:bookId",bookController.updateBooks);

route.post("/books/:bookId/review", reviewController.createReview)

route.put("/books/:bookId/review/:reviewId", reviewController.updateReview)

route.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview)



//***********************************  review ******************************************* */
const reviewController = require("../controller/reviewController")

route.post("/books/:bookId/review", reviewController.createReview)

route.put("/books/:bookId/review/:reviewId", reviewController.updateReview)

route.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview)

module.exports = route
