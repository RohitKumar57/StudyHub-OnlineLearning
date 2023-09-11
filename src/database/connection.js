const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/project", {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(()=>{
    console.log("Connection to database Succesful")
}).catch((error)=>{
    console.log("Unsuccessful connection")
})