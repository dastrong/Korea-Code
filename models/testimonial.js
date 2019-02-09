var mongoose = require("mongoose");

let testimonialSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        maxlength: 140
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    postDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Testimonial", testimonialSchema);