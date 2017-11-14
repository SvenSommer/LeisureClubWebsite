var express = require("express");
var router = express.Router();
var Event = require("../models/event");
var Announcement =  require("../models/announcement");
var middleware = require("../middleware");
var geocoder = require('geocoder');
// ===================================
// EVENT ROUTES
// ===================================

//INDEX - show all events
router.get("/", middleware.isLoggedIn, function(req, res){
    // Get all events from DB
    Event.find().sort({"date":1}).populate("subscribers").exec(function(err, events){
        if(err){
            console.log(err);
        }
        else {
            Announcement.find().sort({"created":1}).exec(function(err, foundAnnouncements){
            if (err) {
                req.flash("error","verfasste Ankündigungen nicht gefunden!");
                res.redirect("/");
            }
            res.render("events/index", {events: events, 
                                    page: 'events',
                                    announcements: foundAnnouncements});
            });
        }
    });
});

//CREATE - add new event to DB
router.post("/", middleware.isLoggedIn, function(req,res){
    
   // req.body.event.body = req.sanitize(req.body.event.body);
    
    var title = req.body.title;
    var image =  req.body.image;
    var description =req.body.description;
    var meetingpoint =req.body.meetingpoint;
    var date =req.body.date;
    var time =req.body.time;
    var deadline =req.body.deadline;
    var maxSubscribers = req.body.maxSubscribers;
    var fee =req.body.fee;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    geocoder.geocode(req.body.location, function (err, data) {
        var lat = "";
        var lng = "";
        var location = req.body.location;
        if (data.results[0]) {
            lat = data.results[0].geometry.location.lat;
            lng = data.results[0].geometry.location.lng;
            location = data.results[0].formatted_address;
        }
    
        var newEvent = {
            title : title,
            author: author,
            image: image,
            description : description,
            location : location,
            lat: lat, 
            lng: lng,
            meetingpoint : meetingpoint,
            date : date,
            time : time,
            deadline : deadline,
            maxSubscribers : maxSubscribers,
            fee : fee
            };
        // Create a new Event and save to DB
        Event.create(newEvent, function(err, newlyCreated){
           if(err){
               console.log(err);
           } 
           else {
                 res.redirect("/events");
           }
        });
    });
});

//NEW - show form to create Event
router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("events/new"); 
});



//SHOW - shows more info about one event
router.get("/:id",middleware.isLoggedIn, function(req, res) {
    Event.findById(req.params.id).populate("comments").populate("subscribers").exec(function(err, foundEvent){
        if (err || !foundEvent) {
            req.flash("error","Veranstaltung nicht gefunden!");
            res.redirect("back");
            console.log(err);
        } else {
            res.render("events/show",{event:foundEvent}); 
        }
    });
   
});

//EDIT - edit an existing Event
router.get("/:id/edit", middleware.checkEventOwnership, function(req, res) {
    Event.findById(req.params.id, function(err, foundEvent){
        res.render("events/edit", {event: foundEvent });
    });
});


//UPDATE ROUTE
router.put("/:id", middleware.checkEventOwnership, function(req,res){
    //req.body = req.sanitize(req.body);
    geocoder.geocode(req.body.location, function (err, data) {
        var lat = "";
        var lng = "";
        var location =req.body.location;
        if (data.results[0]) {
            lat = data.results[0].geometry.location.lat;
            lng = data.results[0].geometry.location.lng;
            location = data.results[0].formatted_address;
        }

    var newData = 
    {
        title: req.body.title, 
        image: req.body.image, 
        description: req.body.description, 
        location : location,
        lat: lat, 
        lng: lng,
        meetingpoint: req.body.meetingpoint, 
        date: req.body.date, 
        time: req.body.time, 
        deadline: req.body.deadline, 
        maxSubscribers : req.body.maxSubscribers,
        fee: req.body.fee
    };
    Event.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Erfolgreich bearbeitet!");
            res.redirect("/events/" + campground._id);
        }
    });
  });
});

//DELETE ROUTE
router.delete("/:id",middleware.checkEventOwnership, function(req, res){
     Event.findByIdAndRemove(req.params.id, function(err){  
     if (err) {
            console.log(err);
            res.redirect("/events");
        } else {
            req.flash('success', 'Veranstaltung erfolgreich gelöscht!');
            res.redirect("/events");
        }
    });
});



module.exports = router;