var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Root route
router.get('/', function(req, res){
    res.render('landing');
});

// ============
// AUTH ROUTES
// ============

// Register form
router.get('/register', function(req, res){
    res.render('register', {message: req.flash('error')});
});

// Handles Register form logic
router.post('/register', function(req, res){
    var newUser = new User({username: req.body.username});
   // Saving username to DB, never the password. Password is always outside of the arg to hide the password
   User.register(newUser, req.body.password, function(err, user){
       if(err){
           req.flash('error', err.message);
           return res.render('register');
       }
       // If authentication was successful
       passport.authenticate('local')(req, res, function(){
           req.flash('success', 'Welcome to yelpCamp ' + user.username);
           res.redirect('/campgrounds');
       });
   });
});

// Login form
router.get('/login', function(req, res){
    res.render('login');
});
// Handles login form logic
// passport.authenticate is a built in method from line 31
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), function(req, res){
    });

// Logout route
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'Logged you out');
    res.redirect('/campgrounds');
});

module.exports = router;