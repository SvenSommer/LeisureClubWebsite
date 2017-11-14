var express = require("express");
var router = express.Router({mergeParams: true});
var Announcement = require("../models/announcement");
var User = require("../models/user");
var middleware = require("../middleware");

// ============================================
// ANNOUNCEMENT ROUTES
// ============================================

//INDEX - show all ANNOUNCEMENT
router.get("/", middleware.isLoggedIn, function(req, res){
    // Get all events from DB
    Announcement.find().sort({"date":1}).exec(function(err, announcements){
        if(err){
            console.log(err);
        }
        else {
            res.render("announcements/index", {announcements: announcements, 
                                    page: 'announcements',});
        }
    });
});


// ANNOUNCEMENT NEW
router.get("/new", middleware.isAdmin,  function(req,res){
    res.render("announcements/new");
});

//ANNOUNCEMENT CREATE
router.post("/", middleware.isAdmin, function(req,res){
    console.log("Announcement received!");
    Announcement.create(req.body.announcement, function(err, announcement) {
        if (err) {
            req.flash("error", "Da ist etwas schief gelaufen.");
            console.log(err);
        }   else {
            
            
            //add username and id to announcement
            announcement.author.id = req.user._id;
            announcement.author.username = req.user.username;
            //save announcement
            announcement.save();


            req.flash("success", "Ankündigung erfolgreich hinzugefügt.");
            res.redirect("/users/" + req.user._id);
        }
    });
});

//SHOW - shows more info about one Announcement
router.get("/:id",middleware.isLoggedIn, function(req, res) {
    Announcement.findById(req.params.id).exec(function(err, foundAnnouncement){
        if (err || !foundAnnouncement) {
            req.flash("error","Ankündigung nicht gefunden!");
            res.redirect("back");
            console.log(err);
        } else {
            res.render("announcements/show",{announcement:foundAnnouncement}); 
        }
    });
   
});

//EDIT - edit an existing Event
router.get("/:id/edit", middleware.checkAnnouncementOwnership, function(req, res) {
    Announcement.findById(req.params.id, function(err, foundAnnouncement){
         if (err || !foundAnnouncement) {
            req.flash("error","Ankündigung nicht gefunden!");
            res.redirect("back");
        } else {
             res.render("announcements/edit", {announcement: foundAnnouncement });
        }
        
    });
});


//ANNOUNCEMENT UPDATE ROUTE
router.put("/:id", middleware.checkAnnouncementOwnership, function(req,res){
    Announcement.findByIdAndUpdate(req.params.id, req.body.announcement, function(err, updatedAnnouncement){
        if (err || !updatedAnnouncement) {
            console.log(err);
            req.flash("error","Ankündigung nicht gefunden!");
            res.redirect("back");        
        } else {
            res.redirect("/announcements/" + req.params.id);
        }
        
    });
});

//ANNOUNCEMENT DESTROY ROUTE
router.delete("/:id",middleware.checkAnnouncementOwnership, function(req, res){
    Announcement.findByIdAndRemove(req.params.id, function(err){  
     if (err) {
         req.flash("error","Ankündigung nicht gefunden!");
         res.redirect("back");  
     } else
     {
         req.flash("success", "Ankündigung erfolgreich gelöscht!");
         res.redirect("/users/" + req.user._id);
     }
      
    });
});

router.post("/:id/accept", middleware.isLoggedIn, function(req, res){
    Announcement.findById(req.params.id, function(err, foundAnnouncement){
         if (err || !foundAnnouncement) {
            req.flash("error","Ankündigung nicht gefunden!");
            res.redirect("back");
        } else {
            foundAnnouncement.accepted.push({id:req.user._id, username: req.user.username}); 
            console.log( foundAnnouncement);
            foundAnnouncement.save();
            console.log(req.user.username + "("+ req.user.id +") has accepted announcement " + req.params.id);
            res.redirect("back");
            }
            
        });
});




module.exports = router;