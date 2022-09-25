const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://rahul:rahul123@cluster0.ghayzlv.mongodb.net/group23Database-test?retryWrites=true&w=majority",{
    useNewUrlParser: true
})

.then ( () => console.log("MongoDb is connected") )
.catch ( err => console.log(err) );


app.use('/', route)

app.use(function(req,res){
    var err = new Error('Not Found.') 
    err.status = 400
    return res.status(400).send("Path not Found.")
})

app.listen(process.env.PORT || 3000 , function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000 ))
});