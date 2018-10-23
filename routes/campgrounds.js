var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware")

// INDEX - Show all campgrounds
router.get('/', function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render('campgrounds/index', {campgrounds: allCampgrounds});
        }
    });
});

// CREATE - Add new campground to DB
router.post('/', middleware.isLoggedIn, function(req, res){
    // Get data from form and push it in to the DB
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    // Create a new campground to the DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            // Redirect to campgrounds
            res.redirect('/campgrounds');
        }
    });
});

// NEW - Show form to create new campground
router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render('campgrounds/new');
});

// SHOW - shows more info about one campground
router.get('/:id', function(req, res){
    // Find campground with provided ID
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
       if(err || !foundCampground){
            req.flash('error', 'Campground not found');
            res.redirect('back');
       } else{
            // render show template with that campground
            res.render('campgrounds/show', {campground: foundCampground});
       }
    });
});

// EDIT - edit the posted Campground
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render('campgrounds/edit', {campground: foundCampground});
    });
});

// UPDATE - update the campground
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
    // Find and update the correct campground:(finds id from url, grabs data from form, callback)
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect('/campgrounds');
        } else{
            // Redirect somewhere (show page)
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// DESTROY - delete campground
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/campgrounds');
        } else{
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;