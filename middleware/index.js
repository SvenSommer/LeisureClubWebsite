//All the middleware is here!
var Event   = require("../models/event");
var Comment = require("../models/comment");
var Photo = require("../models/photo");
var User    = require("../models/user");
var Announcement = require("../models/announcement");


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

//OWNS Announcement?
middlewareObj.checkAnnouncementOwnership = function(req, res, next) {
        if (req.isAuthenticated()) {
            Announcement.findById(req.params.id, function(err, foundAnnouncement){
                if (err || !foundAnnouncement) {
                    console.log(err);
                    req.flash("error", "Ankündigung nicht gefunden!");
                    res.redirect("back");
                } else {
                    //Does the user own the event?
                    if (foundAnnouncement.author.id.equals(req.user._id) && req.user.isAdmin){
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

//OWNS Photo?
middlewareObj.checkPhotoOwnership = function(req, res, next) {
        if (req.isAuthenticated()) {
            Photo.findById(req.params.photo_id, function(err, foundPhoto){
                if (err || !foundPhoto) {
                    console.log(err);
                    req.flash("error", "Foto nicht gefunden!");
                    res.redirect("back");
                } else {
                    //Does the user own the event?
                    if (foundPhoto.uploader.id.equals(req.user._id) || req.user.isAdmin) {
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
    if (req.isAuthenticated() && req.user.isActive) {
        return next();
    } else if(!req.isAuthenticated()){
        req.flash("error", "Du musst dich erst einloggen!");
        res.redirect("/login");
    } else if(!req.user.isActive){
        req.flash("error", "Dein Account ist noch nicht freigeschaltet. Bitte wende dich an einen Administrator!");
        res.redirect("/login");
    }
   
};

//IS Admin?
middlewareObj.isAdmin = function isAdmin(req, res, next){
    if (req.isAuthenticated() && req.user.isAdmin) {
        return next();
    }    
    req.flash("error", "Du hast nicht die erforderlichen Rechte das zu tun!");
    res.redirect("back");
};





module.exports = middlewareObj;