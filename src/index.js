const express = require("express")
const bodyParser = require('body-parser');
const route = require('./routes/routes');
const { default: mongoose } = require('mongoose');
const multer = require('multer');  //multer require
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(multer().any())


mongoose.connect("mongodb+srv://Hovappa96:Ew1mml9DEx33EJGg@cluster0.8bhyj.mongodb.net/Project_5?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
