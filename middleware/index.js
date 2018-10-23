var Campground = require("../models/campground");
var Comment = require("../models/comment");

// All middlewares go in here

var middlewareObj = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error', 'Please Login first!');
        res.redirect('/login');
    },
    checkCampgroundOwnership: function(req, res, next){
        // Is user logged in?
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundCampground){
                if(err || !foundCampground){
                    req.flash('error', 'Campground not found');
                    // Redirect to the previous page
                    res.redirect('back');
                } else{
                    // Does the the author's id of the campground match the user's id logged in?
                    if(foundCampground.author.id.equals(req.user._id)){
                        next();
                    } else{
                        // Redirect to the previous page
                        res.redirect('back');
                    }
                }
            });
        } else{
            req.flash('error', "You don't have permission to do that!");
            // Redirect to the previous page
            res.redirect('back');
        }
    },
    checkCommentOwnership: function(req, res, next){
        // is user logged in?
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err || !foundComment){
                    req.flash('error', 'Comment not found');
                    // Redirect to the previous page
                    res.redirect('back');
                } else{
                    // Does the the author's id of the campground match the user's id logged in?
                    if(foundComment.author.id.equals(req.user._id)){
                        next();
                    } else{
                        req.flash('error', "You don't have permission to do that");
                        // Redirect to the previous page
                        res.redirect('back');
                    }
                }
            });
        } else{
            req.flash('error', "You don't have permission to do that!");
            // Redirect to the previous page
            res.redirect('back');
        }
    }
};

module.exports = middlewareObj;