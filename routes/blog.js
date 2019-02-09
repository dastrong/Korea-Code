var express = require("express"),
    router  = express.Router(),
htmlclean   = require("htmlclean"),
    Post    = require("../models/post"),
    User    = require("../models/user"),
 middleware = require("../middleware/middleware"),
 
{isLoggedIn, checkPostOwnership} = middleware;

// ======================================================//
// =========================NEW==========================//
// ======================================================//
router.get("/new", isLoggedIn, (req, res)=>{
  res.render("blogs/new");
});

// ======================================================//
// ========================POST==========================//
// ======================================================//
router.post("/", isLoggedIn, (req, res)=>{
  let newPost = handleData(req.body);
  newPost.author = req.user._id;
  Post.create(newPost, (err, post)=>{
    if(err){
      req.flash("error", err.message);
      return res.redirect("/blogpost/new");
    } else {
      // ADDS THE BLOGPOST ID TO THE USER ACCOUNT
      req.user.blogposts.push(post._id);
      req.user.save();
      req.flash("success", "We've added your post. Check it out below");
      res.redirect("/blogpost/"+post._id);
    }
  });
});

// ======================================================//
// ========================SHOW==========================//
// ======================================================//
router.get("/:postID", (req, res)=>{
  Post.findById(req.params.postID).populate('author', ['name', 'image']).exec((err, post)=>{
    if(!post || err){
      req.flash("error", "Sorry, an error occured. Please try again.");
      return res.redirect("back");
    }
    res.render("blogs/show", {post:post});
  });
});

// ======================================================//
// ========================EDIT==========================//
// ======================================================//
router.get("/:postID/edit", checkPostOwnership, (req, res)=>{
  Post.findById(req.params.postID, (err, post)=>{
    if(!post || err){
      req.flash("error", "Sorry, an error occured. Please try again.");
      return res.redirect("back");
    }
    res.render("blogs/edit", {post:post});
  });
});

// ======================================================//
// =======================UPDATE=========================//
// ======================================================//
router.put("/:postID", checkPostOwnership, (req, res)=>{
  let newPost = handleData(req.body);
  Post.findByIdAndUpdate(req.params.postID, {$set: newPost}, {new:true}, (err, updatedPost)=>{
    if(!updatedPost || err){
      req.flash("error", "Sorry, an error occured. Please try again.");
      return res.redirect("back");
    }
    req.flash("success", "Your post has been updated");
    res.redirect("/blogpost/"+updatedPost._id);
  });
});

// ======================================================//
// =======================DELETE=========================//
// ======================================================//
router.delete("/:postID", checkPostOwnership, (req, res)=>{
  Post.findById(req.params.postID, (err, post)=>{
    if(!post || err){
      req.flash("error", "Sorry, an error occured. Please try again.");
      return res.redirect('back');
    }
    User.update({_id: post.author}, {$pull: {blogposts: post._id}}, (err, user)=>{
      if(!user || err){
        req.flash("error", "Sorry, an error occured. Please try again.");
        return res.redirect('back');
      }
      post.remove();
      req.flash("success", "Post Deleted");
      res.redirect("/");
    });
  });
});

// ======================================================//
// ======================FUNCTIONS=======================//
// ======================================================//
// NOT MINIFYING THE POSTS BECAUSE IT REMOVES WHITESPACES IN PRE TAGS
function handleData(reqBody){
  let codepen  = reqBody.codepen,
      middle   = codepen.indexOf("/pen/"),
      username = codepen.slice(0, middle),
      penID    = codepen.slice(middle+5),
      // content  = htmlclean(reqBody.content),
  newPost  = {
    title: reqBody.title,
    description: reqBody.description,
    content: reqBody.content,
    codepen: {
      username: username,
      penID: penID
    },
    tags: reqBody.tags
  };
  return newPost;
}

// ======================================================//
// =======================EXPORT=========================//
// ======================================================//
module.exports = router;