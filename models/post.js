let mongoose = require("mongoose");

let postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 30
    },
    description: {
        type: String,
        required: true,
        maxlength: 140
    },
    content: {
        type: String,
        required: true
    },
    codepen: {
        username: String,
        penID: String
    },
    tags: [String],
    postDate: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Post", postSchema);