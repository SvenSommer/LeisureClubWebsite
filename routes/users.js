var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Event = require("../models/event");
// ===================================
// USER ROUTES
// ===================================

//INDEX - show all User
router.get("/", function(req, res){
    // Get all users from DB
    User.find({},function(err, users){
        if(err){
            console.log(err);
        }
        else {
            res.render("users/index", {users: users, page: 'users'});
        }
    });
});

//SHOW - shows more info abaut one event
router.get("/:id", function(req, res) {
    User.findById(req.params.id, function(err, foundUser){
        if (err || !foundUser) {
            req.flash("error","Mitglied nicht gefunden!");
            res.redirect("/");
            console.log(err);
        } else {
            Event.find().where("author.id").equals(foundUser._id).exec(function(err, foundEvents){
                if (err) {
                    req.flash("error","Mitglied nicht gefunden!");
                    res.redirect("/");
                }
                res.render("users/show",{user:foundUser, events: foundEvents});
            });
        }
    });
   
});

module.exports = router;