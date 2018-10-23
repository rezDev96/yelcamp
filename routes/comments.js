var express = require("express");
// Merges params from campgrounds.js and comments.js together
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// GET Comment form
router.get('/new', middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
             console.log(err);
        } else{
            res.render('comments/new', {campground: campground});
        }
    });
});

// POST Comment route
router.post('/', middleware.isLoggedIn, function(req, res){
    // Look up campground using id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        } else{
            // Create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash('error', 'Something went wrong!');
                    console.log(err);
                } else{
                    // Add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // Save comment
                    comment.save();
                    // Connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success', 'Comment successfully posted');
                    // Redirect to campground show page
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

// GET Comment edit route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundcampground){
        if(err || !foundcampground){
            req.flash('error', 'Campground not found');
            return res.redirect('back');
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect('back');
            } else{
                res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
            }
        });
    });
});

// PUT comment update
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect('back');
        } else{
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// DELETE comment
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect('back');
        } else{
            req.flash('success', 'Comment deleted');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

module.exports = router;