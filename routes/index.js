var express = require("express");
var router = express.Router();
var passport =  require("passport");
var User =  require("../models/user");

router.get("/", function(req, res){
   res.render("landing");
});





// ===================
// AUTH ROUTES
// ===================

// SHOW REGISTER FORM
router.get("/register", function(req, res) {
    res.render("register");
});

// HANDLE SIGNUP LOGIC
router.post("/register",function(req, res) {
    var newUser = new User({username : req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Willkommen beim Freizeitverein " + user.username);
            res.redirect("/events");       
        });
    });
});

// SHOW LOGIN FORM
router.get("/login", function(req,res){
   res.render("login"); 
});

//HANDLING LOGIN LOGIC
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/events",
        failureRedirect: "/login"
    }),  function(req, res) {
    
});

//LOGOUT ROUTE
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success","Du wurdest erfolgreich ausgeloggt!");
    res.redirect("/events");
});




module.exports = router;