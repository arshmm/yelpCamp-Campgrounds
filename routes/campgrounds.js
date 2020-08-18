var express = require('express');
var router = express.Router();
var campgrounds = require('../models/campground');
var middleware = require("../middleware")

//index campground
router.get('/', function (req, res) {
    campgrounds.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
			
            res.render('campgrounds/index', { campgrounds: campgrounds, currentUser: req.user });
        }
    });
});

//campgrounds create form
router.get('/new', middleware.isLoggedin, function (req, res) {
    res.render('campgrounds/new');
});

//creating campgrounds
router.post('/', middleware.isLoggedin, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
	var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username,
    };
    var newCampground = { name: name, image: image, price:price , description: desc, author: author };
    campgrounds.create(newCampground, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
			console.log(campgrounds)
            res.redirect('/campgrounds');
        }
    });
});

//show route campgrounds
router.get('/:id', function (req, res) {
    campgrounds
        .findById(req.params.id)
        .populate('comments')
        .exec(function (err, foundCampground) {
            if (err) {
                console.log(err);
            } else {
                res.render('campgrounds/show', { campground: foundCampground });
            }
        });
});


// edit campground
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req,res){
	 campgrounds.findById(req.params.id, function(err, campground){
		 if(err){
			 res.redirect("/")
		 }else{
			 res.render("campgrounds/edit",{campground: campground})
		 }
	 })
	
})

//update campground
router.put("/:id",middleware.checkCampgroundOwnership, function(req,res){
	 campgrounds.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
})

//delete
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	campgrounds.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
      }
   });
})


module.exports = router;