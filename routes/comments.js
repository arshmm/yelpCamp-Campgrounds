var express = require('express');
var router = express.Router({ mergeParams: true });

var campgrounds = require('../models/campground'),
    comment = require('../models/comment');
var middleware = require("../middleware")

//new comments
router.get('/new', middleware.isLoggedin, function (req, res) {
    // find campground by id
    campgrounds.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', { campground: campground });
        }
    });
});

//creating comments
router.post('/', middleware.isLoggedin, function (req, res) {
    campgrounds.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
           
            comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
					
					comment.author.id = req.user._id
					comment.author.username = req.user.username
					comment.save()
                    campground.comments.push(comment);
                    campground.save();
					req.flash("success","Comment created")
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});


//comment edit form route
router.get("/:comment_id/edit", middleware.checkCommentOwnership ,function(req,res){
	campgrounds.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
	
			comment.findById(req.params.comment_id, function(err , comment){
				if(err){
					console.log(err)
				}else{
					 res.render('comments/edit', {campground: campground, comment:comment });
				}
			} )
           
        }
    });
})

//comment edit
router.put("/:comment_id",middleware.checkCommentOwnership , function(req , res){
	comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, function(err,comment){
		if(err){
			console.log(err)
			res.redirect("back")
		}else{
			res.redirect("/campgrounds/"+ req.params.id)
		}
	})
})

//comment destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
	comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back")
		}else{
			req.flash("success","comment descimated")
			res.redirect("/campgrounds/"+ req.params.id)
		}
	})
})


module.exports = router;