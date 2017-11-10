//All the middleware is here!
var Event   = require("../models/event");
var Comment = require("../models/comment");
var User    = require("../models/user");


var middlewareObj = {};

//OWNS Event?
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

//OWNS Comment?
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

//OWNS User?
middlewareObj.checkUserOwnership = function(req, res, next) {
    
        if (req.isAuthenticated()) {
            User.findById(req.params.id, function(err, foundUser){
                if (err || !foundUser) {
                    req.flash("error", "Mitglied nicht gefunden!!!");
                    res.redirect("back");
                } else {
                    //Does the user own the user?
                    if (foundUser._id.equals(req.user._id) || req.user.isAdmin) {
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
    
//IS Logged in?
middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }    
    req.flash("error", "Du musst dich erst einloggen!");

    res.redirect("/login");
};





module.exports = middlewareObj;