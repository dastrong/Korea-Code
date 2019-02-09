let middleware = {},
          Post = require("../models/post"),
          User = require("../models/user"),
          Test = require("../models/testimonial");

middleware.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()) return next();
  req.flash("error", "You need to sign in first");
  return res.redirect("/login");
};

middleware.checkPostOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Post.findById(req.params.postID, function(err, post){
      if(!post || err){
        req.flash("error", "Sorry , an error occured. Please try again.");
        return res.redirect("back");
      }
      if(post.author.equals(req.user._id) || req.user.isAdmin){ 
        return next(); 
      }
      req.flash("error", "You don't have permission to do that");
      return res.redirect("back");
    });
  } else {
    req.flash("error", "You need to sign in first");
    return res.redirect("/login");
  }
};

middleware.checkTestOwnership = function(req, res, next){
   if(req.isAuthenticated()){
    Test.findById(req.params.testID, function(err, testimonial){
      if(!testimonial || err){
        req.flash("error", "Sorry, an error occured. Please try again.");
        return res.redirect("back");
      }
      if(testimonial.author.equals(req.user._id) || req.user.isAdmin){ 
        return next(); 
      }
      req.flash("error", "You don't have permission to do that");
      return res.redirect("back");
    });
  } else {
    req.flash("error", "You need to sign in first");
    return res.redirect("/login");
  }
};

middleware.checkUserOwnership = function(req, res, next){
   if(req.isAuthenticated()){
    User.findById(req.params.profileId, function(err, user){
      if(!user || err){
        req.flash("error", "Sorry, an error occured. Please try again.");
        return res.redirect("back");
      }
      if(user._id.equals(req.user._id) || req.user.isAdmin){ 
        return next(); 
      }
      req.flash("error", "You don't have permission to do that");
      return res.redirect("back");
    });
  } else {
    req.flash("error", "You need to sign in first");
    return res.redirect("/login");
  }
};

module.exports = middleware;