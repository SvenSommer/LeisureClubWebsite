var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Event = require("../models/event");
var middleware = require("../middleware");
// ===================================
// USER ROUTES
// ===================================

//INDEX - show all User
router.get("/", middleware.isLoggedIn,function(req, res){
    // Get all users from DB
    User.find({},function(err, users){
        if(err){
            console.log(err);
        }
        else {
            res.render("users/index", {users: users, page: 'users'});
        }
    }).sort({"username":1});
});

//SHOW - shows more info abaut one event
router.get("/:id", middleware.isLoggedIn, function(req, res) {
    User.findById(req.params.id, function(err, foundUser){
        if (err || !foundUser) {
            req.flash("error","Mitglied nicht gefunden!");
            res.redirect("/");
            console.log(err);
        } else {
            Event.find().where("author.id").equals(foundUser._id).exec(function(err, foundEvents){
                if (err) {
                    req.flash("error","Organiserte Veranstaltungen nicht gefunden!");
                    res.redirect("/");
                }
                Event.find().where("subscribers").equals(foundUser._id).exec(function(err, foundeventsSubscribed){
                    if (err) {
                    req.flash("error","Veranstaltungen an denen teilgenommen wird/wurde, wurde nicht gefunden!");
                    res.redirect("/");
                    }
                    console.log("foundeventsSubscribed: "+ foundeventsSubscribed)
                    console.log("foundUser._id: "+ foundUser._id)
                    res.render("users/show",{user:foundUser, 
                                            events: foundEvents,
                                            eventsSubscribed: foundeventsSubscribed 
                    });
                });
            });
        }
    });
   
});

//EDIT - edit an existing users
router.get("/:id/edit", middleware.checkUserOwnership, function(req, res) {
    User.findById(req.params.id, function(err, foundUser){
        res.render("users/edit", {user: foundUser });
    });
});

//UPDATE - Update info
router.put("/:id",middleware.checkUserOwnership, function(req, res){
    if (!req.body.user.viewClassic) {
        req.body.user.viewClassic= false;
    }
    else {
         req.body.user.viewClassic= true;
    }
    
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
        if (err || !updatedUser) {
            req.flash("error","Mitglied nicht gefunden!");
            res.redirect("back");        
        } else {
            res.redirect("/users/" + req.params.id);
        }
        
    });
});


//DELETE ROUTE
router.delete("/:id",middleware.checkUserOwnership, function(req, res){
     User.findByIdAndRemove(req.params.id, function(err){  
     if (err) {
            console.log(err);
            res.redirect("/users");
        } else {
            req.flash('success', 'Mitglied erfolgreich gelöscht!');
            res.redirect("/users");
            
        }
    });
});

module.exports = router;