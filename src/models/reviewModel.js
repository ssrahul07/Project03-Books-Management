//=====================Importing Packages=====================//
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

//=====================Creating ReviewModel Schema=====================//
const reviewModel = new mongoose.Schema(
       {
              bookId: {
                     type: ObjectId,
                     required: true,
                     ref: "bookModel",
                     trim: true
              },
              reviewedBy: {
                     type: String,
                     required: true,
                     default: "Guest",
                     value: String
              },
              reviewedAt: {
                    type: Date,
                     required: true
              },
              rating: {
                     type: Number,
                     required: true
              },
              review: String,
              isDeleted:{
                     type: Boolean,
                     default: false
              },
       }, { timestamps: true })


//=====================Module Export=====================//
module.exports = mongoose.model('reviewData', reviewModel)