const express = require("express");
const app = express();
const bodyParser = require("body-parser"),
    session = require("express-session"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    MetaReview = require("./models/content"),
    Comment = require("./models/comment"),
    User = require("./models/user");

var reviewRoutes = require("./routes/review");
var indexRoutes = require("./routes/index");
var commentRoutes = require("./routes/comments");

mongoose.connect("mongodb://localhost/fav_mov2", { useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(require("express-session")({
    secret: "Hello Again",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
   next();
});

app.use(indexRoutes);
app.use(reviewRoutes);
app.use(commentRoutes);


app.listen(3000, function () {
    console.log("server is starting on port " + 3000);
});