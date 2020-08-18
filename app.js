var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    campgrounds = require('./models/campground'),
    comment = require('./models/comment'),
    user = require('./models/user'),
    seedDB = require('./seeds'),
	flash = require("connect-flash");

//requiring routs
var commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index');


//seedDB();
mongoose.connect('mongodb+srv://devvvv:MANsuri@000@cluster0.1iwbi.mongodb.net/yelp_camp?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));

//PASSPORT CONFIG
app.use(
    require('express-session')({
        secret: 'blablabla',
        resave: false,
        saveUninitialized: false,
    })
);
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
	res.locals.error =  req.flash("error") 
	res.locals.success =  req.flash("success") 
    next();
});

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);



app.listen(process.env.PORT||3000, process.env.IP, function () {
    console.log('chalu ho gaya tees hazar pr');
});