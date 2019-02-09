let mongoose = require("mongoose"),
    bcrypt   = require("bcryptjs");

let userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        maxlength: 254
    },
    name: {
        type: String,
        required: true, 
        maxlength: 30
    },
    password: {
        type: String,
        required: true 
    },
    bio: {
        type: String,
        maxlength: 140
    },
    image: {
        type: String,
        maxlength: 222
    },
    blogposts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    testimonial: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Testimonial"
    },
    isAdmin: {
        type: Boolean, 
        default: false
    }
});

// EXPORTS THE USER MODEL
module.exports = mongoose.model("User", userSchema);

// EXPORTS THE CREATE USER METHOD
// USED FOR REGISTERING A USER
module.exports.createUser = function(newUser, password, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            newUser.password  = hash;
            newUser.save(callback);
        });
    });     
};

// EXPORTS THE VERIFYING A PASSWORD METHOD
// USED FOR LOGGENG A USER IN
module.exports.verifyPassword = function(password, hash, callback) {
    // Hash is loaded from the DB. 
    bcrypt.compare(password, hash, function(err, res) {
        return callback(err, res);
    });
};