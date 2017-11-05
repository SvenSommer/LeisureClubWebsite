//All the middleware is here!
var Event = require("../models/event");
var Comment = require("../models/comment");


var middlewareObj = {};

middlewareObj.checkEventOwnership = function(req, res, next) {
        if (req.isAuthenticated()) {
            Event.findById(req.params.id, function(err, foundEvent){
                if (err || !foundEvent) {
                    console.log(err);
                    req.flash("error", "Event nicht gefunden!");
                    res.redirect("back");
                } else {
                    //Does the user own the event?
                    if (foundEvent.author.id.equals(req.user._id) || req.user.isAdmin) {
                       next();
                    }
                    else{
                        req.flash("error", "Du nicht die erforderlichen Rechte das zu tun.");
                        res.redirect("back");
                    }
                }
            });
        }else{
           res.redirect("back");
        }
};


middlewareObj.checkCommentOwnership = function(req, res, next) {
        if (req.isAuthenticated()) {
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if (err || !foundComment) {
                    console.log(err);
                    req.flash("error", "Kommentar nicht gefunden!");
                    res.redirect("back");
                } else {
                    //Does the user own the event?
                    if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                       next();
                    }
                    else{
                         req.flash("error", "Du nicht die erforderlichen Rechte das zu tun.");
                         res.redirect("back");
                    }
                }
            });
        } else {
           req.flash("error", "Du musst dich erst einloggen!");
           res.redirect("back");
        }
};
    
//MIDDLEWARE
middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }    
    req.flash("error", "Du musst dich erst einloggen!");
    res.redirect("/login");
};



module.exports = middlewareObj;