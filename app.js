var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");
    
// Requiring routes
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");
    
// Connects to DB
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });
// Use body-parser
app.use(bodyParser.urlencoded({extended: true}));
// Uses ejs templates
app.set('view engine', 'ejs');
// Use our stylesheet
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
// seedDB(); // Seed th DB
// Flash messages
app.use(flash());

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: 'Secret YelpCamp page',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// Following 3 lines come from passportLocalMongoose
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Adds currentUser and mssage to all routes and ejs templates
app.use(function(req, res, next){
    // Creates currentUser in every route = requests the user info (req.user comes from passport)
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use('/', indexRoutes);
// appends /campgrounds at the beginning of each route
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

// Starts the server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log('YelpCamp has started');
});

//MAKE SURE ./mongod IS RUNNING ON ANOHTER TERMINAL