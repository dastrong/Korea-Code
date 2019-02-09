var express = require("express"),
  router  = express.Router(),
  Test    = require("../models/testimonial"),
 middleware = require("../middleware/middleware"),
 
{isLoggedIn, checkTestOwnership} = middleware;
  

// ======================================================//
// =========================NEW==========================//
// ======================================================//
router.get("/new", isLoggedIn, (req, res)=>{
  res.render("testimonials/new");
});

// ======================================================//
// =========================POST=========================//
// ======================================================//
router.post("/", isLoggedIn, (req, res)=>{
  Test.create({content: req.body.content, author: req.user._id}, (err, testimonial)=>{
    if(!testimonial || err){
      req.flash("error", "Sorry, an error occured. Please try again.");
      return res.redirect("back");
    }
    req.user.testimonial = testimonial;
    req.user.save();
    req.flash("success", "Thanks for sharing");
    res.redirect("/profile/"+testimonial.author);
  });
});

// ======================================================//
// =========================EDIT=========================//
// ======================================================//
router.get("/:testID/edit", checkTestOwnership, (req, res)=>{
  Test.findById(req.params.testID, (err, testimonial)=>{
    if(!testimonial || err){
      req.flash("error", "Sorry, an error occured. Please try again.");
      return res.redirect("back");
    }
    res.render("testimonials/edit", {testimonial:testimonial});
  });
});

// ======================================================//
// =======================UPDATE=========================//
// ======================================================//
router.put("/:testID", checkTestOwnership, (req, res)=>{
  Test.findByIdAndUpdate(req.params.testID, {content: req.body.content}, {new:true}, (err, testimonial)=>{
    if(!testimonial || err){
      req.flash("error", "Sorry, an error occured. Please try again.");
      return res.redirect("back");
    }
    req.flash("success", "Your testimonial has been updated");
    res.redirect("/profile/"+testimonial.author);
  });
});

// ======================================================//
// =======================EXPORT=========================//
// ======================================================//
module.exports = router;