const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");
const ObjectId = require("mongoose").Types.ObjectId;


const isDateValid = function (dateStr) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    if (dateStr.match(regex) === null) {
      return false;
    }

    const date = new Date(dateStr);
    const timestamp = date.getTime();

    if (typeof timestamp !== "number" || Number.isNaN(timestamp)) {
      return false;
    }

    return date.toISOString().startsWith(dateStr);
};


//===============================CREATE BOOK ======================//
const createBook = async function (req, res) {
  try {
    let book = req.body;
//////////////////////// VALIDATE BOOK //////////////////////////////////////////
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
      return res.status(400).send({ status: false, message: error });
    }

    const isUnique = await bookModel.findOne({$or:[{title},{ISBN}]});
    if (isUnique)
      return res
        .status(400)
        .send({ status: false, message: "title should be unique or ISBN shoul be unique" });

    if (ISBN.length !== 13)
      return res
        .status(400)
        .send({ status: false, message: "ISBN should be 13 Digit" });

    if (!ObjectId.isValid(userId))
      return res
        .status(400)
        .send({ status: false, message: "userId should be valid" });

    if (!isDateValid(releasedAt))
      return res
        .status(400)
        .send({
          status: false,
          message: "Date should be in (YYYY-MM-DD) format",
        });

    if (Object.keys(book).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "No data to create a book" });
    }


   ////////////////////////// CREATING BOOK /////////////////////////////////// 
      let bookCreated = await bookModel.create(book);
      return res.status(201).send({ status: true, data: bookCreated });

    } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

//**************************** get book with filter ************************************************ */

// ------------------------------------------------GET BOOKS API----------------------------------------------
const getBooks = async function (req, res) {
  try {
    let query = req.query;
    let user_Id = query.userId;
    if (user_Id) {
      if (!ObjectId.isValid(user_Id))
        return res.status(400).send({ status: false, message: "not valid id" });
    }

    let finalData = { userId: req.token.userId, isDeleted: false, ...query };
    let filteredData = await bookModel.find(finalData)
      .sort({ title: 1 })
      .select({
        title: 1,
        excerpt: 1,
        userId: 1,
        category: 1,
        reviews: 1,
        releasedAt: 1
      });
    if (filteredData.length == 0)
      return res.status(404).send({ status: false, msg: "No document found" });
    return res
      .status(200)
      .send({ status: true, message: "Books list", data: filteredData });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

//******************************* get book by bookId in params ************************************ */

const getBookByPathParam = async function (req, res) {
  let bookId = req.params.bookId;
  if (!bookId) return res.status(400).send({ status: false, message: "Please, enter Book id" });
 
  // if(!isValid.isValid(book)) return res.status(400).send({status: false, message: "Invalid Book id"});
  if (!ObjectId.isValid(bookId))
    return res.status(400).send({ status: false, message: "Invalid Book id" });

  let getBook = await bookModel.findById(bookId).select({ ISBN: 0, __v: 0 }).lean();
    if (!getBook) return res.status(404).send({status: false,message: `No such book exists with this id ${bookId}`});

  let getReview = await reviewModel.find({ bookId: bookId, isDeleted: false });

  let reviewCount = getReview.length;

  getBook.reviews = reviewCount;
  getBook.reviewsData = getReview;


  return res.status(200).send({ status: true, message: "Books list", data: getBook });
};

//*********************************** update book by bookId ******************************** */

//====================deleteApi================================

const deleteBook = async function (req, res) {
  try {
    let bookId = req.params.bookId;

    let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
    
    if(book){
    await bookModel.findOneAndUpdate({ _id: bookId},{ $set: { isDeleted: true, deletedAt: new Date() ,new: true }});
    res.status(200).send({ status: true, message: "Book Deleted Successfully" });
    }
    else {
      return res.status(400).send({status: false,message:"Book not found"})
    }
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};


const updateBooks = async function (req, res) {
  try {
      let bookId = req.params.bookId
      let data = req.body
      if(!bookId){
          return res.status(400).send({status:false,msg:"id cant be empty"})
      }
      if (!mongoose.Types.ObjectId.isValid(bookId))
          return res.status(400).send({ status: false, message: "not valid book id" })
          
          if (Object.keys(data).length == 0)
          return res.status(400).send({ status: false, msg: "body should contain any title,excerpt,ISBN" })
          if(data.ISBN.length!==13)
          return res.status(400).send({status:false,msg:"ISBN should be of proper length"})
         
         
          if (!isDateValid(data.releasedAt))
    return res
      .status(400)
      .send({
        status: false,
        message: "Date should be in (YYYY-MM-DD) format",
      });
          
      let validBookId = await bookModel.findById({_id:bookId})
      
      if(!validBookId || validBookId.isDeleted == true ) return res.status(400).send({ status: false, msg: "book not found 123" })

      if(validBookId.title==data.title || validBookId.ISBN==data.ISBN){
          
              return res.status(400).send({ status: false, msg: "title and ISBN should be unique" })
          }
      
          // let findABook = await bookModel.find({$or : [ {title:data.title} , {ISBN:data.ISBN} ] })
          // if (findABook.length >0) return res.status(400).send({ status: false, msg: "title and ISBN should be unique" })

      let UpdateABook=await bookModel.findOneAndUpdate({_id:bookId,isDeleted:false},{$set:{title:data.title,excerpt:data.excerpt,ISBN:data.ISBN,releasedAt:data.releasedAt}},{new:true})
      
      
      return res.status(200).send({ status: true, data : UpdateABook })
  } catch (error) {
      return res.status(500).send({ status: false, error: error.message })
  }

}




module.exports = {createBook, getBooks, getBookByPathParam, deleteBook, updateBooks};
