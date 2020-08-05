var mongoose = require("mongoose");

var reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 0, max: 5,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value'
        }
    },
    genre: {
        type: String,
        required:true  
    },
    links: {
        imdb: String,
        rotten: String
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ],
    date: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        required:true
    }
});

module.exports = mongoose.model("MetaReview", reviewSchema);