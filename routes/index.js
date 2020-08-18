var express = require('express');
var router = express.Router();

var passport = require('passport');

var user = require('../models/user');


//root route
router.get('/', function (req, res) {
    res.render('landing');
});


//register form route
router.get('/register', function (req, res) {
    res.render('register');
});


//signing up logic
router.post('/register', function (req, res) {
    var newUser = new user({ username: req.body.username });
    user.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error",err.message)
            res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function () {
			req.flash("success","welcome to yelp camp "+ user.username)
            res.redirect('/campgrounds');
        });
    });
});


//login form route
router.get('/login', function (req, res) {
    res.render('login');
});

//logining in logic
router.post(
    '/login',
    passport.authenticate('local', { successRedirect: '/campgrounds', failureRedirect: '/login' }),
    function (req, res) {}
);


//logout route
router.get('/logout', function (req, res) {
    req.logout();
	req.flash("success","logged you out")
    res.redirect('/campgrounds');
});


module.exports = router;