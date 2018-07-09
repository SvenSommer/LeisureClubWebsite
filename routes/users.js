var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Event = require("../models/event");
var Announcement =  require("../models/announcement");
var middleware = require("../middleware");
var multer = require('multer');
var cloudinary = require('cloudinary');

// ===================================
// IMAGE UPLOAD
// ===================================
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Es sind nur Bilddateien erlaubt!'), false);
    }
    cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter})


cloudinary.config({ 
  cloud_name: 'lustige-truppe', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});
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

//SHOW - shows more information about one event
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
                Event.find().where("subscribers.id").equals(foundUser._id).exec(function(err, foundeventsSubscribed){
                    if (err) {
                    req.flash("error","Veranstaltungen an denen teilgenommen wird/wurde, wurde nicht gefunden!");
                    res.redirect("/");
                    }
                    Announcement.find().where("author.id").equals(foundUser._id).exec(function(err, foundAnnouncements){
                        if (err) {
                            req.flash("error","verfasste Ankündigungen nicht gefunden!");
                            res.redirect("/");
                        }
                        res.render("users/show",{user:foundUser, 
                                                events: foundEvents,
                                                eventsSubscribed: foundeventsSubscribed ,
                                                announcements: foundAnnouncements});
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
router.put("/:id",middleware.checkUserOwnership, upload.single('user[avatar]'), function(req, res){
    if (!req.body.user.viewClassic) {
        req.body.user.viewClassic= false;
    }
    else {
        req.body.user.viewClassic= true;
    }
            
    User.findById(req.params.id, function(err, foundUser){
        if (!req.hasOwnProperty('file')) {
            console.log("taking old avatar: " + foundUser.avatar + "...");
            req.body.user.avatar = foundUser.avatar;
            User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
                if (err || !updatedUser) {
                    req.flash("error","Mitglied nicht gefunden!");
                    res.redirect("back");        
                } else {
                    res.redirect("/users/" + req.params.id);
                }
            });
        } else {
            console.log("Uploading new avatar: " +req.file.path + "...");
            cloudinary.uploader.upload(req.file.path, function(cloudinaryresult) {
                console.log("Avatar saved at " + cloudinaryresult.secure_url);
                req.body.user.avatar = cloudinaryresult.secure_url;
                    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
                        if (err || !updatedUser) {
                            req.flash("error","Mitglied nicht gefunden!");
                            res.redirect("back");        
                        } else {
                            res.redirect("/users/" + req.params.id);
                        }
                });
            });
        }
    });
});


//DELETE ROUTE
router.delete("/:id",middleware.isAdmin, function(req, res){
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

//Toogle Active - toogle active status
router.get("/:id/toggle_active", middleware.isAdmin, function(req, res) {
    User.findById(req.params.id, function(err, foundUser){
        if (err) {
            console.log(err);
        }
        if (foundUser.isActive) {
            foundUser.isActive = false;
            req.flash('success', foundUser.username + ' wurde gesperrt!');
        } else {
            foundUser.isActive = true;
            req.flash('success', foundUser.username + ' wurde freigeschaltet!');
        }
        foundUser.save();
        res.redirect("/users/");
    });
});

module.exports = router;