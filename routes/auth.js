let express   = require("express"),
    router    = express.Router(),
    passport  = require("passport"),
    Post      = require("../models/post"),
    Test      = require("../models/testimonial");

function handleError(req, res, err){
  req.flash("error", err.message);
  return res.redirect("back");
}

// INDEX PAGE
router.get("/", (req, res)=>{
  Post.find({}).populate('author', ['name', 'image']).exec((err, posts)=>{
    if(err){   
      req.flash("error", err.message);
      return res.redirect("back"); 
    }
    Test.find({}).populate('author', ['name', 'image']).exec((err, testimonials)=>{
      if(err){
        req.flash("error", err.message);
        return res.redirect("back");
      }
      posts.sort((a,b)=> b.postDate - a.postDate);
      const featuredPost = posts.splice(posts.length-1, 1);
      res.render("index", {posts:posts, featuredPost:featuredPost, testimonials: testimonials});
    });
  });
});

// PRIVACY PAGE
router.get("/privacy", (req, res)=>{
  res.render("privacy");
});

// FAQs PAGE
router.get("/faq", (req, res)=>{
  res.render("faq");
});

// FACEBOOK LOGIN
router.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] }));
  
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    successFlash: true,
    failureRedirect: '/login',
    failureFlash: true
  })
);

// LOGIN PAGE 
router.get("/login", (req, res)=>{
  res.render("login");
});

// LOGIN LOGIC
router.post("/login", 
  passport.authenticate('local-login', { 
    successRedirect: '/',
    successFlash: true,
    failureRedirect: '/login',
    failureFlash: true
  })
);

// REGISTER PAGE
router.get("/register", (req, res)=>{
  res.render("register");
});

// REGISTER LOGIC
router.post("/register",
  passport.authenticate('local-signup', { 
    successRedirect: '/',
    successFlash: true,
    failureRedirect: '/register',
    failureFlash: true
  })
);

// LOGOUT 
router.get("/logout", (req, res)=>{
  req.logout();
  req.flash("success", "You've been logged out");
  res.redirect("/");
});

//====================//
module.exports = router;