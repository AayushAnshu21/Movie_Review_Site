var express = require("express");
var router = express.Router();
var session = require("express-session");
var passport = require("passport");
var Content = require("../models/content");
var middleware = require("../middleware");
const { query } = require("express");

router.get("/", function (req, res) {
    res.redirect("/review");
});

router.get("/review", function (req, res) {
    var query = {}
    
    if (req.query.category != undefined) {
        query.category = req.query.category
    }

    Content.find(query).sort('-date').exec(function (err, content) { 
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        }
        else {
            res.render("reviews/home",{content:content});
        }
     }); 
});

router.get("/review/new",middleware.isLoggedIn, function (req, res) {
    res.render("reviews/new");
});

router.post("/review",middleware.isLoggedIn, function (req, res) {
    Content.create(req.body.review, function (err, newContent) {
        if (err) {
            req.flash("error", "Something went Wrong");
            console.log(err);
        } else {
            newContent.author.id = req.user._id;
            newContent.author.username = req.user.username;
            newContent.save();
            //console.log(newContent);
            res.redirect("/review");
        }
    });
});

router.get("/review/:id", function (req, res) {
    Content.findById(req.params.id).populate("comments").exec(function (err, content) {
        if (err) {
            console.log(err);
        } else {
            //console.log(foundCampground);
            res.render("reviews/show", { content: content });
        }
    }); 
});

router.get("/review/:id/edit",middleware.CheckContentOwnership, function (req, res) {
    Content.findById(req.params.id, function (err, content) {
        if (err) {
            res.redirect("/review")
        } else {
            res.render("reviews/edit", { content: content });
        }
    });    
});

router.put("/review/:id",middleware.CheckContentOwnership, function (req, res) {
    Content.findByIdAndUpdate(req.params.id, req.body.review, function (err, updatedContent) {
        if (err) {
            res.redirect("/review");
        } else {
            res.redirect("/review/" + req.params.id);
        }
    });
});

router.delete("/review/:id",middleware.CheckContentOwnership, function (req, res) {
    Content.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/review");
        } else {
            res.redirect("/review");
        }
    });
});


module.exports = router;