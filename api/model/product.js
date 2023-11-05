const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    _id:{
        type: mongoose.Schema.Types.ObjectId
    },
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: false
    },
    orginalPrice:{
        type: Number,
        required: true
    },
    offerPrice:{
        type: Number,
        required: true
    },
    ratings:{
        type: Number,
        required: false,
        default: 0
    },
    sizes:{
        type: [String],
        required: false
    },
    totalLeft:{
        type: Number,
        required: true,
        default: 0
    },
    coustmerReviews:{
        type:[
            {
                username: {
                    type: String,
                    required: true
                },
                mgs:{
                    type: String,
                    required: false
                },
                rating:{
                    type: Number,
                    required: true
                }
            }
        ],
        required: false
    },
    tags:{
        type: [String],
        required:false
    },
    colors:{
        type: [String],
        required: true
    }
})

const product = mongoose.model("Product", productSchema);

module.exports = product;