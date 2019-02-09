var express = require("express"),
    router  = express.Router(),
    User    = require("../models/user"),
    Post    = require("../models/post"),
    Test    = require("../models/testimonial"),
 middleware = require("../middleware/middleware"),
 
{checkUserOwnership} = middleware;
    
// ======================================================//
// =========================GET==========================//
// ======================================================//
router.get("/:profileId", (req, res)=>{
    User.findById(req.params.profileId).populate('blogposts', ['title', 'description', 'postDate']).exec((err, user)=>{
        if(!user || err){
          req.flash("error", "Sorry, an error occured. Please try again.");
          return res.redirect("back");
        }
        res.render("profile/profile", {user:user}); 
    });
});

// ======================================================//
// ========================EDIT==========================//
// ======================================================//
router.get("/:profileId/edit", checkUserOwnership, (req, res)=>{
    User.findById(req.params.profileId, (err, user)=>{
        if(!user || err){
            req.flash("error", "Sorry, an error occured. Please try again.");
            return res.redirect("back");
        }
        res.render("profile/edit", {user:user});
    });
});

// ======================================================//
// =======================UPDATE=========================//
// ======================================================//
router.put("/:profileId", checkUserOwnership, (req, res)=>{
    const user = {
        name:  req.body.name, 
        email: req.body.email, 
        image: req.body.image, 
        bio:   req.body.bio
    };
    User.findByIdAndUpdate(req.params.profileId, {$set: user}, {new:true}, (err, updatedUser)=>{
        if(!updatedUser || err){
            req.flash('error', "Sorry, an error occured. Please try again.");
            return res.redirect('back');
        }
        req.flash("success", "Your profile has been updated");
        res.redirect("/profile/"+updatedUser._id);
    });
});

// ======================================================//
// =======================DELETE=========================//
// ======================================================//
router.delete("/:profileId", checkUserOwnership, (req, res)=>{
    Test.remove({author:req.params.profileId}, (err)=>{
        if(err){
            req.flash('error', err.message);
            return res.redirect('back');
        }
        Post.remove({author:req.params.profileId}, (err)=>{
            if(err){
                req.flash('error', err.message);
                return res.redirect('back');
            }
            User.findByIdAndRemove(req.params.profileId, (err)=>{
                if(err){
                    req.flash('error', err.message);
                    return res.redirect('back');
                }
                if(req.user._id.equals(req.params.profileId)){
                    req.logout();
                }
                req.flash("success", "Your profile has been deleted");
                res.redirect("/");
            });
        });
    });
});

// ======================================================//
// =======================EXPORT=========================//
// ======================================================//
module.exports = router;