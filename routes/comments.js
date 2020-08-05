var express = require("express");
var router = express.Router();
var Contents = require("../models/content");
var Comment = require("../models/comment");
var middleware = require("../middleware");


router.get("/review/:id/comments/new", middleware.isLoggedIn , function (req, res) {
    Contents.findById(req.params.id, function (err, content) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { content: content });
        }
    });    
});

router.post("/review/:id/comments", middleware.isLoggedIn, function (req, res) {
    Contents.findById(req.params.id, function (err, content) {
        if (err) {
            console.log(err);
            res.redirect("/review");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    req.flash("error", "Something went Wrong");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    content.comments.push(comment);
                    content.save();
                    req.flash("success", "successfully added comment");
                    res.redirect('/review/' + content._id);
                }
            });
        }
    });
});

router.get("/review/:id/comments/:comment_id/edit", middleware.checkCommentOwnership , function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", { content_id: req.params.id, comment: foundComment });
        }
    });
});

router.put("/review/:id/comments/:comment_id", middleware.checkCommentOwnership , function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/review/" + req.params.id);
        }
    });
});

router.delete("/review/:id/comments/:comment_id", middleware.checkCommentOwnership ,  function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success","Comment deleated")
            res.redirect("/review/" + req.params.id);
        }
    })
})




module.exports = router;