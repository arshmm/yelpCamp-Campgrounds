var campgrounds = require("../models/campground")
var comment = require("../models/comment")

middlewareObj = {}
 middlewareObj.isLoggedin = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
	req.flash("error", "Please login first!")
    res.redirect('/login');
}

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        campgrounds.findById(req.params.id, function(err, foundCampground){
           if(err){
			   req.flash("error", "Campground not found")
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
				req.flash("error","You dont have permission to do that")
                res.redirect("back");
            }
           }
        });
    } else {
		req.flash("error", "Please login first!")
        res.redirect("back");
    }
}
	

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
				req.flash("error","You dont have permission to do that")
                res.redirect("back");
            }
           }
        });
    } else {
		req.flash("error", "Please login first!")
        res.redirect("back");
    }
}
	
 


module.exports = middlewareObj


