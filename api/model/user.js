const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    _id:{
        type: mongoose.Types.ObjectId,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    phoneNumber:{
        type: Number,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    userType:{
        type: String,
        required: false,
        default: "Customer"
    },
    profileImg:{
        type: String,
        required: false
    }
})

module.exports = mongoose.model("User", userSchema)