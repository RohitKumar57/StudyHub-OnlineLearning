const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true, 
        minlength: 3
    }, 
    email: {
        type: String, 
        required: true,

        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid ....")
            }
        }
    }, 
    phone: {
        type: Number, 
        required: true,
        min : 10        
    }, 
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    course: {
        type: String, 
        required: true
    },
    address: {
        type: String,
        required: true,
        minlength: 2
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default:Date.now
    }
})


const User = mongoose.model("User", userSchema);
module.exports = User;