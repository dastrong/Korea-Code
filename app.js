const express   = require("express"),
  bodyParser    = require("body-parser"),
  mongoose      = require("mongoose"),
  session       = require("express-session"),
  cookieParser  = require("cookie-parser"),
  flash         = require("connect-flash"),
  passport      = require("passport"),
  methodOverride= require("method-override"),
  moment        = require("moment"),
  authRoutes    = require("./routes/auth"),
  blogRoutes    = require("./routes/blog"),
  testRoutes    = require("./routes/testimonial"),
  profileRoutes = require("./routes/profile"),
  app           = express();
                  require("./config/passport")(passport);
                  require('dotenv').config();

//======================================================//  
//======================================================//  
//======================================================//  

mongoose.connect(process.env.DB_URL || process.env.DB_LOCAL);
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.locals = {
    currentUser: req.user,
    error:       req.flash('error'),
    success:     req.flash('success'),
  };
  next();
});
app.locals.moment = moment;
app.set("view engine", "ejs");

//============================================//
//===================ROUTES===================//
//============================================//
app.use("/", authRoutes);
app.use("/blogpost", blogRoutes);
app.use("/testimonial", testRoutes);
app.use("/profile", profileRoutes);

//============================================//
app.listen(process.env.PORT, function(req, res){
  console.log("Server's Up and Running");
});